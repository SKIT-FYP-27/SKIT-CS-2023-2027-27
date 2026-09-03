from pathlib import Path

import pandas as pd

from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier


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

FEATURES = [
    "current_semester",
    "current_cgpa",
    "overall_attendance",
]

X = df[FEATURES]
y = df["at_risk"]


# --------------------------------------------------
# Models
# --------------------------------------------------

models = {

    "Logistic Regression": Pipeline([
        ("scaler", StandardScaler()),
        (
            "model",
            LogisticRegression(
                class_weight="balanced",
                max_iter=1000,
                random_state=42,
            ),
        ),
    ]),

    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    ),

    "XGBoost": XGBClassifier(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="logloss",
        random_state=42,
    ),
}


# --------------------------------------------------
# Cross-validation
# --------------------------------------------------

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42,
)


scoring = {
    "accuracy": "accuracy",
    "precision": "precision",
    "recall": "recall",
    "f1": "f1",
    "roc_auc": "roc_auc",
    "pr_auc": "average_precision",
}


print("=" * 75)
print("5-FOLD STRATIFIED CROSS-VALIDATION")
print("=" * 75)

print(f"\nDataset: {X.shape[0]} students")
print(f"Features: {', '.join(FEATURES)}")
print(f"At-risk students: {(y == 1).sum()}")
print(f"Not-at-risk students: {(y == 0).sum()}")


results = []


for name, model in models.items():

    scores = cross_validate(
        model,
        X,
        y,
        cv=cv,
        scoring=scoring,
        n_jobs=-1,
    )

    row = {
        "Model": name,
    }

    print(f"\n{name}")
    print("-" * 75)

    for metric in scoring:

        values = scores[f"test_{metric}"]

        mean = values.mean()
        std = values.std()

        row[metric] = mean

        print(
            f"{metric.upper():10s}: "
            f"{mean:.4f} ± {std:.4f}"
        )

    results.append(row)


# --------------------------------------------------
# Summary
# --------------------------------------------------

results_df = pd.DataFrame(results)

print("\n" + "=" * 75)
print("CROSS-VALIDATION SUMMARY")
print("=" * 75)

print(
    results_df[
        [
            "Model",
            "accuracy",
            "precision",
            "recall",
            "f1",
            "roc_auc",
            "pr_auc",
        ]
    ]
    .round(4)
    .to_string(index=False)
)

print("\nCross-validation complete.")