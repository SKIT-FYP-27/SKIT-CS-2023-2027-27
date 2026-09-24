from ML_Service.src.predict import predict_risk
import pytest


def test_prediction_returns_expected_fields():
    result = predict_risk(
        current_semester=6,
        current_cgpa=5.64,
        overall_attendance=71.9,
    )

    expected_fields = {
        "predicted_at_risk",
        "risk_probability",
        "risk_level",
        "top_factors",
    }

    assert expected_fields.issubset(result.keys())


def test_prediction_has_valid_risk_value():
    result = predict_risk(
        current_semester=6,
        current_cgpa=5.64,
        overall_attendance=71.9,
    )

    assert result["predicted_at_risk"] in {0, 1}


def test_prediction_probability_is_valid():
    result = predict_risk(
        current_semester=6,
        current_cgpa=5.64,
        overall_attendance=71.9,
    )

    assert 0 <= result["risk_probability"] <= 1


def test_prediction_has_valid_risk_level():
    result = predict_risk(
        current_semester=6,
        current_cgpa=5.64,
        overall_attendance=71.9,
    )

    assert result["risk_level"] in {"LOW", "MEDIUM", "HIGH"}
    assert result["risk_level"] != "CRITICAL"


def test_prediction_returns_top_factors():
    result = predict_risk(
        current_semester=6,
        current_cgpa=5.64,
        overall_attendance=71.9,
    )

    assert isinstance(result["top_factors"], list)
    assert len(result["top_factors"]) > 0


def test_top_factors_have_expected_structure():
    result = predict_risk(
        current_semester=6,
        current_cgpa=5.64,
        overall_attendance=71.9,
    )

    for factor in result["top_factors"]:
        assert "feature" in factor
        assert "shap_value" in factor


def test_prediction_fails_when_model_is_missing(monkeypatch):
    from ML_Service.src import predict

    monkeypatch.setattr(
        predict,
        "MODEL_PATH",
        predict.MODEL_PATH.parent / "missing_model.joblib",
    )

    predict.load_model.cache_clear()

    with pytest.raises(FileNotFoundError):
        predict.load_model()

    predict.load_model.cache_clear()