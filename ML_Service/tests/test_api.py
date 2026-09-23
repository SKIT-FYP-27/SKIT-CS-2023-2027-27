from fastapi.testclient import TestClient

from ML_Service.api.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "UEI ML Service",
    }


def test_predict_endpoint_with_valid_data():
    response = client.post(
        "/predict-risk",
        json={
            "current_semester": 6,
            "current_cgpa": 5.64,
            "overall_attendance": 71.9,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "predicted_at_risk" in data
    assert "risk_probability" in data
    assert "risk_level" in data
    assert "top_factors" in data


def test_predict_endpoint_rejects_invalid_semester():
    response = client.post(
        "/predict-risk",
        json={
            "current_semester": 9,
            "current_cgpa": 5.64,
            "overall_attendance": 71.9,
        },
    )

    assert response.status_code == 422


def test_predict_endpoint_rejects_invalid_cgpa():
    response = client.post(
        "/predict-risk",
        json={
            "current_semester": 6,
            "current_cgpa": 11,
            "overall_attendance": 71.9,
        },
    )

    assert response.status_code == 422


def test_predict_endpoint_rejects_invalid_attendance():
    response = client.post(
        "/predict-risk",
        json={
            "current_semester": 6,
            "current_cgpa": 5.64,
            "overall_attendance": 101,
        },
    )

    assert response.status_code == 422


def test_predict_endpoint_requires_all_fields():
    response = client.post(
        "/predict-risk",
        json={
            "current_semester": 6,
        },
    )

    assert response.status_code == 422