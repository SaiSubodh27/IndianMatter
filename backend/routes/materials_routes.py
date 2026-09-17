from typing import Optional

from fastapi import APIRouter, Query
from services.material_filter_service import (
    filter_materials,
    DISPLAY_PROPERTIES,
)

router = APIRouter()


@router.get("/features")
def get_material_features():
    """
    Return the available material properties that can be requested
    from the 38510-material dataset.
    """
    return {
        "properties": [
            {
                "key": key,
                "column": column,
            }
            for key, column in DISPLAY_PROPERTIES.items()
        ]
    }


@router.get("/explore")
def explore_materials(
    elements: Optional[str] = Query(
        default=None,
        description="Comma-separated element symbols, e.g. Li,Ag"
    ),
    match_mode: str = Query(
        default="any",
        description="Element matching mode: any, all, or exact"
    ),
    columns: Optional[str] = Query(
        default=None,
        description="Comma-separated property keys to return"
    ),
):
    """
    Explore/filter the 38510-material dataset.

    Examples:
        /api/materials/explore
        /api/materials/explore?elements=Li,Ag
        /api/materials/explore?elements=Li,Ag&match_mode=all
        /api/materials/explore?elements=Li&columns=band_gap,bulk_modulus
    """

    # Convert comma-separated query parameters into lists
    element_list = (
        [e.strip() for e in elements.split(",") if e.strip()]
        if elements
        else None
    )

    column_list = (
        [c.strip() for c in columns.split(",") if c.strip()]
        if columns
        else None
    )

    # Validate match mode
    if match_mode not in {"any", "all", "exact"}:
        match_mode = "any"

    results = filter_materials(
        elements=element_list,
        match_mode=match_mode,
        columns=column_list,
    )

    return {
        "count": len(results),
        "results": results,
    }