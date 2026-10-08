from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "data" / "processed" / "uei_risk_dataset.csv"

df = pd.read_csv(DATA_PATH)

print("=" * 60)
print("TARGET DISTRIBUTION")
print("=" * 60)

print(df["at_risk"].value_counts())
print()

print("=" * 60)
print("FEATURE SUMMARY BY TARGET")
print("=" * 60)

summary = df.groupby("at_risk")[
    ["current_semester", "current_cgpa", "overall_attendance"]
].agg(["mean", "std", "min", "max"])

print(summary.to_string())

print("\n" + "=" * 60)
print("MEDIAN VALUES")
print("=" * 60)

print(
    df.groupby("at_risk")[
        ["current_semester", "current_cgpa", "overall_attendance"]
    ].median().to_string()
)

print("\n" + "=" * 60)
print("AT-RISK STUDENT RANGES")
print("=" * 60)

at_risk = df[df["at_risk"] == 1]

for column in ["current_semester", "current_cgpa", "overall_attendance"]:
    print(
        f"{column}: "
        f"min={at_risk[column].min():.2f}, "
        f"max={at_risk[column].max():.2f}"
    )

print("\n" + "=" * 60)
print("NOT AT-RISK STUDENT RANGES")
print("=" * 60)

not_at_risk = df[df["at_risk"] == 0]

for column in ["current_semester", "current_cgpa", "overall_attendance"]:
    print(
        f"{column}: "
        f"min={not_at_risk[column].min():.2f}, "
        f"max={not_at_risk[column].max():.2f}"
    )