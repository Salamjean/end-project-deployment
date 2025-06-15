import React, { useState, useEffect } from 'react';
import './styles/AddClients.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import axios from 'axios';

const AddClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehiclePlate: '',
    vehicleModel: '',
    parkingId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchParkings();
    
    if (id) {
      fetchClientData();
    } else {
      const pendingClientData = localStorage.getItem('pendingClientData');
      if (pendingClientData) {
        const data = JSON.parse(pendingClientData);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          vehiclePlate: data.vehiclePlate || '',
          vehicleModel: data.vehicleModel || '',
          parkingId: data.parkingId || '',
          startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : ''
        });
        localStorage.removeItem('pendingClientData');
      }
    }
  }, [id]);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non authentifié');
        return;
      }

      const response = await axios.get(`https://end-projet-backend-3.onrender.com/api/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const client = response.data.client;
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        vehiclePlate: client.vehiclePlate || '',
        vehicleModel: client.vehicleModel || '',
        parkingId: client.parking?._id || '',
        startDate: client.startDate ? new Date(client.startDate).toISOString().slice(0, 16) : '',
        endDate: client.endDate ? new Date(client.endDate).toISOString().slice(0, 16) : ''
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données du client:', error);
      setError('Erreur lors de la récupération des données du client');
    } finally {
      setLoading(false);
    }
  };

  const fetchParkings = async () => {
    try {
      const response = await axios.get('https://end-projet-backend-3.onrender.com/api/parkings');
      if (Array.isArray(response.data)) {
        setParkings(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des parkings:', error);
      setError('Erreur lors de la récupération des parkings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non authentifié');
        return;
      }

      if (!formData.name.trim()) {
        setError('Le nom est requis');
        return;
      }

      if (!validateEmail(formData.email)) {
        setError('Veuillez entrer une adresse email valide');
        return;
      }

      if (!validatePhone(formData.phone)) {
        setError('Veuillez entrer un numéro de téléphone valide');
        return;
      }

      let duration = 0;
      let totalPrice = 0;
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        duration = Math.ceil((end - start) / (1000 * 60 * 60));

        const selectedParking = parkings.find(p => p._id === formData.parkingId);
        if (selectedParking) {
          totalPrice = duration * selectedParking.pricePerHour;
        }
      }

      const clientData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        vehiclePlate: formData.vehiclePlate.trim(),
        vehicleModel: formData.vehicleModel.trim(),
        parkingId: formData.parkingId,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        duration,
        totalPrice
      };

      let response;
      if (id) {
        response = await axios.put(
          `https://end-projet-backend-3.onrender.com/api/clients/${id}`,
          clientData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Client modifié avec succès');
      } else {
        response = await axios.post(
          'https://end-projet-backend-3.onrender.com/api/clients',
          clientData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Client créé avec succès');
      }

      setTimeout(() => {
        navigate('/admin/clients');
      }, 2000);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (error.response) {
        setError(error.response.data.message || error.response.data.error || 'Erreur lors de l\'opération');
      } else if (error.request) {
        setError('Le serveur ne répond pas. Veuillez vérifier votre connexion.');
      } else {
        setError(error.message || 'Une erreur est survenue');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className="add-client-container" maxWidth="lg">
      <Paper className="add-client-paper" elevation={3}>
        <Typography className="add-client-title" variant="h4" component="h1" gutterBottom>
          {id ? 'Modifier le Client' : 'Ajouter un Client'}
        </Typography>

        {error && (
          <Alert className="alert-message" severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert className="alert-message" severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <Typography className="section-title" variant="h6" gutterBottom>
              Informations Personnelles
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  className="form-field"
                  fullWidth
                  required
                  label="Nom"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  className="form-field"
                  fullWidth
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  className="form-field"
                  fullWidth
                  required
                  label="Téléphone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider className="section-divider" sx={{ my: 4 }} />

          <Box>
            <Typography className="section-title" variant="h6" gutterBottom>
              Informations du Véhicule
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  className="form-field"
                  fullWidth
                  label="Modèle du véhicule"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  className="form-field"
                  fullWidth
                  label="Plaque d'immatriculation"
                  name="vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider className="section-divider" sx={{ my: 4 }} />

          <Box>
            <Typography className="section-title" variant="h6" gutterBottom>
              Informations de Réservation
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth className="form-field">
                  <InputLabel >Parking</InputLabel>
                  <Select
                    className="parking-select"
                    name="parkingId"
                    value={formData.parkingId}
                    onChange={handleChange}
                    label="Parking"
                  >
                    {parkings.map((parking) => (
                      <MenuItem key={parking._id} value={parking._id}>
                        {parking.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  className="form-field"
                  fullWidth
                  label="Date de début"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  className="form-field"
                  fullWidth
                  label="Date de fin"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box className="action-buttons">
            <Button
              className="cancel-button"
              variant="outlined"
              onClick={() => navigate('/admin/clients')}
              size="large"
            >
              Annuler
            </Button>
            <Button
              className="submit-button"
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              size="large"
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? 'Enregistrement...' : (id ? 'Modifier le client' : 'Ajouter le client')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddClient;