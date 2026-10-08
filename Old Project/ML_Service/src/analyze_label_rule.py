from pathlib import Path

import pandas as pd
import numpy as np


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

print("=" * 75)
print("SYNTHETIC LABEL RULE ANALYSIS")
print("=" * 75)


# --------------------------------------------------
# Test simple threshold rules
# --------------------------------------------------

def evaluate_rule(condition, description):

    predicted = condition.astype(int)

    accuracy = (predicted == df["at_risk"]).mean()

    tp = ((predicted == 1) & (df["at_risk"] == 1)).sum()
    fp = ((predicted == 1) & (df["at_risk"] == 0)).sum()
    fn = ((predicted == 0) & (df["at_risk"] == 1)).sum()

    precision = (
        tp / (tp + fp)
        if (tp + fp) > 0
        else 0
    )

    recall = (
        tp / (tp + fn)
        if (tp + fn) > 0
        else 0
    )

    print(f"\nRule: {description}")
    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"Errors   : {(predicted != df['at_risk']).sum()}")


print("\n[1] SINGLE-FEATURE RULES")
print("-" * 75)

# Attendance thresholds
for threshold in [55, 60, 65, 70, 75]:

    evaluate_rule(
        df["overall_attendance"] < threshold,
        f"attendance < {threshold}",
    )


# CGPA thresholds
for threshold in [5.0, 5.5, 6.0, 6.5, 7.0]:

    evaluate_rule(
        df["current_cgpa"] < threshold,
        f"CGPA < {threshold}",
    )


# --------------------------------------------------
# Combined rules
# --------------------------------------------------

print("\n[2] COMBINED RULES")
print("-" * 75)

rules = [

    (
        (df["current_cgpa"] < 6.5)
        & (df["overall_attendance"] < 75),
        "CGPA < 6.5 AND attendance < 75",
    ),

    (
        (df["current_cgpa"] < 7.0)
        & (df["overall_attendance"] < 75),
        "CGPA < 7.0 AND attendance < 75",
    ),

    (
        (df["current_cgpa"] < 6.5)
        | (df["overall_attendance"] < 65),
        "CGPA < 6.5 OR attendance < 65",
    ),

    (
        (df["current_cgpa"] < 7.0)
        | (df["overall_attendance"] < 70),
        "CGPA < 7.0 OR attendance < 70",
    ),
]


for condition, description in rules:
    evaluate_rule(condition, description)


# --------------------------------------------------
# Correlation between features
# --------------------------------------------------

print("\n[3] FEATURE CORRELATION")
print("-" * 75)

print(
    df[
        [
            "current_semester",
            "current_cgpa",
            "overall_attendance",
        ]
    ]
    .corr()
    .round(4)
    .to_string()
)


# --------------------------------------------------
# Find suspiciously separable regions
# --------------------------------------------------

print("\n[4] LOW-ACADEMIC-PERFORMANCE REGION")
print("-" * 75)

region = df[
    (df["current_cgpa"] < 6.0)
    | (df["overall_attendance"] < 60)
]

print(f"Students in region: {len(region)}")

if len(region) > 0:
    print(
        f"At-risk in region: "
        f"{region['at_risk'].sum()} "
        f"({region['at_risk'].mean() * 100:.2f}%)"
    )


# --------------------------------------------------
# High-performance region
# --------------------------------------------------

print("\n[5] HIGH-ACADEMIC-PERFORMANCE REGION")
print("-" * 75)

region = df[
    (df["current_cgpa"] >= 8.0)
    & (df["overall_attendance"] >= 80)
]

print(f"Students in region: {len(region)}")

if len(region) > 0:
    print(
        f"At-risk in region: "
        f"{region['at_risk'].sum()} "
        f"({region['at_risk'].mean() * 100:.2f}%)"
    )


print("\n" + "=" * 75)
print("LABEL RULE ANALYSIS COMPLETE")
print("=" * 75)