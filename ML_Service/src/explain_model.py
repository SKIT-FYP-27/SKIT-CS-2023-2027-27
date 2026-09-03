from pathlib import Path

import joblib
import pandas as pd
import shap


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "models" / "risk_model.joblib"
DATA_PATH = BASE_DIR / "data" / "processed" / "uei_risk_dataset.csv"


# --------------------------------------------------
# Load model
# --------------------------------------------------

bundle = joblib.load(MODEL_PATH)

model = bundle["model"]
features = bundle["features"]

print("=" * 60)
print("SHAP MODEL EXPLANATION")
print("=" * 60)

print("Model:", bundle["model_name"])
print("Features:", features)


# --------------------------------------------------
# Load dataset
# --------------------------------------------------

df = pd.read_csv(DATA_PATH)

X = df[features]


# --------------------------------------------------
# Create SHAP explainer
# --------------------------------------------------

explainer = shap.TreeExplainer(model)

shap_values = explainer.shap_values(X)


# --------------------------------------------------
# Handle different SHAP output formats
# --------------------------------------------------

if isinstance(shap_values, list):
    # Older SHAP versions:
    # [class_0_values, class_1_values]
    values = shap_values[1]

elif hasattr(shap_values, "ndim") and shap_values.ndim == 3:
    # Newer SHAP versions:
    # (samples, features, classes)
    values = shap_values[:, :, 1]

else:
    # Standard 2D format:
    # (samples, features)
    values = shap_values


print("\nSHAP values shape:", values.shape)


# --------------------------------------------------
# Global SHAP importance
# --------------------------------------------------

mean_abs_shap = pd.DataFrame({
    "Feature": features,
    "Mean_Absolute_SHAP": abs(values).mean(axis=0)
})

mean_abs_shap = mean_abs_shap.sort_values(
    "Mean_Absolute_SHAP",
    ascending=False
)


print("\n" + "=" * 60)
print("GLOBAL SHAP IMPORTANCE")
print("=" * 60)

print(
    mean_abs_shap.to_string(
        index=False,
        float_format=lambda x: f"{x:.6f}"
    )
)


# --------------------------------------------------
# Explain one at-risk student
# --------------------------------------------------

at_risk_index = df.index[df["at_risk"] == 1][0]

student = X.loc[[at_risk_index]]

student_shap = values[at_risk_index]


explanation = pd.DataFrame({
    "Feature": features,
    "Value": student.iloc[0].values,
    "SHAP_Value": student_shap
})


explanation["Impact"] = explanation["SHAP_Value"].apply(
    lambda x: "Increases risk" if x > 0 else "Decreases risk"
)


explanation = explanation.sort_values(
    "SHAP_Value",
    key=lambda x: abs(x),
    ascending=False
)


print("\n" + "=" * 60)
print("INDIVIDUAL STUDENT EXPLANATION")
print("=" * 60)

print("\nStudent features:")

print(
    student.to_string(index=False)
)

print("\nSHAP contributions:")

print(
    explanation.to_string(
        index=False,
        float_format=lambda x: f"{x:.6f}"
    )
)