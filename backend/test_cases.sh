#!/bin/bash

echo "1. Testing Normal Values:"
curl -X POST "http://localhost:8000/analyze" \
-H "Content-Type: application/json" \
-d '{
    "Glucose": 85,
    "Cholesterol": 180,
    "Hemoglobin": 14,
    "Platelets": 250000,
    "White Blood Cells": 7000,
    "Red Blood Cells": 5.0,
    "Hematocrit": 42,
    "Mean Corpuscular Volume": 90,
    "Mean Corpuscular Hemoglobin": 30,
    "Mean Corpuscular Hemoglobin Concentration": 34,
    "Insulin": 10,
    "BMI": 22,
    "Systolic Blood Pressure": 110,
    "Diastolic Blood Pressure": 70,
    "Triglycerides": 100,
    "HbA1c": 5.0,
    "LDL Cholesterol": 90,
    "HDL Cholesterol": 50,
    "ALT": 30,
    "AST": 25,
    "Heart Rate": 75,
    "Creatinine": 1.0,
    "Troponin": 0.02,
    "C-reactive Protein": 1.5
}'

echo -e "\n\n2. Testing Diabetes Risk Values:"
curl -X POST "http://localhost:8000/analyze" \
-H "Content-Type: application/json" \
-d '{
    "Glucose": 126,
    "Cholesterol": 220,
    "Hemoglobin": 14,
    "Platelets": 250000,
    "White Blood Cells": 7000,
    "Red Blood Cells": 5.0,
    "Hematocrit": 42,
    "Mean Corpuscular Volume": 90,
    "Mean Corpuscular Hemoglobin": 30,
    "Mean Corpuscular Hemoglobin Concentration": 34,
    "Insulin": 25,
    "BMI": 27,
    "Systolic Blood Pressure": 135,
    "Diastolic Blood Pressure": 85,
    "Triglycerides": 160,
    "HbA1c": 6.5,
    "LDL Cholesterol": 130,
    "HDL Cholesterol": 35,
    "ALT": 30,
    "AST": 25,
    "Heart Rate": 75,
    "Creatinine": 1.0,
    "Troponin": 0.02,
    "C-reactive Protein": 1.5
}'

echo -e "\n\n3. Testing Anemia Risk Values:"
curl -X POST "http://localhost:8000/analyze" \
-H "Content-Type: application/json" \
-d '{
    "Glucose": 85,
    "Cholesterol": 180,
    "Hemoglobin": 10.5,
    "Platelets": 250000,
    "White Blood Cells": 7000,
    "Red Blood Cells": 4.0,
    "Hematocrit": 32,
    "Mean Corpuscular Volume": 75,
    "Mean Corpuscular Hemoglobin": 25,
    "Mean Corpuscular Hemoglobin Concentration": 30,
    "Insulin": 10,
    "BMI": 22,
    "Systolic Blood Pressure": 110,
    "Diastolic Blood Pressure": 70,
    "Triglycerides": 100,
    "HbA1c": 5.0,
    "LDL Cholesterol": 90,
    "HDL Cholesterol": 50,
    "ALT": 30,
    "AST": 25,
    "Heart Rate": 75,
    "Creatinine": 1.0,
    "Troponin": 0.02,
    "C-reactive Protein": 1.5
}'

echo -e "\n\n4. Testing Critical Values:"
curl -X POST "http://localhost:8000/analyze" \
-H "Content-Type: application/json" \
-d '{
    "Glucose": 200,
    "Cholesterol": 280,
    "Hemoglobin": 8.5,
    "Platelets": 500000,
    "White Blood Cells": 12000,
    "Red Blood Cells": 3.5,
    "Hematocrit": 30,
    "Mean Corpuscular Volume": 70,
    "Mean Corpuscular Hemoglobin": 24,
    "Mean Corpuscular Hemoglobin Concentration": 29,
    "Insulin": 30,
    "BMI": 32,
    "Systolic Blood Pressure": 160,
    "Diastolic Blood Pressure": 95,
    "Triglycerides": 200,
    "HbA1c": 8.0,
    "LDL Cholesterol": 160,
    "HDL Cholesterol": 30,
    "ALT": 65,
    "AST": 50,
    "Heart Rate": 110,
    "Creatinine": 1.8,
    "Troponin": 0.06,
    "C-reactive Protein": 5.0
}'

echo -e "\n\n5. Testing Borderline Values:"
curl -X POST "http://localhost:8000/analyze" \
-H "Content-Type: application/json" \
-d '{
    "Glucose": 95,
    "Cholesterol": 190,
    "Hemoglobin": 12.5,
    "Platelets": 400000,
    "White Blood Cells": 10000,
    "Red Blood Cells": 4.8,
    "Hematocrit": 39,
    "Mean Corpuscular Volume": 85,
    "Mean Corpuscular Hemoglobin": 29,
    "Mean Corpuscular Hemoglobin Concentration": 33,
    "Insulin": 20,
    "BMI": 24.5,
    "Systolic Blood Pressure": 118,
    "Diastolic Blood Pressure": 78,
    "Triglycerides": 145,
    "HbA1c": 5.6,
    "LDL Cholesterol": 95,
    "HDL Cholesterol": 42,
    "ALT": 50,
    "AST": 35,
    "Heart Rate": 90,
    "Creatinine": 1.2,
    "Troponin": 0.03,
    "C-reactive Protein": 2.8
}'
