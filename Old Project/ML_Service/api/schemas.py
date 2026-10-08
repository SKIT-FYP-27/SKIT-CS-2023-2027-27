from typing import Any

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    current_semester: int = Field(..., ge=1, le=6)
    current_cgpa: float = Field(..., ge=0, le=10)
    overall_attendance: float = Field(..., ge=0, le=100)


class PredictionResponse(BaseModel):
    predicted_at_risk: int
    risk_probability: float
    risk_level: str
    top_factors: list[dict[str, Any]]