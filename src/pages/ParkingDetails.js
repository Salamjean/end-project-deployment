import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  Card,
  CardMedia
} from '@mui/material';
import { parkingService } from '../services/api';
import { AccessTime, LocationOn, LocalParking, Security, AttachMoney } from '@mui/icons-material';

const ParkingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleReserve = () => {
    navigate(`/reservation/${id}`);
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
    <Container maxWidth="xl">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Image principale */}
        <Card sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', width: '100%', maxWidth: '1200px' }}>
          <CardMedia
            component="img"
            height="400"
            image={parking.image 
              ? `https://end-project-formation-frontend.onrender.com/uploads/${parking.image}`
              : 'https://source.unsplash.com/random/1200x800/?parking'}
            alt={parking.name}
            sx={{ objectFit: 'cover' }}
          />
        </Card>

        <Grid container spacing={4} sx={{ maxWidth: '1200px' }}>
          {/* Informations principales */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, textAlign: 'center' }}>
              <Typography variant="h3" component="h1" gutterBottom align="center">
                {parking.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {parking.address}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, justifyContent: 'center' }}>
                <Chip 
                  icon={<LocalParking />}
                  label={`${parking.availableSpots} places disponibles`} 
                  color="success" 
                  sx={{ fontSize: '1rem', py: 1 }}
                />
                <Chip 
                  icon={<AttachMoney />}
                  label={`${parking.pricePerHour} FCFA/heure`} 
                  color="primary"
                  sx={{ fontSize: '1rem', py: 1 }}
                />
                <Chip 
                  icon={<AccessTime />}
                  label={parking.openingHours || '24h/24, 7j/7'} 
                  sx={{ fontSize: '1rem', py: 1 }}
                />
                <Chip 
                  icon={<Security />}
                  label={parking.isSecured ? 'Sécurisé' : 'Non sécurisé'} 
                  color={parking.isSecured ? 'success' : 'default'}
                  sx={{ fontSize: '1rem', py: 1 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom align="center">
                Description
              </Typography>
              <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
                {parking.description}
              </Typography>

              {parking.services && parking.services.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h5" gutterBottom align="center">
                    Services disponibles
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {parking.services.map((service, index) => (
                      <Chip 
                        key={index}
                        label={service}
                        sx={{ fontSize: '1rem', py: 1 }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Paper>

            {/* Carte ou informations supplémentaires */}
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom align="center">
                Localisation
              </Typography>
              <Typography paragraph sx={{ fontSize: '1.1rem', textAlign: 'center' }}>
                {parking.address}
              </Typography>
              {/* Ici vous pouvez ajouter une carte Google Maps */}
            </Paper>
          </Grid>

          {/* Panneau latéral de réservation */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                position: 'sticky', 
                top: 20,
                backgroundColor: 'primary.light',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" gutterBottom align="center">
                Réserver une place
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h4" color="white" gutterBottom align="center">
                  {parking.pricePerHour} FCFA
                  <Typography component="span" variant="subtitle1">
                    /heure
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }} align="center">
                  Places disponibles : {parking.availableSpots}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  onClick={handleReserve}
                  disabled={parking.availableSpots === 0}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                >
                  {parking.availableSpots > 0 ? 'Réserver maintenant' : 'Complet'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ParkingDetails; 