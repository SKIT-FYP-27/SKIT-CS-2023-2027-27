from pathlib import Path

import pandas as pd


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]

DATASET_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "uei_risk_dataset.csv"
)


# --------------------------------------------------
# Load dataset
# --------------------------------------------------

df = pd.read_csv(DATASET_PATH)


# --------------------------------------------------
# Define target and allowed features
# --------------------------------------------------

TARGET = "at_risk"

ALLOWED_FEATURES = {
    "current_semester",
    "current_cgpa",
    "overall_attendance",
}

LEAKAGE_COLUMNS = {
    "risk_score",
    "risk_level",
    "primary_risk_factor",
    "shap_explanation",
}


# --------------------------------------------------
# Check target
# --------------------------------------------------

print("=" * 60)
print("TARGET & DATA LEAKAGE CHECK")
print("=" * 60)

print("\nTarget:")
print(f"  {TARGET}")

print("\nModel features:")

for feature in ALLOWED_FEATURES:
    print(f"  - {feature}")


# --------------------------------------------------
# Check for leakage columns
# --------------------------------------------------

present_leakage_columns = (
    LEAKAGE_COLUMNS.intersection(df.columns)
)

print("\nPotential leakage columns found:")

if present_leakage_columns:
    for column in present_leakage_columns:
        print(f"  WARNING: {column}")
else:
    print("  None")


# --------------------------------------------------
# Check that target is not a feature
# --------------------------------------------------

target_in_features = TARGET in ALLOWED_FEATURES

print("\nTarget included as model feature:")

if target_in_features:
    print("  WARNING: YES")
else:
    print("  NO")


# --------------------------------------------------
# Verify actual dataset columns
# --------------------------------------------------

IDENTIFIER_COLUMNS = {
    "id",
}

actual_model_columns = (
    set(df.columns)
    - {TARGET}
    - IDENTIFIER_COLUMNS
)

unexpected_features = (
    actual_model_columns - ALLOWED_FEATURES
)

print("\nUnexpected model columns:")

if unexpected_features:
    for column in unexpected_features:
        print(f"  WARNING: {column}")
else:
    print("  None")

    
# --------------------------------------------------
# Check identifier columns
# --------------------------------------------------

identifier_columns_present = (
    IDENTIFIER_COLUMNS.intersection(df.columns)
)

print("\nIdentifier columns excluded from model:")

if identifier_columns_present:
    for column in identifier_columns_present:
        print(f"  - {column}")
else:
    print("  None")


# --------------------------------------------------
# Final result
# --------------------------------------------------

leakage_check_passed = (
    not present_leakage_columns
    and not target_in_features
    and not unexpected_features
)


print("\n" + "=" * 60)

if leakage_check_passed:
    print("TARGET & LEAKAGE CHECK PASSED")
else:
    print("TARGET & LEAKAGE CHECK FAILED")

print("=" * 60)