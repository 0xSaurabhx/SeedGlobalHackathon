import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.utils import class_weight
from imblearn.over_sampling import SMOTE
from .constants import normal_ranges

class HealthAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        # More conservative model parameters to prevent overfitting
        self.model = RandomForestClassifier(
            n_estimators=100,      # Reduced from 200
            max_depth=6,           # Reduced from 8
            min_samples_split=10,  # Increased from 8
            min_samples_leaf=5,    # Increased from 3
            max_features='sqrt',
            bootstrap=True,
            class_weight='balanced',
            random_state=42
        )
        self.feature_columns = None
        self.feature_importances = None
        self.smote = SMOTE(random_state=42)  # Add SMOTE for minority class

    def prepare_data(self, data):
        data = data.copy()
        
        # Increase noise factor for better generalization
        noise_factor = 0.02
        numeric_columns = data.select_dtypes(include=['float64', 'int64']).columns
        for col in numeric_columns:
            if col != 'Disease':
                noise = np.random.normal(0, noise_factor * data[col].std(), size=len(data))
                data[col] = data[col] + noise
        
        self.feature_columns = [col for col in data.columns if col != 'Disease']
        X = data[self.feature_columns]
        y = data['Disease']
        
        # Split before SMOTE to prevent data leakage
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=42
        )
        
        # Apply SMOTE only to training data
        X_train_resampled, y_train_resampled = self.smote.fit_resample(X_train, y_train)
        
        return X_train_resampled, X_test, y_train_resampled, y_test

    def train(self, data):
        X_train, X_test, y_train, y_test = self.prepare_data(data)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Grid search for best parameters
        param_grid = {
            'n_estimators': [50, 100],
            'max_depth': [4, 6, 8],
            'min_samples_split': [8, 10, 12],
            'min_samples_leaf': [4, 5, 6]
        }
        
        grid_search = GridSearchCV(
            estimator=RandomForestClassifier(
                random_state=42,
                class_weight='balanced',
                bootstrap=True
            ),
            param_grid=param_grid,
            cv=5,
            scoring='balanced_accuracy',
            n_jobs=-1
        )
        
        # Fit grid search
        grid_search.fit(X_train_scaled, y_train)
        
        # Use best model
        self.model = grid_search.best_estimator_
        
        # Enhanced cross-validation
        skf = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
        cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=skf, scoring='balanced_accuracy')
        
        # Bootstrap feature importance
        importances = []
        for i in range(50):  # Increased iterations
            # Sample with replacement
            indices = np.random.choice(len(X_train_scaled), size=int(len(X_train_scaled) * 0.8), replace=True)
            X_bootstrap = X_train_scaled[indices]
            y_bootstrap = y_train.iloc[indices]
            
            model_bootstrap = RandomForestClassifier(
                **grid_search.best_params_,
                random_state=i
            )
            model_bootstrap.fit(X_bootstrap, y_bootstrap)
            importances.append(model_bootstrap.feature_importances_)
        
        # Calculate mean and confidence intervals
        self.feature_importances = dict(zip(
            self.feature_columns,
            np.mean(importances, axis=0)
        ))
        
        feature_importance_ci = dict(zip(
            self.feature_columns,
            np.percentile(importances, [2.5, 97.5], axis=0).T
        ))
        
        # Model evaluation
        y_pred = self.model.predict(X_test_scaled)
        probas = self.model.predict_proba(X_test_scaled)
        
        evaluation = {
            'accuracy': accuracy_score(y_test, y_pred),
            'cv_scores_mean': cv_scores.mean(),
            'cv_scores_std': cv_scores.std(),
            'classification_report': classification_report(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'top_features': sorted(
                [(k, v, feature_importance_ci[k]) 
                 for k, v in self.feature_importances.items()],
                key=lambda x: x[1],
                reverse=True
            )[:5],
            'best_params': grid_search.best_params_
        }
        
        return evaluation
    
    def predict_disease(self, patient_data):
        # Convert actual values to normalized range
        normalized_data = patient_data.copy()
        for col in patient_data.columns:
            col_lower = col.lower().replace(' ', '_')
            if col_lower in normal_ranges:
                min_val, max_val = normal_ranges[col_lower]
                normalized_data[col] = (patient_data[col] - min_val) / (max_val - min_val)
        
        # Scale the normalized data
        scaled_data = self.scaler.transform(normalized_data)
        
        # Get predictions and probabilities
        prediction = self.model.predict(scaled_data)
        probabilities = self.model.predict_proba(scaled_data)
        
        # Get top contributing features
        feature_contributions = []
        for i, col in enumerate(self.feature_columns):
            contribution = {
                'feature': col,
                'importance': self.feature_importances[col],
                'value': patient_data[col].iloc[0],
                'normalized_value': normalized_data[col].iloc[0]
            }
            feature_contributions.append(contribution)
        
        feature_contributions.sort(key=lambda x: x['importance'], reverse=True)
        
        return {
            'prediction': prediction[0],
            'probabilities': probabilities[0].tolist(),
            'top_contributing_features': feature_contributions[:5]
        }
    
    def calculate_health_score(self, patient_data):
        prediction_result = self.predict_disease(patient_data)
        
        # Use model's confidence and feature importances for score
        prediction_confidence = max(prediction_result['probabilities'])
        weighted_score = 0
        total_importance = 0
        
        # Calculate score using feature importances and normalized values
        for col in patient_data.columns:
            col_lower = col.lower().replace(' ', '_')
            if col_lower in normal_ranges:
                min_val, max_val = normal_ranges[col_lower]
                value = patient_data[col].iloc[0]
                importance = self.feature_importances.get(col, 0.01)  # Default importance if not found
                total_importance += importance
                
                # Calculate optimal range
                range_width = max_val - min_val
                optimal_min = min_val + (range_width * 0.1)  # 10% from min
                optimal_max = max_val - (range_width * 0.1)  # 10% from max
                
                # Calculate feature score
                if optimal_min <= value <= optimal_max:
                    feature_score = 100  # Optimal value
                else:
                    if value < min_val:
                        feature_score = max(0, (value / min_val) * 80)
                    elif value > max_val:
                        feature_score = max(0, (2 - value / max_val) * 80)
                    else:
                        # Within normal range but not optimal
                        if value < optimal_min:
                            feature_score = 80 + (value - min_val) * 20 / (optimal_min - min_val)
                        else:
                            feature_score = 80 + (max_val - value) * 20 / (max_val - optimal_max)
                
                weighted_score += feature_score * importance
        
        # Normalize weighted score
        if total_importance > 0:
            weighted_score = weighted_score / total_importance
        
        # Adjust confidence impact based on prediction
        if prediction_result['prediction'] == 'Healthy':
            confidence_weight = 0.2  # Less weight for healthy predictions
        else:
            confidence_weight = 0.3  # More weight for disease predictions
        
        # Calculate final score
        health_score = (weighted_score * (1 - confidence_weight)) + (prediction_confidence * 100 * confidence_weight)
        
        # Boost score for healthy prediction with normal values
        if prediction_result['prediction'] == 'Healthy' and self.metrics_at_risk(patient_data) == 0:
            health_score = min(100, health_score * 1.2)  # 20% boost
        
        return round(min(100, max(0, health_score)), 2)

    def metrics_at_risk(self, patient_data):
        count = 0
        for col in patient_data.columns:
            col_lower = col.lower().replace(' ', '_')
            if col_lower in normal_ranges:
                min_val, max_val = normal_ranges[col_lower]
                value = patient_data[col].iloc[0]
                if value < min_val or value > max_val:
                    count += 1
        return count
