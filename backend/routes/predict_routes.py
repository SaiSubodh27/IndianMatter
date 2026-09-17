import traceback
from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from pydantic import BaseModel, Field
from services.prediction_service import PredictionService

router = APIRouter(prefix="/api/predict", tags=["Property Prediction"])

# Initialize prediction service singleton
prediction_service = PredictionService()


# Request Schema for direct JSON inputs
class StructuredPredictionRequest(BaseModel):
    cif_string: str = Field(..., description="Raw string content of the CIF file")
    model_name: str = Field(
        default="chgnet", 
        description="Target model architecture: 'chgnet', 'm3gnet', or 'mace'"
    )
    requested_properties: Optional[List[str]] = Field(
        default=None,
        description="List of properties to calculate: ['mechanical', 'thermal', 'electrical']"
    )


# Response Schema
class MaterialMetadata(BaseModel):
    formula: str
    volume_A3: float
    density_g_cm3: float
    num_sites: int


class PredictionResponse(BaseModel):
    status: str
    material_metadata: MaterialMetadata
    model_used: str
    base_outputs: dict
    properties: dict


@router.post(
    "/cif-file",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict properties from uploaded CIF file",
    description="Upload a .cif structure file and select an ML Interatomic Potential model to calculate derived physical properties."
)
async def predict_from_cif_file(
    file: UploadFile = File(..., description="Target CIF file for material structure analysis"),
    model_name: str = Form("chgnet", description="Model adapter to use: 'chgnet', 'm3gnet', or 'mace'"),
    properties: Optional[List[str]] = Form(
        None, 
        description="Target property categories to evaluate (e.g. mechanical, thermal, electrical)"
    )
):
    # 1. Validate File Extension
    if not file.filename.endswith((".cif", ".CIF")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only standard Crystallographic Information Files (.cif) are supported."
        )

    try:
        # 2. Read contents of uploaded CIF file
        content_bytes = await file.read()
        cif_string = content_bytes.decode("utf-8")

        if not cif_string.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded CIF file is empty."
            )

        # 3. Clean up input properties list if passed via form multi-select
        formatted_properties = None
        if properties:
            # Flattens comma-separated entries if submitted as a single string form field
            formatted_properties = []
            for prop in properties:
                formatted_properties.extend([p.strip().lower() for p in prop.split(",") if p.strip()])

        # 4. Dispatch prediction task
        result = await prediction_service.predict_from_cif(
            cif_string=cif_string,
            model_name=model_name.lower().strip(),
            requested_properties=formatted_properties
        )

        return PredictionResponse(
            status="success",
            material_metadata=result["material_metadata"],
            model_used=result["model_used"],
            base_outputs=result["base_outputs"],
            properties=result["properties"]
        )

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"CIF Parsing or Model Error: {str(ve)}"
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during property calculation: {str(e)}"
        )


@router.post(
    "/cif-string",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict properties from raw CIF text payload"
)
async def predict_from_cif_string(payload: StructuredPredictionRequest):
    """Direct JSON endpoint alternative to file upload."""
    try:
        result = await prediction_service.predict_from_cif(
            cif_string=payload.cif_string,
            model_name=payload.model_name.lower().strip(),
            requested_properties=payload.requested_properties
        )

        return PredictionResponse(
            status="success",
            material_metadata=result["material_metadata"],
            model_used=result["model_used"],
            base_outputs=result["base_outputs"],
            properties=result["properties"]
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Structure Parsing Error: {str(ve)}"
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction service failure: {str(e)}"
        )