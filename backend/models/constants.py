normal_ranges = {
    "glucose": (70, 100),  # mg/dL
    "cholesterol": (125, 200),  # mg/dL
    "hemoglobin": (12.0, 17.0),  # g/dL (was incorrect before)
    "platelets": (150000, 450000),  # per microliter
    "white_blood_cells": (4000, 11000),  # per microliter
    "red_blood_cells": (4.5, 6.0),  # million cells/mcL
    "hematocrit": (37, 47),  # percentage
    "mean_corpuscular_volume": (80, 100),  # femtoliters
    "mean_corpuscular_hemoglobin": (27, 33),  # picograms
    "mean_corpuscular_hemoglobin_concentration": (32, 36),  # g/dL
    "insulin": (2.6, 24.9),  # uIU/mL
    "bmi": (18.5, 24.9),  # kg/m²
    "systolic_blood_pressure": (90, 120),  # mmHg
    "diastolic_blood_pressure": (60, 80),  # mmHg
    "triglycerides": (40, 150),  # mg/dL
    "hba1c": (4.0, 5.7),  # percentage
    "ldl_cholesterol": (0, 100),  # mg/dL
    "hdl_cholesterol": (40, 60),  # mg/dL
    "alt": (7, 56),  # U/L
    "ast": (10, 40),  # U/L
    "heart_rate": (60, 100),  # beats per minute
    "creatinine": (0.7, 1.3),  # mg/dL
    "troponin": (0, 0.04),  # ng/mL
    "c_reactive_protein": (0, 3.0)  # mg/L
}

# Define critical thresholds
critical_thresholds = {
    "glucose": {"very_low": 50, "very_high": 200},
    "systolic_blood_pressure": {"very_low": 70, "very_high": 180},
    "diastolic_blood_pressure": {"very_low": 40, "very_high": 120},
    "hba1c": {"very_low": 3.0, "very_high": 9.0},
}
