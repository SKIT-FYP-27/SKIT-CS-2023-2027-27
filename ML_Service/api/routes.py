from fastapi import APIRouter, HTTPException

from ML_Service.api.schemas import PredictionRequest, PredictionResponse
from ML_Service.src.predict import predict_risk


router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict_student_risk(request: PredictionRequest):
    """
    Predict the risk level of a student using the trained ML model.
    """

    try:
        result = predict_risk(
            current_semester=request.current_semester,
            current_cgpa=request.current_cgpa,
            overall_attendance=request.overall_attendance,
        )

        return result

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="ML model is unavailable.",
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Prediction failed.",
        )