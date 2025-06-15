import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { parkingService } from '../../services/api';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Box,
  FormControlLabel,
  Switch,
  IconButton,
  Divider,
  Alert,
  Card,
  CardMedia
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import './styles/AddParking.css';

const AddParking = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSpots: '',
    pricePerHour: '',
    description: '',
    isActive: true,
    image: null,
    services: [''],
    openingHours: '24h/24, 7j/7'
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Vérifier le type de fichier
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Seuls les fichiers JPG, JPEG et PNG sont acceptés');
      return;
    }

    // Créer l'URL de prévisualisation
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    // Ajouter le fichier au formData
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setPreviewImage(null);
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Veuillez vous connecter pour créer un parking');
      return;
    }

    // Validation des champs requis
    if (!formData.name || !formData.address || !formData.totalSpots || !formData.pricePerHour) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Préparation des données
      const parkingData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        totalSpots: parseInt(formData.totalSpots),
        pricePerHour: parseFloat(formData.pricePerHour),
        description: formData.description ? formData.description.trim() : '',
        isActive: formData.isActive,
        openingHours: formData.openingHours || '24h/24, 7j/7',
        services: formData.services.filter(service => service.trim() !== '')
      };

      console.log('Données préparées:', parkingData);

      // Création du FormData
      const formDataToSend = new FormData();
      
      // Ajout des données de base
      Object.entries(parkingData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => {
            formDataToSend.append(key, item);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Ajout de l'image si présente
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Afficher le contenu du FormData pour le débogage
      console.log('Contenu du FormData:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await parkingService.create(formDataToSend);
      console.log('Réponse du serveur:', response.data);

      navigate('/dashboard/parkings');
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Une erreur est survenue lors de la création du parking');
    }
  };

  return (
    <Container className="add-parking-container" maxWidth="xl">
      <Paper className="add-parking-paper" elevation={3}>
        <Box className="add-parking-header">
          <Typography className="add-parking-title" variant="h4">
            Ajouter un nouveau parking
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Section Informations de base - Pleine largeur */}
            <Grid item xs={12}>
              <Box className="add-parking-section">
                <Typography className="section-title" variant="h6">
                  Informations de base
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      className="add-parking-field"
                      fullWidth
                      label="Nom du parking"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      error={!formData.name}
                      helperText={!formData.name ? 'Le nom du parking est requis' : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      className="add-parking-field"
                      fullWidth
                      label="Adresse"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      error={!formData.address}
                      helperText={!formData.address ? "L'adresse est requise" : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      className="add-parking-field"
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Colonne 1 - Capacité, tarifs et services */}
            <Grid item xs={12} md={6}>
              {/* Capacité et tarifs */}
              <Box className="add-parking-section">
                <Typography className="section-title" variant="h6">
                  Capacité et tarifs
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      className="add-parking-field"
                      fullWidth
                      label="Nombre total de places"
                      name="totalSpots"
                      type="number"
                      value={formData.totalSpots}
                      onChange={handleChange}
                      required
                      error={!formData.totalSpots || formData.totalSpots < 1}
                      helperText={!formData.totalSpots ? 'Le nombre de places est requis' : 
                                formData.totalSpots < 1 ? 'Le nombre de places doit être supérieur à 0' : ''}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      className="add-parking-field"
                      fullWidth
                      label="Prix par heure (FCFA)"
                      name="pricePerHour"
                      type="number"
                      value={formData.pricePerHour}
                      onChange={handleChange}
                      required
                      error={!formData.pricePerHour || formData.pricePerHour < 0}
                      helperText={!formData.pricePerHour ? 'Le prix par heure est requis' : 
                                formData.pricePerHour < 0 ? 'Le prix ne peut pas être négatif' : ''}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Services */}
              <Box className="add-parking-section">
                <Typography className="section-title" variant="h6">
                  Services proposés
                </Typography>
                {formData.services.map((service, index) => (
                  <Box key={index} className="service-item">
                    <TextField
                      fullWidth
                      label={`Service ${index + 1}`}
                      value={service}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'services')}
                    />
                    <IconButton 
                      color="error" 
                      onClick={() => removeArrayItem(index, 'services')}
                      disabled={formData.services.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  className="add-service-button"
                  startIcon={<AddIcon />}
                  onClick={() => addArrayItem('services')}
                >
                  Ajouter un service
                </Button>
              </Box>
            </Grid>

            {/* Colonne 2 - Image, horaires et statut */}
            <Grid item xs={12} md={6}>
              {/* Image */}
              <Box className="add-parking-section">
                <Typography className="section-title" variant="h6">
                  Image du parking
                </Typography>
                
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      className="upload-button"
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                    >
                      Sélectionner une image
                    </Button>
                  </label>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Formats acceptés : JPG, JPEG, PNG
                  </Typography>
                </Box>

                {previewImage && (
                  <Box className="image-preview-container">
                    <Card>
                      <CardMedia
                        className="image-preview"
                        component="img"
                        image={previewImage}
                        alt="Aperçu du parking"
                      />
                      <IconButton
                        className="delete-image-button"
                        onClick={removeImage}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Card>
                  </Box>
                )}
              </Box>

              {/* Horaires et statut */}
              <Box className="add-parking-section">
                <Typography className="section-title" variant="h6">
                  Horaires et statut
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      className="add-parking-field"
                      fullWidth
                      label="Horaires d'ouverture"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleChange}
                      placeholder="ex: 24h/24, 7j/7"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isActive}
                          onChange={handleChange}
                          name="isActive"
                          color="primary"
                        />
                      }
                      label="Parking actif"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Boutons d'action */}
            <Grid item xs={12}>
              <Box className="action-buttons-container">
                <Box className="action-buttons">
                  <Button
                    className="cancel-button"
                    variant="outlined"
                    onClick={() => navigate('/dashboard/parkings')}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="submit-button"
                    type="submit"
                    variant="contained"
                    size="large"
                  >
                    Créer le parking
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddParking; 