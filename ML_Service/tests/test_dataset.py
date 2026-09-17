from pathlib import Path

import pandas as pd


DATA_PATH = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "processed"
    / "uei_risk_dataset.csv"
)

FEATURES = [
    "current_semester",
    "current_cgpa",
    "overall_attendance",
]

TARGET = "at_risk"


def load_dataset():
    assert DATA_PATH.exists(), f"Dataset not found: {DATA_PATH}"
    return pd.read_csv(DATA_PATH)


def test_dataset_exists():
    assert DATA_PATH.exists()


def test_dataset_has_expected_columns():
    df = load_dataset()

    expected_columns = ["id"] + FEATURES + [TARGET]

    assert list(df.columns) == expected_columns


def test_dataset_has_expected_row_count():
    df = load_dataset()

    assert len(df) == 1000


def test_dataset_has_no_missing_values():
    df = load_dataset()

    assert df.isnull().sum().sum() == 0


def test_dataset_has_no_duplicate_rows():
    df = load_dataset()

    assert df.duplicated().sum() == 0


def test_target_is_binary():
    df = load_dataset()

    assert set(df[TARGET].unique()).issubset({0, 1})


def test_semester_values_are_valid():
    df = load_dataset()

    assert df["current_semester"].between(1, 6).all()


def test_cgpa_values_are_valid():
    df = load_dataset()

    assert df["current_cgpa"].between(0, 10).all()


def test_attendance_values_are_valid():
    df = load_dataset()

    assert df["overall_attendance"].between(0, 100).all()