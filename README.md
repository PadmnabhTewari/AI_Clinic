# Clinical Test Prediction System

A comprehensive system that combines Machine Learning for clinical test prediction and a chatbot for patient interaction.

## Project Structure

```
├── ml_backend/           # Python ML backend
│   ├── models/          # ML models
│   ├── data/           # Training and test data
│   └── api/            # FastAPI endpoints
├── node_backend/        # Node.js/Express backend
│   ├── routes/         # API routes
│   ├── controllers/    # Business logic
│   └── chatbot/        # Chatbot integration
└── frontend/           # React frontend
    ├── src/
    └── public/
```

## Features

- Clinical test prediction using ML models
- Interactive chatbot for patient queries
- User-friendly web interface
- Secure API endpoints
- Real-time predictions

## Setup Instructions

### ML Backend (Python)
1. Create a virtual environment:
   ```bash
   cd ml_backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Node.js Backend
1. Install dependencies:
   ```bash
   cd node_backend
   npm install
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. Start ML Backend:
   ```bash
   cd ml_backend
   uvicorn api.main:app --reload
   ```

2. Start Node.js Backend:
   ```bash
   cd node_backend
   npm start
   ```

3. Start Frontend:
   ```bash
   cd frontend
   npm start
   ```

## Technologies Used

- Python (FastAPI, scikit-learn, pandas)
- Node.js (Express)
- React
- MongoDB
- TensorFlow/PyTorch (for ML models) 