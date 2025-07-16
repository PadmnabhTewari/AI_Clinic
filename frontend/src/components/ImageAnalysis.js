import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';

const ImageAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState('chest-xray');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:8000/analyze/${analysisType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error analyzing image');
    } finally {
      setLoading(false);
    }
  };

  const getAnalysisTypeLabel = (type) => {
    switch (type) {
      case 'chest-xray':
        return 'Chest X-ray Analysis';
      case 'skin-cancer':
        return 'Skin Cancer Detection';
      case 'brain-tumor':
        return 'Brain Tumor Detection';
      default:
        return '';
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Medical Image Analysis
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Analysis Type
              </Typography>
              <Grid container spacing={2}>
                {['chest-xray', 'skin-cancer', 'brain-tumor'].map((type) => (
                  <Grid item key={type}>
                    <Button
                      variant={analysisType === type ? 'contained' : 'outlined'}
                      onClick={() => setAnalysisType(type)}
                    >
                      {getAnalysisTypeLabel(type)}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  Upload Image
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalysis}
              disabled={!selectedFile || loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze Image'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {preview && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Image Preview
                </Typography>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        {results && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Confidence: {(results.confidence * 100).toFixed(1)}%
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Probabilities:
                </Typography>
                <List>
                  {Object.entries(results.results)
                    .filter(([key]) => key !== 'confidence')
                    .map(([key, value]) => (
                      <ListItem key={key}>
                        <ListItemText
                          primary={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          secondary={`${(value * 100).toFixed(1)}%`}
                        />
                      </ListItem>
                    ))}
                </List>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Recommendations:
                </Typography>
                <List>
                  {results.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageAnalysis; 