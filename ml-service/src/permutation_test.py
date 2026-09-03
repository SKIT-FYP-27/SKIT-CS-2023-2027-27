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


def evaluate_model(X_train, X_test, y_train, y_test):
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    return {
        "Accuracy": accuracy_score(y_test, predictions),
        "Precision": precision_score(y_test, predictions, zero_division=0),
        "Recall": recall_score(y_test, predictions, zero_division=0),
        "F1": f1_score(y_test, predictions, zero_division=0),
    }


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

    print("=" * 80)
    print("PERMUTATION SANITY CHECK")
    print("=" * 80)

    # ---------------------------------------------------------
    # Real labels
    # ---------------------------------------------------------
    real_results = evaluate_model(
        X_train,
        X_test,
        y_train,
        y_test,
    )

    print("\nREAL LABELS")
    print("-" * 80)

    for metric, value in real_results.items():
        print(f"{metric:<10}: {value:.4f}")

    # ---------------------------------------------------------
    # Shuffled labels
    # ---------------------------------------------------------
    shuffled_y = y.sample(frac=1, random_state=42).reset_index(drop=True)

    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(
        X,
        shuffled_y,
        test_size=0.20,
        stratify=shuffled_y,
        random_state=42,
    )

    shuffled_results = evaluate_model(
        X_train_s,
        X_test_s,
        y_train_s,
        y_test_s,
    )

    print("\nSHUFFLED LABELS")
    print("-" * 80)

    for metric, value in shuffled_results.items():
        print(f"{metric:<10}: {value:.4f}")

    # ---------------------------------------------------------
    # Comparison
    # ---------------------------------------------------------
    print("\n" + "=" * 80)
    print("COMPARISON")
    print("=" * 80)

    print(
        f"\nReal-label F1     : {real_results['F1']:.4f}"
    )
    print(
        f"Shuffled-label F1 : {shuffled_results['F1']:.4f}"
    )

    print(
        "\nIf the shuffled-label performance drops substantially, "
        "the model is learning information from the actual "
        "feature-label relationship rather than simply predicting "
        "the majority class."
    )


if __name__ == "__main__":
    main()