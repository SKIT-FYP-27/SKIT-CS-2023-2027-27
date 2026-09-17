from fastapi import FastAPI

from ML_Service.api.routes import router

app = FastAPI(
    title="UEI ML Service",
    description="Machine learning service for UEI student risk prediction.",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    """
    Check whether the ML service is running.
    """

    return {
        "status": "healthy",
        "service": "UEI ML Service",
    }


app.include_router(router)