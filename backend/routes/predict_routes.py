import traceback
from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from pydantic import BaseModel, Field
from services.prediction_service import PredictionService

router = APIRouter(prefix="/api/predict", tags=["Property Prediction"])
prediction_service = PredictionService()

class StructuredPredictionRequest(BaseModel):
    cif_string: str = Field(..., description="Raw string content of the CIF file")
    model_name: str = Field(default="chgnet", description="Target model architecture")
    requested_properties: Optional[List[str]] = Field(default=None)

@router.post("/cif-file", status_code=status.HTTP_200_OK)
async def predict_from_cif_file(
    file: UploadFile = File(..., description="Target CIF file for material structure analysis"),
    model_name: str = Form("chgnet", description="Model adapter to use"),
    properties: Optional[List[str]] = Form(None, description="Target property keys or categories")
):
    if not file.filename.lower().endswith(".cif"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only Crystallographic Information Files (.cif) are supported."
        )

    try:
        content_bytes = await file.read()
        cif_string = content_bytes.decode("utf-8")

        if not cif_string.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded CIF file is empty."
            )

        # Format multi-select form fields safely
        formatted_properties = []
        if properties:
            for prop in properties:
                formatted_properties.extend([p.strip().lower() for p in prop.split(",") if p.strip()])

        result = await prediction_service.predict_from_cif(
            cif_string=cif_string,
            model_name=model_name.lower().strip(),
            requested_properties=formatted_properties
        )

        return {
            "status": "success",
            "material_metadata": result["material_metadata"],
            "model_used": result["model_used"],
            "base_outputs": result["base_outputs"],
            "properties": result["properties"]
        }

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Parsing or Model Error: {str(ve)}"
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal prediction failure: {str(e)}"
        )