from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import pandas as pd
import numpy as np
from models.health_analyzer import HealthAnalyzer
from models.constants import normal_ranges

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

health_analyzer = HealthAnalyzer()

class PatientData(BaseModel):
    glucose: float = Field(alias="Glucose")
    cholesterol: float = Field(alias="Cholesterol")
    hemoglobin: float = Field(alias="Hemoglobin")
    platelets: float = Field(alias="Platelets")
    white_blood_cells: float = Field(alias="White Blood Cells")
    red_blood_cells: float = Field(alias="Red Blood Cells")
    hematocrit: float = Field(alias="Hematocrit")
    mean_corpuscular_volume: float = Field(alias="Mean Corpuscular Volume")
    mean_corpuscular_hemoglobin: float = Field(alias="Mean Corpuscular Hemoglobin")
    mean_corpuscular_hemoglobin_concentration: float = Field(alias="Mean Corpuscular Hemoglobin Concentration")
    insulin: float = Field(alias="Insulin")
    bmi: float = Field(alias="BMI")
    systolic_blood_pressure: float = Field(alias="Systolic Blood Pressure")
    diastolic_blood_pressure: float = Field(alias="Diastolic Blood Pressure")
    triglycerides: float = Field(alias="Triglycerides")
    hba1c: float = Field(alias="HbA1c")
    ldl_cholesterol: float = Field(alias="LDL Cholesterol")
    hdl_cholesterol: float = Field(alias="HDL Cholesterol")
    alt: float = Field(alias="ALT")
    ast: float = Field(alias="AST")
    heart_rate: float = Field(alias="Heart Rate")
    creatinine: float = Field(alias="Creatinine")
    troponin: float = Field(alias="Troponin")
    c_reactive_protein: float = Field(alias="C-reactive Protein")

    @validator('*')
    def validate_fields(cls, v, field):
        # Remove validation error, just return the value
        return v

    class Config:
        allow_population_by_field_name = True

@app.on_event("startup")
async def startup_event():
    # Load and train the model when the application starts
    try:
        data = pd.read_csv("data/blood_test_data.csv")
        accuracy = health_analyzer.train(data)
        print(f"Model trained with accuracy: {accuracy}")
    except Exception as e:
        print(f"Error training model: {str(e)}")

def get_disease_risk_level(health_score: float, metrics_at_risk: int, total_metrics: int) -> dict:
    # Calculate percentage of metrics at risk
    risk_percentage = (metrics_at_risk / total_metrics) * 100
    
    if health_score >= 80 and risk_percentage < 10:
        return {
            "level": "Low",
            "message": "Maintain healthy lifestyle"
        }
    elif health_score >= 70 or risk_percentage < 20:
        return {
            "level": "Medium",
            "message": "Regular monitoring advised"
        }
    elif health_score >= 60 or risk_percentage < 30:
        return {
            "level": "Medium-High",
            "message": "Schedule medical checkup soon"
        }
    elif health_score >= 50:
        return {
            "level": "High",
            "message": "Consultation with healthcare provider recommended"
        }
    else:
        return {
            "level": "Very High",
            "message": "Immediate medical attention recommended"
        }

def get_trend_analysis(metrics_data: dict) -> dict:
    trends = {
        "high_end_metrics": [],
        "low_end_metrics": [],
        "optimal_metrics": [],
        "concerning_metrics": []
    }
    
    for metric, data in metrics_data.items():
        if data["interpretation"] == "High end of normal range":
            trends["high_end_metrics"].append(metric)
        elif data["interpretation"] == "Low end of normal range":
            trends["low_end_metrics"].append(metric)
        elif data["interpretation"] == "Optimal range":
            trends["optimal_metrics"].append(metric)
        else:
            trends["concerning_metrics"].append(metric)
    
    return trends

def get_detailed_recommendations(patient_data: PatientData, trends: dict, disease_prediction: str) -> dict:
    recommendations = {
        "urgent_actions": [],
        "monitoring_needed": [],
        "lifestyle_changes": [],
        "preventive_measures": []
    }
    
    if disease_prediction == "Diabetes":
        if patient_data.glucose > 95:
            recommendations["monitoring_needed"].append({
                "parameter": "Blood Glucose",
                "current": patient_data.glucose,
                "action": "Regular glucose monitoring",
                "target": "Maintain below 95 mg/dL"
            })
        if patient_data.hba1c > 5.5:
            recommendations["urgent_actions"].append({
                "parameter": "HbA1c",
                "current": patient_data.hba1c,
                "action": "Consult endocrinologist",
                "target": "Maintain below 5.5%"
            })
    
    if len(trends["high_end_metrics"]) > 3:
        recommendations["preventive_measures"].append({
            "focus": "Multiple borderline metrics",
            "action": "Schedule comprehensive health checkup",
            "metrics": trends["high_end_metrics"]
        })
    
    return recommendations

@app.post("/analyze")
async def analyze_health(patient_data: PatientData):
    try:
        # Get data with proper field names
        data_dict = {}
        for field_name, field in patient_data.__fields__.items():
            alias = field.field_info.alias
            value = getattr(patient_data, field_name)
            data_dict[alias] = value
            
        # Create DataFrame with the correct structure
        data = pd.DataFrame([data_dict])
        
        # Get predictions
        prediction_result = health_analyzer.predict_disease(data)
        disease_prediction = prediction_result['prediction']
        probabilities = prediction_result['probabilities']
        health_score = health_analyzer.calculate_health_score(data)
        
        # Enhanced recommendations logic
        recommendations = [
            "Consult healthcare provider" if health_score < 60 else "Regular checkup recommended",
            *(f"High {field.alias}: {getattr(patient_data, field.name)}" 
              for field in patient_data.__fields__.values() 
              if field.name in normal_ranges 
              and getattr(patient_data, field.name) > normal_ranges[field.name][1]),
            *(f"Low {field.alias}: {getattr(patient_data, field.name)}" 
              for field in patient_data.__fields__.values() 
              if field.name in normal_ranges 
              and getattr(patient_data, field.name) < normal_ranges[field.name][0])
        ]

        # Add specific disease risk factors
        if disease_prediction == "Diabetes":
            if patient_data.glucose > 100:
                recommendations.append("Monitor blood glucose levels closely")
            if patient_data.hba1c > 5.5:
                recommendations.append("HbA1c levels indicate pre-diabetes risk")
            if patient_data.bmi > 25:
                recommendations.append("Weight management recommended")

        # Count metrics at risk (in high end of normal range or abnormal)
        metrics_at_risk = len([field for field in patient_data.__fields__ 
                             if field in normal_ranges and
                             (getattr(patient_data, field) < normal_ranges[field][0] or
                              getattr(patient_data, field) > normal_ranges[field][1])])

        risk_assessment = get_disease_risk_level(
            health_score, 
            metrics_at_risk,
            len(patient_data.__fields__)
        )
        
        # Enhanced recommendations with context
        base_recommendations = []
        if disease_prediction == "Diabetes":
            if patient_data.glucose > 100:
                base_recommendations.append({
                    "concern": "Elevated Glucose",
                    "message": "Monitor blood glucose levels closely",
                    "current_value": patient_data.glucose,
                    "ideal_range": normal_ranges["glucose"]
                })
            if patient_data.hba1c > 5.5:
                base_recommendations.append({
                    "concern": "Elevated HbA1c",
                    "message": "HbA1c levels indicate pre-diabetes risk",
                    "current_value": patient_data.hba1c,
                    "ideal_range": normal_ranges["hba1c"]
                })
        
        metrics_data = {
            field: {
                "value": getattr(patient_data, field),
                "status": "Normal" if field in normal_ranges 
                        and normal_ranges[field][0] <= getattr(patient_data, field) <= normal_ranges[field][1] 
                        else "Abnormal",
                "normal_range": normal_ranges.get(field, None),
                "interpretation": get_metric_interpretation(field, getattr(patient_data, field))
            } for field in patient_data.__fields__
        }
        
        trends = get_trend_analysis(metrics_data)
        detailed_recommendations = get_detailed_recommendations(patient_data, trends, disease_prediction)
        
        # Add value status checks
        abnormal_metrics = {
            field: get_value_status(field, getattr(patient_data, field))
            for field in patient_data.__fields__
            if field in normal_ranges and get_value_status(field, getattr(patient_data, field))["warning"]
        }
        
        return {
            "summary": {
                "health_score": health_score,
                "risk_level": risk_assessment["level"],
                "risk_message": risk_assessment["message"],
                "predicted_condition": disease_prediction,
                "confidence": float(max(probabilities))
            },
            "analysis": {
                "metrics_overview": {
                    "total_metrics": len(patient_data.__fields__),
                    "metrics_at_risk": metrics_at_risk,
                    "normal_metrics": len(patient_data.__fields__) - metrics_at_risk,
                    "trends": trends
                },
                "detailed_metrics": metrics_data,
                "risk_factors": get_risk_factors(patient_data, disease_prediction)
            },
            "action_plan": {
                "immediate_actions": detailed_recommendations["urgent_actions"],
                "monitoring": detailed_recommendations["monitoring_needed"],
                "lifestyle_changes": [
                    {
                        "area": "Diet",
                        "recommendation": "Review diet with nutritionist" if health_score < 70 else "Maintain balanced diet",
                        "importance": "High" if health_score < 70 else "Medium"
                    },
                    {
                        "area": "Exercise",
                        "recommendation": "Begin light exercise routine" if health_score < 70 else "Regular exercise",
                        "importance": "Medium"
                    },
                    {
                        "area": "Health Monitoring",
                        "recommendation": "Schedule comprehensive health assessment" if health_score < 80 else "Regular checkups",
                        "importance": "High" if health_score < 70 else "Medium"
                    }
                ],
                "preventive_measures": detailed_recommendations["preventive_measures"]
            },
            "warnings": {
                "abnormal_metrics": abnormal_metrics,
                "critical_values": [
                    field for field, status in abnormal_metrics.items()
                    if status.get("severity") == "High"
                ]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_value_status(field_name: str, value: float) -> dict:
    if field_name not in normal_ranges:
        return {"status": "Unknown", "warning": None}
    
    min_val, max_val = normal_ranges[field_name]
    if value < min_val:
        return {
            "status": "Low",
            "warning": f"Below normal range ({min_val}-{max_val})",
            "severity": "High" if value < min_val * 0.8 else "Medium"
        }
    elif value > max_val:
        return {
            "status": "High",
            "warning": f"Above normal range ({min_val}-{max_val})",
            "severity": "High" if value > max_val * 1.2 else "Medium"
        }
    return {"status": "Normal", "warning": None}

def get_metric_interpretation(field: str, value: float) -> str:
    if field not in normal_ranges:
        return "No interpretation available"
    
    min_val, max_val = normal_ranges[field]
    if value < min_val:
        return "Below normal range"
    elif value > max_val:
        return "Above normal range"
    else:
        if value <= (min_val + (max_val - min_val) * 0.25):
            return "Low end of normal range"
        elif value >= (max_val - (max_val - min_val) * 0.25):
            return "High end of normal range"
        return "Optimal range"

def get_risk_factors(patient_data: PatientData, prediction: str) -> dict:
    risk_factors = {
        "Diabetes": {
            "primary": ["glucose", "hba1c", "insulin"],
            "secondary": ["bmi", "triglycerides", "hdl_cholesterol"]
        }
        # Add more diseases and their risk factors
    }
    
    if prediction not in risk_factors:
        return {}
    
    return {
        "primary_factors": [
            {
                "metric": field,
                "value": getattr(patient_data, field),
                "status": "Normal" if field in normal_ranges 
                        and normal_ranges[field][0] <= getattr(patient_data, field) <= normal_ranges[field][1] 
                        else "Abnormal"
            }
            for field in risk_factors[prediction]["primary"]
        ],
        "secondary_factors": [
            {
                "metric": field,
                "value": getattr(patient_data, field),
                "status": "Normal" if field in normal_ranges 
                        and normal_ranges[field][0] <= getattr(patient_data, field) <= normal_ranges[field][1] 
                        else "Abnormal"
            }
            for field in risk_factors[prediction]["secondary"]
        ]
    }
