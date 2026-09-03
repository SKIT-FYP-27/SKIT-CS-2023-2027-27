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


print("=" * 70)
print("UEI RISK DATASET AUDIT")
print("=" * 70)


# --------------------------------------------------
# 1. Dataset dimensions
# --------------------------------------------------

print("\n[1] DATASET DIMENSIONS")
print("-" * 70)

print(f"Rows    : {df.shape[0]}")
print(f"Columns : {df.shape[1]}")


# --------------------------------------------------
# 2. Columns
# --------------------------------------------------

print("\n[2] COLUMNS")
print("-" * 70)

for column in df.columns:
    print(f"- {column}")


# --------------------------------------------------
# 3. Data types
# --------------------------------------------------

print("\n[3] DATA TYPES")
print("-" * 70)

print(df.dtypes)


# --------------------------------------------------
# 4. Missing values
# --------------------------------------------------

print("\n[4] MISSING VALUES")
print("-" * 70)

missing = df.isnull().sum()

print(missing)

print(
    f"\nTotal missing values: {missing.sum()}"
)


# --------------------------------------------------
# 5. Duplicate records
# --------------------------------------------------

print("\n[5] DUPLICATES")
print("-" * 70)

duplicates = df.duplicated().sum()

print(f"Duplicate rows: {duplicates}")


# --------------------------------------------------
# 6. Target distribution
# --------------------------------------------------

print("\n[6] TARGET DISTRIBUTION")
print("-" * 70)

target_counts = df["at_risk"].value_counts().sort_index()

print(target_counts)

target_percent = (
    df["at_risk"]
    .value_counts(normalize=True)
    .sort_index()
    * 100
)

print("\nPercentage:")
for target, percentage in target_percent.items():
    print(f"at_risk={target}: {percentage:.2f}%")


# --------------------------------------------------
# 7. Feature statistics
# --------------------------------------------------

features = [
    "current_semester",
    "current_cgpa",
    "overall_attendance",
]

print("\n[7] FEATURE STATISTICS")
print("-" * 70)

print(
    df[features]
    .describe()
    .round(2)
    .to_string()
)


# --------------------------------------------------
# 8. Feature statistics by target
# --------------------------------------------------

print("\n[8] FEATURES BY TARGET")
print("-" * 70)

grouped = (
    df.groupby("at_risk")[features]
    .agg(["mean", "median", "min", "max"])
    .round(2)
)

print(grouped.to_string())


# --------------------------------------------------
# 9. Correlation with target
# --------------------------------------------------

print("\n[9] CORRELATION WITH TARGET")
print("-" * 70)

correlations = (
    df[features + ["at_risk"]]
    .corr()["at_risk"]
    .drop("at_risk")
    .sort_values(key=abs, ascending=False)
)

print(correlations.round(4).to_string())


# --------------------------------------------------
# 10. Feature-target overlap
# --------------------------------------------------

print("\n[10] FEATURE RANGE OVERLAP")
print("-" * 70)

for feature in features:

    safe = df.loc[df["at_risk"] == 0, feature]
    risk = df.loc[df["at_risk"] == 1, feature]

    overlap_min = max(safe.min(), risk.min())
    overlap_max = min(safe.max(), risk.max())

    print(f"\n{feature}")
    print(f"  Not-at-risk range : {safe.min():.2f} - {safe.max():.2f}")
    print(f"  At-risk range     : {risk.min():.2f} - {risk.max():.2f}")

    if overlap_min <= overlap_max:
        print(
            f"  Overlap           : "
            f"{overlap_min:.2f} - {overlap_max:.2f}"
        )
    else:
        print("  Overlap           : None")


# --------------------------------------------------
# 11. Final audit summary
# --------------------------------------------------

print("\n" + "=" * 70)
print("AUDIT SUMMARY")
print("=" * 70)

print(f"Total students       : {len(df)}")
print(f"At-risk students     : {(df['at_risk'] == 1).sum()}")
print(f"Not-at-risk students : {(df['at_risk'] == 0).sum()}")
print(f"Missing values       : {df.isnull().sum().sum()}")
print(f"Duplicate rows       : {df.duplicated().sum()}")

print("\nDataset audit complete.")