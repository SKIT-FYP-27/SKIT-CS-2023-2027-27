"""
features.py
------------
Single source of truth for feature names and the target variable.

Every other script imports the feature and target definitions
from this file instead of hardcoding column names.
"""

# ============================================================
# 1. UCI DATASET
# ============================================================

# Target column in the original UCI dataset
UCI_RAW_TARGET_COLUMN = "Target"

# Features selected from the UCI Student Dropout dataset
UCI_FEATURE_COLUMNS = [
    "Admission grade",
    "Curricular units 1st sem (grade)",
    "Curricular units 1st sem (approved)",
    "Curricular units 1st sem (enrolled)",
    "Curricular units 2nd sem (grade)",
    "Curricular units 2nd sem (approved)",
    "Curricular units 2nd sem (enrolled)",
    "Age at enrollment",
    "Scholarship holder",
    "Tuition fees up to date",
    "Debtor",
]


# ============================================================
# 2. UEI DATABASE FEATURE MAPPING
# ============================================================

UEI_FEATURE_MAP = {
    "Admission grade": None,

    # Derived from course_enrollments
    "Curricular units 1st sem (grade)": "avg_total_marks_sem",
    "Curricular units 1st sem (approved)": "courses_passed_sem",
    "Curricular units 1st sem (enrolled)": "courses_enrolled_sem",

    "Curricular units 2nd sem (grade)": "avg_total_marks_sem",
    "Curricular units 2nd sem (approved)": "courses_passed_sem",
    "Curricular units 2nd sem (enrolled)": "courses_enrolled_sem",

    # Currently not available in UEI schema
    "Age at enrollment": None,
    "Scholarship holder": None,
    "Tuition fees up to date": None,
    "Debtor": None,

    # UEI-specific features
    "overall_attendance": "overall_attendance",
    "current_cgpa": "current_cgpa",
}


# ============================================================
# 3. MODEL FEATURES
# ============================================================

# Features used for training the baseline model
FEATURE_COLUMNS = UCI_FEATURE_COLUMNS


# ============================================================
# 4. TARGET / RISK LEVEL
# ============================================================

# Our model uses three risk levels:
#
# LOW    → Graduate
# MEDIUM → Enrolled
# HIGH   → Dropout

TARGET_COLUMN = "risk_level"

TARGET_CLASSES = [
    "LOW",
    "MEDIUM",
    "HIGH",
]


# Convert the original UCI target into our project's risk levels
UCI_TARGET_TO_RISK = {
    "Graduate": "LOW",
    "Enrolled": "MEDIUM",
    "Dropout": "HIGH",
}