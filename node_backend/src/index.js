const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinical-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Clinical Test Prediction System API' });
});

// Chatbot endpoint
app.post('/api/chatbot', async (req, res) => {
    try {
        const { message } = req.body;
        // TODO: Implement Dialogflow integration
        res.json({
            response: "I'm your medical assistant. How can I help you today?",
            intent: "welcome"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ML prediction endpoint
app.post('/api/predict', async (req, res) => {
    try {
        const predictionData = req.body;
        // TODO: Call Python ML API
        res.json({
            prediction: 0.75,
            confidence: 0.85,
            recommended_tests: [
                "Complete Blood Count",
                "Basic Metabolic Panel",
                "Thyroid Function Test"
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 