"""
clean.py
--------
Loads the raw UCI student dropout dataset,
selects the required features, cleans the data,
creates the risk_level target, and saves the
processed dataset.

Input:
    ml-service/data/raw/uci/data.csv

Output:
    ml-service/data/processed/uci_clean.csv
"""

import pandas as pd
from pathlib import Path

from features import (
    UCI_FEATURE_COLUMNS,
    UCI_RAW_TARGET_COLUMN,
    UCI_TARGET_TO_RISK,
    TARGET_COLUMN,
)


# ============================================================
# FILE PATHS
# ============================================================

RAW_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "raw"
    / "uci"
    / "data.csv"
)

PROCESSED_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "processed"
    / "uci_clean.csv"
)


# ============================================================
# LOAD DATA
# ============================================================

def load_raw(path: Path = RAW_PATH) -> pd.DataFrame:

    if not path.exists():
        raise FileNotFoundError(
            f"UCI dataset not found at: {path}\n"
            "Please download the dataset and place it at "
            "ml-service/data/raw/uci/data.csv"
        )

    # UCI dataset uses semicolon-separated values
    df = pd.read_csv(path, sep=";")

    print(f"[clean] Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

    return df


# ============================================================
# CLEAN DATA
# ============================================================

def clean(df: pd.DataFrame) -> pd.DataFrame:

    # --------------------------------------------------------
    # 1. Select required columns
    # --------------------------------------------------------

    required_columns = UCI_FEATURE_COLUMNS + [
        UCI_RAW_TARGET_COLUMN
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Expected columns missing from dataset: "
            f"{missing_columns}"
        )

    df = df[required_columns].copy()


    # --------------------------------------------------------
    # 2. Remove rows with missing feature values
    # --------------------------------------------------------

    before = len(df)

    df = df.dropna(
        subset=UCI_FEATURE_COLUMNS
    )

    dropped = before - len(df)

    if dropped > 0:
        print(
            f"[clean] Dropped {dropped} rows "
            "containing missing feature values"
        )


    # --------------------------------------------------------
    # 3. Convert target to project risk levels
    # --------------------------------------------------------

    df[TARGET_COLUMN] = (
        df[UCI_RAW_TARGET_COLUMN]
        .map(UCI_TARGET_TO_RISK)
    )

    unmapped = df[TARGET_COLUMN].isna().sum()

    if unmapped > 0:

        print(
            f"[clean] Warning: {unmapped} rows "
            "had unknown target values"
        )

        df = df.dropna(
            subset=[TARGET_COLUMN]
        )


    # Remove original UCI target
    df = df.drop(
        columns=[UCI_RAW_TARGET_COLUMN]
    )


    # --------------------------------------------------------
    # 4. Ensure feature columns are numeric
    # --------------------------------------------------------

    for column in UCI_FEATURE_COLUMNS:

        if df[column].dtype == "object":

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )


    # Remove rows that became invalid
    df = df.dropna(
        subset=UCI_FEATURE_COLUMNS
    )


    # --------------------------------------------------------
    # 5. Reset index
    # --------------------------------------------------------

    df = df.reset_index(
        drop=True
    )


    # --------------------------------------------------------
    # 6. Display dataset information
    # --------------------------------------------------------

    print(
        f"[clean] Final dataset: "
        f"{len(df)} rows"
    )

    print("\n[clean] Risk-level distribution:")

    print(
        df[TARGET_COLUMN]
        .value_counts()
    )

    return df


# ============================================================
# MAIN
# ============================================================

def main():

    df_raw = load_raw()

    df_clean = clean(
        df_raw
    )

    PROCESSED_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df_clean.to_csv(
        PROCESSED_PATH,
        index=False
    )

    print(
        f"\n[clean] Processed dataset saved to:\n"
        f"{PROCESSED_PATH}"
    )


if __name__ == "__main__":
    main()