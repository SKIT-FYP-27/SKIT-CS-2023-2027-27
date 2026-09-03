from pathlib import Path

import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report,
)

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
# Load data
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
# Train/test split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    stratify=y,
    random_state=42,
)


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
# Evaluation
# --------------------------------------------------

print("=" * 80)
print("FINAL HELD-OUT TEST SET EVALUATION")
print("=" * 80)

print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples : {len(X_test)}")

results = []


for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    probabilities = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, predictions)
    precision = precision_score(y_test, predictions)
    recall = recall_score(y_test, predictions)
    f1 = f1_score(y_test, predictions)
    roc_auc = roc_auc_score(y_test, probabilities)
    pr_auc = average_precision_score(y_test, probabilities)

    matrix = confusion_matrix(y_test, predictions)

    print("\n" + "=" * 80)
    print(name)
    print("=" * 80)

    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print(f"ROC-AUC  : {roc_auc:.4f}")
    print(f"PR-AUC   : {pr_auc:.4f}")

    print("\nConfusion Matrix:")
    print(matrix)

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            predictions,
            target_names=[
                "Not At Risk",
                "At Risk",
            ],
            digits=4,
        )
    )

    results.append({
        "Model": name,
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1": f1,
        "ROC-AUC": roc_auc,
        "PR-AUC": pr_auc,
    })


# --------------------------------------------------
# Final comparison
# --------------------------------------------------

results_df = pd.DataFrame(results)

print("\n" + "=" * 80)
print("FINAL MODEL COMPARISON")
print("=" * 80)

print(
    results_df
    .round(4)
    .to_string(index=False)
)


# --------------------------------------------------
# Selection
# --------------------------------------------------

best_model = results_df.loc[
    results_df["F1"].idxmax(),
    "Model",
]

print("\n" + "=" * 80)
print(f"MODEL SELECTED BY F1 SCORE: {best_model}")
print("=" * 80)