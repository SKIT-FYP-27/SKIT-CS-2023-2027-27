from pathlib import Path
import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = BASE_DIR / "models" / "risk_model.joblib"
DATA_PATH = BASE_DIR / "data" / "processed" / "uei_risk_dataset.csv"

# Load saved model
bundle = joblib.load(MODEL_PATH)

model = bundle["model"]
features = bundle["features"]

print("=" * 60)
print("SAVED MODEL")
print("=" * 60)

print("Model:", bundle["model_name"])
print("Features:", features)

# Random Forest exposes feature_importances_
if hasattr(model, "feature_importances_"):

    importance = pd.DataFrame({
        "Feature": features,
        "Importance": model.feature_importances_
    }).sort_values(
        "Importance",
        ascending=False
    )

    print("\n" + "=" * 60)
    print("RANDOM FOREST FEATURE IMPORTANCE")
    print("=" * 60)

    print(importance.to_string(index=False))

else:
    print("\nThe selected model does not expose feature_importances_.")