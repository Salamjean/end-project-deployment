import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  EventSeat as SeatIcon
} from '@mui/icons-material';
import { parkingService } from '../../services/api';
import './styles/Parkings.css';

const Parkings = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [parkings, setParkings] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSpots: '',
    pricePerHour: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      const response = await parkingService.getAll();
      if (response.data && Array.isArray(response.data)) {
        setParkings(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des parkings:', error);
      setError('Erreur lors de la récupération des parkings');
    }
  };

  const handleOpen = (parking = null) => {
    if (parking) {
      setEditingParking(parking);
      setFormData({
        name: parking.name,
        address: parking.address,
        totalSpots: parking.totalSpots,
        pricePerHour: parking.pricePerHour,
        image: null
      });
      if (parking.image) {
        setPreviewImage(parking.image);
      } else {
        setPreviewImage('');
      }
    } else {
      setEditingParking(null);
      setFormData({
        name: '',
        address: '',
        totalSpots: '',
        pricePerHour: '',
        image: null
      });
      setPreviewImage('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingParking(null);
    setPreviewImage('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('totalSpots', formData.totalSpots);
      formDataToSend.append('pricePerHour', formData.pricePerHour);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingParking) {
        await parkingService.update(editingParking.id, formDataToSend);
      } else {
        await parkingService.create(formDataToSend);
      }
      fetchParkings();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du parking:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce parking ?')) {
      try {
        await parkingService.delete(id);
        fetchParkings();
      } catch (error) {
        console.error('Erreur lors de la suppression du parking:', error);
        setError('Erreur lors de la suppression du parking');
      }
    }
  };

  return (
    <Container className="parkings-container" maxWidth="lg">
      <Box className="parkings-header">
        <Typography className="parkings-title" variant="h4">
          Gestion des Parkings
        </Typography>
        <Button
          className="add-parking-button"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/parkings/add')}
        >
          Ajouter un parking
        </Button>
      </Box>

      {error && (
        <Box className="alert error" sx={{ mb: 2 }}>
          {error}
        </Box>
      )}

      <Grid container spacing={3} className="parkings-grid">
        {parkings.map((parking) => (
          <Grid item xs={12} sm={6} md={4} key={parking.id}>
            <Card className="parking-card">
              <Box
                className="parking-image"
                sx={{
                  backgroundImage: `url(${parking.image})`,
                }}
              />
              <CardContent className="parking-content">
                <Typography className="parking-name" variant="h6">
                  {parking.name}
                </Typography>
                <Box className="parking-address">
                  <LocationIcon className="parking-icon" />
                  <Typography variant="body2" color="text.secondary">
                    {parking.address}
                  </Typography>
                </Box>
                <Divider className="parking-divider" />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box className="parking-info">
                      <SeatIcon className="parking-icon" />
                      <Box>
                        <Typography className="parking-info-label" variant="body2">
                          Places
                        </Typography>
                        <Typography className="parking-info-value">
                          {parking.availableSpots}/{parking.totalSpots}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="parking-info">
                      <MoneyIcon className="parking-icon" />
                      <Box>
                        <Typography className="parking-info-label" variant="body2">
                          Prix/heure
                        </Typography>
                        <Typography className="parking-info-value">
                          {parking.pricePerHour} €
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions className="parking-actions">
                <Button
                  className="parking-action-button"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/parkings/edit/${parking.id}`)}
                >
                  Modifier
                </Button>
                <Button
                  className="parking-action-button"
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(parking.id)}
                >
                  Supprimer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          className: 'parking-dialog'
        }}
      >
        <DialogTitle className="parking-dialog-title">
          {editingParking ? 'Modifier le parking' : 'Ajouter un parking'}
        </DialogTitle>
        <DialogContent className="parking-dialog-content">
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              className="parking-form-field"
              fullWidth
              label="Nom du parking"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              className="parking-form-field"
              fullWidth
              label="Adresse"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              className="parking-form-field"
              fullWidth
              label="Nombre total de places"
              name="totalSpots"
              type="number"
              value={formData.totalSpots}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              className="parking-form-field"
              fullWidth
              label="Prix par heure"
              name="pricePerHour"
              type="number"
              value={formData.pricePerHour}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload">
                <Button
                  className="image-upload-button"
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  Choisir une image
                </Button>
              </label>
            </Box>
            {previewImage && (
              <Box className="image-preview">
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            className="add-parking-button"
          >
            {editingParking ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Parkings; 