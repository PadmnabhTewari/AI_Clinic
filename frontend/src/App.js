import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';
import ChatBot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './chatbot/config';
import MessageParser from './chatbot/MessageParser';
import ActionProvider from './chatbot/ActionProvider';
import ImageAnalysis from './components/ImageAnalysis';
import axios from 'axios';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    blood_pressure: '',
    heart_rate: '',
    temperature: '',
    cholesterol: '',
    glucose: '',
    bmi: '',
    symptoms: [],
    previous_conditions: [],
  });
  const [prediction, setPrediction] = useState(null);
  const [newSymptom, setNewSymptom] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSymptom = () => {
    if (newSymptom && !formData.symptoms.includes(newSymptom)) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, newSymptom]
      }));
      setNewSymptom('');
    }
  };

  const handleAddCondition = () => {
    if (newCondition && !formData.previous_conditions.includes(newCondition)) {
      setFormData(prev => ({
        ...prev,
        previous_conditions: [...prev.previous_conditions, newCondition]
      }));
      setNewCondition('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/predict', {
        ...formData,
        gender: parseInt(formData.gender),
        age: parseFloat(formData.age),
        blood_pressure: parseFloat(formData.blood_pressure),
        heart_rate: parseFloat(formData.heart_rate),
        temperature: parseFloat(formData.temperature),
        cholesterol: parseFloat(formData.cholesterol),
        glucose: parseFloat(formData.glucose),
        bmi: parseFloat(formData.bmi),
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error getting prediction. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Clinical Test Prediction" />
          <Tab label="Medical Image Analysis" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                Clinical Test Prediction
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        label="Gender"
                      >
                        <MenuItem value={0}>Female</MenuItem>
                        <MenuItem value={1}>Male</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Blood Pressure"
                      name="blood_pressure"
                      type="number"
                      value={formData.blood_pressure}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Heart Rate"
                      name="heart_rate"
                      type="number"
                      value={formData.heart_rate}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Temperature"
                      name="temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Cholesterol"
                      name="cholesterol"
                      type="number"
                      value={formData.cholesterol}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Glucose"
                      name="glucose"
                      type="number"
                      value={formData.glucose}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="BMI"
                      name="bmi"
                      type="number"
                      value={formData.bmi}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Add Symptom"
                        value={newSymptom}
                        onChange={(e) => setNewSymptom(e.target.value)}
                      />
                      <Button variant="contained" onClick={handleAddSymptom}>
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.symptoms.map((symptom) => (
                        <Chip
                          key={symptom}
                          label={symptom}
                          onDelete={() => {
                            setFormData(prev => ({
                              ...prev,
                              symptoms: prev.symptoms.filter(s => s !== symptom)
                            }));
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Add Previous Condition"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                      />
                      <Button variant="contained" onClick={handleAddCondition}>
                        Add
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.previous_conditions.map((condition) => (
                        <Chip
                          key={condition}
                          label={condition}
                          onDelete={() => {
                            setFormData(prev => ({
                              ...prev,
                              previous_conditions: prev.previous_conditions.filter(c => c !== condition)
                            }));
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                    >
                      Get Prediction
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Medical Assistant
              </Typography>
              <ChatBot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </Paper>
          </Grid>
        </Grid>
        {prediction && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Prediction Results
            </Typography>
            <Typography variant="body1" gutterBottom>
              Probability of needing tests: {(prediction.prediction * 100).toFixed(1)}%
            </Typography>
            <Typography variant="body1" gutterBottom>
              Confidence: {(prediction.confidence * 100).toFixed(1)}%
            </Typography>
            <Typography variant="h6" gutterBottom>
              Recommended Tests:
            </Typography>
            <List>
              {prediction.recommended_tests.map((test, index) => (
                <ListItem key={index}>
                  <ListItemText primary={test} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ImageAnalysis />
      </TabPanel>
    </Container>
  );
}

export default App; 