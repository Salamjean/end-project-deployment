import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Card,
  CardMedia
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { fr } from 'date-fns/locale';
import { parkingService, reservationService } from '../services/api';

const Reservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 1)),
    vehiclePlate: '',
    vehicleModel: ''
  });

  useEffect(() => {
    fetchParkingDetails();
  }, [id]);

  const fetchParkingDetails = async () => {
    try {
      const response = await parkingService.getById(id);
      setParking(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du parking:', error);
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleDateChange = (field) => (newValue) => {
    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  const calculateDuration = () => {
    const diff = formData.endDate - formData.startDate;
    const hours = Math.ceil(diff / (1000 * 60 * 60)); // Convertir en heures
    return hours > 0 ? hours : 0;
  };

  const calculateTotal = () => {
    if (!parking) return 0;
    const duration = calculateDuration();
    const total = duration * parking.pricePerHour;
    return total > 0 ? total : 0;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reservationData = {
        parkingId: id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        vehiclePlate: formData.vehiclePlate,
        vehicleModel: formData.vehicleModel,
        startDate: formData.startDate,
        endDate: formData.endDate,
        total: calculateTotal(),
        duration: calculateDuration()
      };

      console.log('Données de réservation à envoyer:', reservationData);

      // Envoyer la réservation au serveur
      const response = await reservationService.create(reservationData);
      console.log('Réponse du serveur:', response.data);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Message d\'erreur:', error.message);
      console.error('Réponse du serveur:', error.response?.data);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la réservation');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Chargement...</Typography>
      </Container>
    );
  }

  if (!parking) {
    return (
      <Container>
        <Typography>Parking non trouvé</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 } }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Réservation - {parking.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Réservation effectuée avec succès !
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={4} justifyContent="center">
                  {/* Informations personnelles */}
                  <Grid item xs={12} md={10}>
                    <fieldset style={{ 
                      border: '2px solid #1976d2', 
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}>
                      <legend style={{ 
                        color: '#1976d2', 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        padding: '0 10px',
                        margin: '0 auto'
                      }}>
                        Informations personnelles
                      </legend>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Prénom"
                            value={formData.firstName}
                            onChange={handleChange('firstName')}
                            required
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Nom"
                            value={formData.lastName}
                            onChange={handleChange('lastName')}
                            required
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            required
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Téléphone"
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            required
                            placeholder="06 12 34 56 78"
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>
                      </Grid>
                    </fieldset>
                  </Grid>

                  {/* Informations du véhicule */}
                  <Grid item xs={12} md={10}>
                    <fieldset style={{ 
                      border: '2px solid #1976d2', 
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}>
                      <legend style={{ 
                        color: '#1976d2', 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        padding: '0 10px',
                        margin: '0 auto'
                      }}>
                        Informations du véhicule
                      </legend>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Plaque d'immatriculation"
                            value={formData.vehiclePlate}
                            onChange={handleChange('vehiclePlate')}
                            required
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Modèle du véhicule"
                            value={formData.vehicleModel}
                            onChange={handleChange('vehicleModel')}
                            required
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>
                      </Grid>
                    </fieldset>
                  </Grid>

                  {/* Dates de réservation */}
                  <Grid item xs={12} md={10}>
                    <fieldset style={{ 
                      border: '2px solid #1976d2', 
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}>
                      <legend style={{ 
                        color: '#1976d2', 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        padding: '0 10px',
                        margin: '0 auto'
                      }}>
                        Dates de réservation
                      </legend>
                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} md={6}>
                          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                            <DateTimePicker
                              label="Date et heure d'arrivée"
                              value={formData.startDate}
                              onChange={handleDateChange('startDate')}
                              renderInput={(params) => (
                                <TextField 
                                  {...params} 
                                  fullWidth 
                                  variant="outlined"
                                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                              )}
                              minDateTime={new Date()}
                            />
                          </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                            <DateTimePicker
                              label="Date et heure de départ"
                              value={formData.endDate}
                              onChange={handleDateChange('endDate')}
                              renderInput={(params) => (
                                <TextField 
                                  {...params} 
                                  fullWidth 
                                  variant="outlined"
                                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                              )}
                              minDateTime={formData.startDate}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                    </fieldset>
                  </Grid>

                  {/* Récapitulatif */}
                  <Grid item xs={12} md={10}>
                    <fieldset style={{ 
                      border: '2px solid #1976d2', 
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }}>
                      <legend style={{ 
                        color: '#1976d2', 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        padding: '0 10px',
                        margin: '0 auto'
                      }}>
                        Récapitulatif
                      </legend>
                      <Grid container spacing={4} justifyContent="center">
                        {/* Colonne 1: Informations du parking */}
                        <Grid item xs={12} md={4}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 4,
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            height: '100%',
                            boxShadow: 1
                          }}>
                            <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                              <CardMedia
                                component="img"
                                height="250"
                                image={parking.image 
                                  ? `https://end-project-formation-frontend.onrender.com/uploads/${parking.image}`
                                  : 'https://source.unsplash.com/random/800x600/?parking'}
                                alt={parking.name}
                              />
                            </Card>
                            <Typography variant="h6" gutterBottom>
                              {parking.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {parking.address}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                              {parking.pricePerHour} FCFA/heure
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Colonne 2: Calcul des heures */}
                        <Grid item xs={12} md={4}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 4,
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            height: '100%',
                            boxShadow: 1
                          }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontSize: '1.2rem' }}>
                              Période de stationnement
                            </Typography>
                            <Box sx={{ mb: 4 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Arrivée
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
                                {formatDate(formData.startDate)}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 4 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Départ
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
                                {formatDate(formData.endDate)}
                              </Typography>
                            </Box>
                            <Divider sx={{ my: 3 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Durée totale
                              </Typography>
                              <Typography variant="h6" color="primary" sx={{ fontSize: '1.3rem' }}>
                                {calculateDuration()} heures
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        {/* Colonne 3: Montant total */}
                        <Grid item xs={12} md={4}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 4,
                            bgcolor: 'primary.light',
                            color: 'white',
                            borderRadius: 2,
                            height: '100%',
                            boxShadow: 1
                          }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '1.2rem' }}>
                              Détail du calcul
                            </Typography>
                            <Box sx={{ mb: 4 }}>
                              <Typography variant="body2">
                                Prix par heure
                              </Typography>
                              <Typography variant="h6" sx={{ fontSize: '1.3rem' }}>
                                {parking.pricePerHour} FCFA
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 4 }}>
                              <Typography variant="body2">
                                Nombre d'heures
                              </Typography>
                              <Typography variant="h6" sx={{ fontSize: '1.3rem' }}>
                                × {calculateDuration()}
                              </Typography>
                            </Box>
                            <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
                            <Box>
                              <Typography variant="subtitle1" gutterBottom>
                                Montant total à payer
                              </Typography>
                              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                                {calculateTotal()} FCFA
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 4 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          onClick={handleSubmit}
                          disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                          sx={{ 
                            py: 2.5,
                            borderRadius: 2,
                            fontSize: '1.2rem'
                          }}
                        >
                          Confirmer la réservation
                        </Button>
                      </Box>
                    </fieldset>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Reservation; 