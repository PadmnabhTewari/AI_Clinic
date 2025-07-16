import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def generate_sample_data(n_samples=1000):
    """Generate sample medical data for training"""
    np.random.seed(42)
    
    data = {
        'age': np.random.normal(45, 15, n_samples),
        'gender': np.random.binomial(1, 0.5, n_samples),
        'blood_pressure': np.random.normal(120, 15, n_samples),
        'heart_rate': np.random.normal(75, 10, n_samples),
        'temperature': np.random.normal(37, 0.5, n_samples),
        'cholesterol': np.random.normal(200, 30, n_samples),
        'glucose': np.random.normal(100, 15, n_samples),
        'bmi': np.random.normal(25, 5, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Generate target variable (1 for high risk, 0 for low risk)
    # This is a simplified risk calculation
    risk_score = (
        0.1 * (df['age'] - 45) / 15 +
        0.1 * (df['blood_pressure'] - 120) / 15 +
        0.1 * (df['heart_rate'] - 75) / 10 +
        0.1 * (df['temperature'] - 37) / 0.5 +
        0.1 * (df['cholesterol'] - 200) / 30 +
        0.1 * (df['glucose'] - 100) / 15 +
        0.1 * (df['bmi'] - 25) / 5
    )
    
    df['target'] = (risk_score > 0.5).astype(int)
    
    return df

def train_model():
    """Train the model and save it"""
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Generate sample data
    print("Generating sample data...")
    df = generate_sample_data()
    
    # Prepare features and target
    X = df.drop('target', axis=1)
    y = df['target']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    print("Training model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate the model
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    print(f"Training accuracy: {train_score:.3f}")
    print(f"Testing accuracy: {test_score:.3f}")
    
    # Save the model and scaler
    print("Saving model and scaler...")
    joblib.dump(model, 'models/model.joblib')
    joblib.dump(scaler, 'models/scaler.joblib')
    print("Model and scaler saved successfully!")

if __name__ == "__main__":
    train_model() 