from pathlib import Path

import joblib
import pandas as pd
import shap


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "models" / "risk_model.joblib"


# --------------------------------------------------
# Load trained model
# --------------------------------------------------

bundle = joblib.load(MODEL_PATH)

model = bundle["model"]
features = bundle["features"]


# --------------------------------------------------
# SHAP explainer
# --------------------------------------------------

explainer = shap.TreeExplainer(model)


# --------------------------------------------------
# Risk-level mapping
# --------------------------------------------------

def get_risk_level(probability):
    if probability >= 0.75:
        return "CRITICAL"
    elif probability >= 0.50:
        return "HIGH"
    elif probability >= 0.25:
        return "MEDIUM"
    else:
        return "LOW"


# --------------------------------------------------
# SHAP value handling
# --------------------------------------------------

def get_positive_class_shap(input_data):
    """
    Extract SHAP values representing the at-risk class.

    SHAP can return different shapes depending on the
    installed SHAP/model version.
    """

    shap_values = explainer.shap_values(input_data)

    # Older SHAP versions may return:
    # [class_0_values, class_1_values]
    if isinstance(shap_values, list):
        return shap_values[1][0]

    # Newer SHAP versions may return:
    # (samples, features, classes)
    if len(shap_values.shape) == 3:
        return shap_values[0, :, 1]

    # Binary output:
    # (samples, features)
    return shap_values[0]


# --------------------------------------------------
# Prediction function
# --------------------------------------------------

def predict_risk(
    current_semester,
    current_cgpa,
    overall_attendance,
):
    """
    Predict academic risk and explain the prediction.
    """

    input_data = pd.DataFrame(
        [{
            "current_semester": current_semester,
            "current_cgpa": current_cgpa,
            "overall_attendance": overall_attendance,
        }],
        columns=features,
    )

    # Prediction
    probability = float(
        model.predict_proba(input_data)[0][1]
    )

    prediction = int(
        model.predict(input_data)[0]
    )

    risk_level = get_risk_level(probability)

    # SHAP explanation
    shap_values = get_positive_class_shap(input_data)

    explanations = []

    for feature, value, shap_value in zip(
        features,
        input_data.iloc[0],
        shap_values,
    ):
        explanations.append({
            "feature": feature,
            "value": float(value),
            "shap_value": round(float(shap_value), 6),
            "direction": (
                "increases risk"
                if shap_value > 0
                else "decreases risk"
            ),
        })

    # Most influential factors first
    explanations.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True,
    )

    return {
        "predicted_at_risk": prediction,
        "risk_probability": round(probability, 4),
        "risk_level": risk_level,
        "top_factors": explanations,
    }


# --------------------------------------------------
# Manual test
# --------------------------------------------------

if __name__ == "__main__":

    result = predict_risk(
        current_semester=6,
        current_cgpa=5.64,
        overall_attendance=71.9,
    )

    print("=" * 60)
    print("UEI STUDENT RISK PREDICTION")
    print("=" * 60)

    print(f"Predicted at risk : {result['predicted_at_risk']}")
    print(f"Risk probability  : {result['risk_probability']}")
    print(f"Risk level        : {result['risk_level']}")

    print("\nTop contributing factors:")

    for factor in result["top_factors"]:
        print(
            f"  {factor['feature']}: "
            f"{factor['value']} | "
            f"SHAP = {factor['shap_value']:+.6f} "
            f"({factor['direction']})"
        )