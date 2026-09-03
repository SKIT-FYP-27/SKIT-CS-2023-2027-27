from pathlib import Path
import re
import pandas as pd


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAW_SQL = (
    PROJECT_ROOT
    / "ml-service"
    / "data"
    / "raw"
    / "synthetic"
    / "UEI_COMPLETE_FINAL_DATASET.sql"
)

OUTPUT_DIR = PROJECT_ROOT / "ml-service" / "data" / "processed"
OUTPUT_FILE = OUTPUT_DIR / "uei_risk_dataset.csv"


# ---------------------------------------------------------
# SQL helper
# ---------------------------------------------------------

def split_sql_values(values_text):
    """
    Split a SQL VALUES(...) section on commas while respecting
    commas inside quoted strings.
    """

    values = []
    current = []
    in_quote = False
    i = 0

    while i < len(values_text):
        char = values_text[i]

        if char == "'":
            # SQL escapes a single quote as ''
            if in_quote and i + 1 < len(values_text) and values_text[i + 1] == "'":
                current.append("''")
                i += 2
                continue

            in_quote = not in_quote
            current.append(char)

        elif char == "," and not in_quote:
            values.append("".join(current).strip())
            current = []

        else:
            current.append(char)

        i += 1

    if current:
        values.append("".join(current).strip())

    return values


def clean_sql_value(value):
    """Convert a simple SQL literal into a Python value."""

    value = value.strip()

    if value.upper() == "NULL":
        return None

    if value.startswith("'") and value.endswith("'"):
        value = value[1:-1]
        value = value.replace("''", "'")
        return value

    try:
        return float(value)
    except ValueError:
        return value


# ---------------------------------------------------------
# Generic INSERT parser
# ---------------------------------------------------------

def parse_insert_statements(sql_text, table_name):
    """
    Extract rows from INSERT INTO <table>(...) VALUES (...);
    statements.
    """

    pattern = re.compile(
        rf"INSERT\s+INTO\s+{re.escape(table_name)}\s*"
        rf"\((.*?)\)\s*VALUES\s*\((.*?)\)\s*;",
        re.IGNORECASE | re.DOTALL,
    )

    rows = []

    for match in pattern.finditer(sql_text):
        columns_text = match.group(1)
        values_text = match.group(2)

        columns = [
            column.strip().strip('"')
            for column in columns_text.split(",")
        ]

        raw_values = split_sql_values(values_text)

        if len(columns) != len(raw_values):
            print(
                f"Warning: {table_name} row has "
                f"{len(columns)} columns but {len(raw_values)} values."
            )
            continue

        row = {
            column: clean_sql_value(value)
            for column, value in zip(columns, raw_values)
        }

        rows.append(row)

    return rows


# ---------------------------------------------------------
# Build student dataset
# ---------------------------------------------------------

def main():

    if not RAW_SQL.exists():
        raise FileNotFoundError(
            f"Raw SQL dataset not found:\n{RAW_SQL}"
        )

    print("Reading SQL dataset...")
    sql_text = RAW_SQL.read_text(
        encoding="utf-8",
        errors="replace"
    )

    print("Extracting student profiles...")
    students = parse_insert_statements(
        sql_text,
        "student_profiles"
    )

    print(f"Student profile records found: {len(students)}")

    if not students:
        raise RuntimeError(
            "No student_profiles records were extracted."
        )

    students_df = pd.DataFrame(students)

    # -----------------------------------------------------
    # Extract weak-student radar records
    # -----------------------------------------------------

    print("Extracting weak-student radar records...")

    radar = parse_insert_statements(
        sql_text,
        "weak_student_radar"
    )

    print(f"Radar records found: {len(radar)}")

    radar_df = pd.DataFrame(radar)

    if radar_df.empty:
        raise RuntimeError(
            "No weak_student_radar records were extracted."
        )

    # -----------------------------------------------------
    # Validate required columns
    # -----------------------------------------------------

    required_student_columns = [
        "id",
        "current_semester",
        "current_cgpa",
        "overall_attendance",
    ]

    missing = [
        column
        for column in required_student_columns
        if column not in students_df.columns
    ]

    if missing:
        raise RuntimeError(
            f"Missing student columns: {missing}\n"
            f"Available columns: {students_df.columns.tolist()}"
        )

    if "student_id" not in radar_df.columns:
        raise RuntimeError(
            "weak_student_radar does not contain student_id."
        )

    # -----------------------------------------------------
    # Create binary ML target
    # -----------------------------------------------------

    radar_student_ids = set(
        radar_df["student_id"].dropna().astype(str)
    )

    students_df["at_risk"] = (
        students_df["id"]
        .astype(str)
        .isin(radar_student_ids)
        .astype(int)
    )

    # -----------------------------------------------------
    # Select ML features
    # -----------------------------------------------------

    dataset = students_df[
        [
            "id",
            "current_semester",
            "current_cgpa",
            "overall_attendance",
            "at_risk",
        ]
    ].copy()

    # Convert numeric fields explicitly
    dataset["current_semester"] = pd.to_numeric(
        dataset["current_semester"],
        errors="coerce"
    )

    dataset["current_cgpa"] = pd.to_numeric(
        dataset["current_cgpa"],
        errors="coerce"
    )

    dataset["overall_attendance"] = pd.to_numeric(
        dataset["overall_attendance"],
        errors="coerce"
    )

    # Remove incomplete rows
    dataset = dataset.dropna()

    # -----------------------------------------------------
    # Save processed dataset
    # -----------------------------------------------------

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    dataset.to_csv(
        OUTPUT_FILE,
        index=False
    )

    # -----------------------------------------------------
    # Summary
    # -----------------------------------------------------

    print("\n----------------------------------------")
    print("DATASET BUILD COMPLETE")
    print("----------------------------------------")

    print(f"Total students : {len(dataset)}")
    print(
        f"At-risk        : "
        f"{dataset['at_risk'].sum()}"
    )
    print(
        f"Not at-risk    : "
        f"{(dataset['at_risk'] == 0).sum()}"
    )

    print("\nFeatures:")
    print(
        dataset[
            [
                "current_semester",
                "current_cgpa",
                "overall_attendance",
            ]
        ].describe()
    )

    print("\nTarget distribution:")
    print(dataset["at_risk"].value_counts())

    print(f"\nSaved to:\n{OUTPUT_FILE}")


if __name__ == "__main__":
    main()