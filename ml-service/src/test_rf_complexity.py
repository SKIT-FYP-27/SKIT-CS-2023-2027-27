import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split


DATA_PATH = "ml-service/data/processed/uei_risk_dataset.csv"

FEATURES = [
    "current_semester",
    "current_cgpa",
    "overall_attendance",
]

TARGET = "at_risk"


def main():
    df = pd.read_csv(DATA_PATH)

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        stratify=y,
        random_state=42,
    )

    depths = [2, 3, 5, 8, None]

    print("=" * 80)
    print("RANDOM FOREST COMPLEXITY TEST")
    print("=" * 80)
    print()

    results = []

    for depth in depths:
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=depth,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        )

        model.fit(X_train, y_train)
        predictions = model.predict(X_test)

        accuracy = accuracy_score(y_test, predictions)
        precision = precision_score(y_test, predictions, zero_division=0)
        recall = recall_score(y_test, predictions, zero_division=0)
        f1 = f1_score(y_test, predictions, zero_division=0)

        results.append({
            "Max Depth": str(depth),
            "Accuracy": accuracy,
            "Precision": precision,
            "Recall": recall,
            "F1": f1,
        })

    results_df = pd.DataFrame(results)

    print(results_df.to_string(index=False))

    print()
    print("=" * 80)
    print("INTERPRETATION")
    print("=" * 80)

    best_f1 = results_df["F1"].max()
    best_rows = results_df[results_df["F1"] == best_f1]

    print(
        f"Best F1 score: {best_f1:.4f}"
    )
    print(
        "Best configuration(s): "
        + ", ".join(
            f"max_depth={row['Max Depth']}"
            for _, row in best_rows.iterrows()
        )
    )


if __name__ == "__main__":
    main()