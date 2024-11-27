# Health Analysis API

A sophisticated API for analyzing health metrics and providing detailed health insights using machine learning.

## Features

- Comprehensive health analysis based on blood test results and vital signs
- Machine learning-based disease prediction
- Detailed health score calculation
- Risk level assessment
- Personalized recommendations
- Trend analysis of health metrics
- Abnormal value detection and warnings

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/health-analysis-api.git
cd health-analysis-api
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
uvicorn api.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /analyze
Analyzes health data and provides comprehensive insights.

#### Sample Requests

1. Normal Values Test:
```bash
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
```

2. Diabetes Risk Values Test:
```bash
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
```

3. Critical Values Test:
```bash
curl -X POST "http://localhost:8000/analyze" \
-H "Content-Type: application/json" \
-d '{
    "Glucose": 200,
    "Cholesterol": 280,
    "Hemoglobin": 10,
    "Platelets": 500000,
    "White Blood Cells": 12000,
    "Red Blood Cells": 4.0,
    "Hematocrit": 32,
    "Mean Corpuscular Volume": 75,
    "Mean Corpuscular Hemoglobin": 25,
    "Mean Corpuscular Hemoglobin Concentration": 30,
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
```

## Response Format

The API returns a JSON response with the following structure:

```json
{
    "summary": {
        "health_score": float,
        "risk_level": string,
        "risk_message": string,
        "predicted_condition": string,
        "confidence": float
    },
    "analysis": {
        "metrics_overview": {
            "total_metrics": int,
            "metrics_at_risk": int,
            "normal_metrics": int,
            "trends": object
        },
        "detailed_metrics": object,
        "risk_factors": object
    },
    "action_plan": {
        "immediate_actions": array,
        "monitoring": array,
        "lifestyle_changes": array,
        "preventive_measures": array
    },
    "warnings": {
        "abnormal_metrics": object,
        "critical_values": array
    }
}
```

## Models and Analysis

The API uses a Random Forest Classifier to predict potential health conditions based on the input metrics. The health score is calculated using a combination of:
- Individual metric scores based on their distance from optimal ranges
- Machine learning prediction confidence
- Number of metrics at risk

## Development

### Project Structure
```
health-analysis-api/
├── api/
│   └── main.py
├── models/
│   ├── health_analyzer.py
│   └── constants.py
├── data/
│   └── blood_test_data.csv
├── requirements.txt
└── README.md
```

### Required Dependencies

- fastapi
- uvicorn
- pandas
- numpy
- scikit-learn
- pydantic

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
