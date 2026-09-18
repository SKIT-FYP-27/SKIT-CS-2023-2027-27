# UEI ML Service

## Overview

The UEI ML Service is the machine learning component of the Unified Education Interface (UEI) project.

Its purpose is to process student academic data, train risk models, generate student risk predictions, and provide explainable predictions that can be consumed by the UEI application.

The ML service is maintained separately from the frontend, database, and main backend components.

---

## Current ML Pipeline

The current pipeline uses synthetic UEI student data for development and validation.

The pipeline consists of:

1. Dataset construction and preprocessing
2. Dataset quality validation
3. Target leakage checks
4. Model training
5. Model evaluation
6. Risk prediction
7. SHAP-based explainability
8. FastAPI inference service
9. Automated tests

---

## Synthetic Dataset

The current development dataset is a synthetic UEI dataset.

The raw dataset is stored locally under:

```text
ML_Service/data/raw/synthetic/