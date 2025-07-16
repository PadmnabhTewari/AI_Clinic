from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np
import joblib
import os
from models.image_analysis import MedicalImageAnalyzer
import shutil
import uuid

app = FastAPI(title="Clinical Test Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the model and scaler
model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'model.joblib')
scaler_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'scaler.joblib')

try:
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    image_analyzer = MedicalImageAnalyzer()
except Exception as e:
    print(f"Error loading models: {e}")
    model = None
    scaler = None
    image_analyzer = None

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class TestInput(BaseModel):
    age: float
    gender: int  # 0 for female, 1 for male
    blood_pressure: float
    heart_rate: float
    temperature: float
    cholesterol: float
    glucose: float
    bmi: float
    symptoms: List[str]
    previous_conditions: Optional[List[str]] = []

class PredictionResponse(BaseModel):
    prediction: float
    confidence: float
    recommended_tests: List[str]

class ImageAnalysisResponse(BaseModel):
    results: dict
    recommendations: List[str]
    confidence: float

def get_recommended_tests(prediction: float, symptoms: List[str]) -> List[str]:
    base_tests = [
        "Complete Blood Count (CBC)",
        "Basic Metabolic Panel",
        "Lipid Panel",
        "Thyroid Function Test",
        "Urinalysis"
    ]
    
    if prediction > 0.7:
        additional_tests = [
            "Chest X-ray",
            "ECG",
            "Liver Function Test",
            "Kidney Function Test"
        ]
        return base_tests + additional_tests
    elif prediction > 0.5:
        return base_tests + ["ECG", "Liver Function Test"]
    else:
        return base_tests[:3]

@app.get("/")
async def root():
    return {"message": "Welcome to Clinical Test Prediction API"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_test(input_data: TestInput):
    try:
        if model is None or scaler is None:
            raise HTTPException(status_code=500, detail="Model not loaded")

        # Prepare input features
        features = np.array([[
            input_data.age,
            input_data.gender,
            input_data.blood_pressure,
            input_data.heart_rate,
            input_data.temperature,
            input_data.cholesterol,
            input_data.glucose,
            input_data.bmi
        ]])

        # Scale features
        features_scaled = scaler.transform(features)

        # Make prediction
        prediction = model.predict_proba(features_scaled)[0][1]
        confidence = model.predict_proba(features_scaled)[0].max()

        # Get recommended tests
        recommended_tests = get_recommended_tests(prediction, input_data.symptoms)

        return {
            "prediction": float(prediction),
            "confidence": float(confidence),
            "recommended_tests": recommended_tests
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/chest-xray", response_model=ImageAnalysisResponse)
async def analyze_chest_xray(file: UploadFile = File(...)):
    try:
        if image_analyzer is None:
            raise HTTPException(status_code=500, detail="Image analyzer not loaded")

        # Save uploaded file
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Analyze image
        results = image_analyzer.analyze_chest_xray(file_path)
        
        # Get recommendations
        recommendations = image_analyzer.get_recommendations('chest_xray', results)
        
        # Clean up uploaded file
        os.remove(file_path)

        return {
            "results": results,
            "recommendations": recommendations,
            "confidence": results.get('confidence', 0.0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/skin-cancer", response_model=ImageAnalysisResponse)
async def analyze_skin_cancer(file: UploadFile = File(...)):
    try:
        if image_analyzer is None:
            raise HTTPException(status_code=500, detail="Image analyzer not loaded")

        # Save uploaded file
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Analyze image
        results = image_analyzer.analyze_skin_cancer(file_path)
        
        # Get recommendations
        recommendations = image_analyzer.get_recommendations('skin_cancer', results)
        
        # Clean up uploaded file
        os.remove(file_path)

        return {
            "results": results,
            "recommendations": recommendations,
            "confidence": results.get('confidence', 0.0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/brain-tumor", response_model=ImageAnalysisResponse)
async def analyze_brain_tumor(file: UploadFile = File(...)):
    try:
        if image_analyzer is None:
            raise HTTPException(status_code=500, detail="Image analyzer not loaded")

        # Save uploaded file
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Analyze image
        results = image_analyzer.analyze_brain_tumor(file_path)
        
        # Get recommendations
        recommendations = image_analyzer.get_recommendations('brain_tumor', results)
        
        # Clean up uploaded file
        os.remove(file_path)

        return {
            "results": results,
            "recommendations": recommendations,
            "confidence": results.get('confidence', 0.0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 