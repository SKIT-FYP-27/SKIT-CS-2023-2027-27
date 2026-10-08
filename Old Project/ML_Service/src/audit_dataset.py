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

print("=" * 60)
print("UEI DATASET AUDIT")
print("=" * 60)

df = pd.read_csv(DATASET_PATH)


# --------------------------------------------------
# Basic information
# --------------------------------------------------

print("\nDataset shape:")
print(f"Rows    : {df.shape[0]}")
print(f"Columns : {df.shape[1]}")

print("\nColumns:")
for column in df.columns:
    print(f"  - {column}")


# --------------------------------------------------
# Missing values
# --------------------------------------------------

print("\nMissing values:")

missing_values = df.isnull().sum()

for column, count in missing_values.items():
    print(f"  {column}: {count}")


# --------------------------------------------------
# Duplicate rows
# --------------------------------------------------

duplicate_count = df.duplicated().sum()

print("\nDuplicate rows:")
print(f"  {duplicate_count}")


# --------------------------------------------------
# Target validation
# --------------------------------------------------

print("\nTarget distribution:")

print(
    df["at_risk"].value_counts().sort_index()
)

invalid_targets = ~df["at_risk"].isin([0, 1])

print(
    f"\nInvalid target values: "
    f"{invalid_targets.sum()}"
)


# --------------------------------------------------
# Feature validation
# --------------------------------------------------

print("\nFeature ranges:")

print(
    f"  current_semester : "
    f"{df['current_semester'].min()} - "
    f"{df['current_semester'].max()}"
)

print(
    f"  current_cgpa     : "
    f"{df['current_cgpa'].min()} - "
    f"{df['current_cgpa'].max()}"
)

print(
    f"  overall_attendance: "
    f"{df['overall_attendance'].min()} - "
    f"{df['overall_attendance'].max()}"
)


# --------------------------------------------------
# Invalid feature values
# --------------------------------------------------

invalid_semester = ~df["current_semester"].between(1, 6)

invalid_cgpa = ~df["current_cgpa"].between(0, 10)

invalid_attendance = ~df["overall_attendance"].between(0, 100)


print("\nInvalid feature values:")

print(
    f"  current_semester : "
    f"{invalid_semester.sum()}"
)

print(
    f"  current_cgpa     : "
    f"{invalid_cgpa.sum()}"
)

print(
    f"  overall_attendance: "
    f"{invalid_attendance.sum()}"
)


# --------------------------------------------------
# Final audit status
# --------------------------------------------------

audit_passed = (
    len(df) > 0
    and df.shape[1] == 5
    and missing_values.sum() == 0
    and duplicate_count == 0
    and invalid_targets.sum() == 0
    and invalid_semester.sum() == 0
    and invalid_cgpa.sum() == 0
    and invalid_attendance.sum() == 0
)


print("\n" + "=" * 60)

if audit_passed:
    print("DATASET AUDIT PASSED")
else:
    print("DATASET AUDIT FAILED")

print("=" * 60)