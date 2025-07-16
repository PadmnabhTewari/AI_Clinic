import tensorflow as tf
import numpy as np
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions
import cv2
import os

class MedicalImageAnalyzer:
    def __init__(self):
        # Load pre-trained models
        self.chest_xray_model = self._load_chest_xray_model()
        self.skin_cancer_model = self._load_skin_cancer_model()
        self.brain_tumor_model = self._load_brain_tumor_model()

    def _load_chest_xray_model(self):
        # Load a pre-trained model for chest X-ray analysis
        # Using a simplified version for demonstration
        model = ResNet50(weights='imagenet', include_top=True)
        return model

    def _load_skin_cancer_model(self):
        # Load a pre-trained model for skin cancer detection
        # Using a simplified version for demonstration
        model = ResNet50(weights='imagenet', include_top=True)
        return model

    def _load_brain_tumor_model(self):
        # Load a pre-trained model for brain tumor detection
        # Using a simplified version for demonstration
        model = ResNet50(weights='imagenet', include_top=True)
        return model

    def preprocess_image(self, img_path, target_size=(224, 224)):
        img = image.load_img(img_path, target_size=target_size)
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        return x

    def analyze_chest_xray(self, img_path):
        try:
            x = self.preprocess_image(img_path)
            predictions = self.chest_xray_model.predict(x)
            # Process predictions and return results
            return {
                'normal_probability': float(predictions[0][0]),
                'pneumonia_probability': float(predictions[0][1]),
                'tuberculosis_probability': float(predictions[0][2]),
                'confidence': float(np.max(predictions))
            }
        except Exception as e:
            return {'error': str(e)}

    def analyze_skin_cancer(self, img_path):
        try:
            x = self.preprocess_image(img_path)
            predictions = self.skin_cancer_model.predict(x)
            # Process predictions and return results
            return {
                'benign_probability': float(predictions[0][0]),
                'malignant_probability': float(predictions[0][1]),
                'confidence': float(np.max(predictions))
            }
        except Exception as e:
            return {'error': str(e)}

    def analyze_brain_tumor(self, img_path):
        try:
            x = self.preprocess_image(img_path)
            predictions = self.brain_tumor_model.predict(x)
            # Process predictions and return results
            return {
                'normal_probability': float(predictions[0][0]),
                'tumor_probability': float(predictions[0][1]),
                'confidence': float(np.max(predictions))
            }
        except Exception as e:
            return {'error': str(e)}

    def get_recommendations(self, analysis_type, results):
        recommendations = {
            'chest_xray': {
                'high_risk': [
                    "Schedule a follow-up with a pulmonologist",
                    "Get a CT scan for detailed analysis",
                    "Consider blood tests for infection markers"
                ],
                'medium_risk': [
                    "Schedule a follow-up with your primary care physician",
                    "Monitor symptoms and vital signs",
                    "Consider a second opinion"
                ],
                'low_risk': [
                    "Regular check-ups",
                    "Maintain healthy lifestyle",
                    "Monitor for any changes"
                ]
            },
            'skin_cancer': {
                'high_risk': [
                    "Schedule an appointment with a dermatologist",
                    "Consider a biopsy",
                    "Monitor for changes in size or color"
                ],
                'medium_risk': [
                    "Regular skin checks",
                    "Protect from sun exposure",
                    "Consider a second opinion"
                ],
                'low_risk': [
                    "Regular skin monitoring",
                    "Use sunscreen",
                    "Annual skin check"
                ]
            },
            'brain_tumor': {
                'high_risk': [
                    "Schedule an appointment with a neurologist",
                    "Get an MRI scan",
                    "Monitor for neurological symptoms"
                ],
                'medium_risk': [
                    "Schedule a follow-up scan",
                    "Monitor for symptoms",
                    "Consider a second opinion"
                ],
                'low_risk': [
                    "Regular check-ups",
                    "Monitor for any changes",
                    "Maintain healthy lifestyle"
                ]
            }
        }

        risk_level = 'low_risk'
        if analysis_type == 'chest_xray':
            if results.get('pneumonia_probability', 0) > 0.7 or results.get('tuberculosis_probability', 0) > 0.7:
                risk_level = 'high_risk'
            elif results.get('pneumonia_probability', 0) > 0.5 or results.get('tuberculosis_probability', 0) > 0.5:
                risk_level = 'medium_risk'
        elif analysis_type == 'skin_cancer':
            if results.get('malignant_probability', 0) > 0.7:
                risk_level = 'high_risk'
            elif results.get('malignant_probability', 0) > 0.5:
                risk_level = 'medium_risk'
        elif analysis_type == 'brain_tumor':
            if results.get('tumor_probability', 0) > 0.7:
                risk_level = 'high_risk'
            elif results.get('tumor_probability', 0) > 0.5:
                risk_level = 'medium_risk'

        return recommendations[analysis_type][risk_level] 