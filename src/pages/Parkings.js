import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  ButtonGroup,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../services/api';

const Parkings = () => {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const response = await parkingService.getAll();
      console.log('Parkings reçus:', response.data);
      setParkings(response.data);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la récupération des parkings:', error);
      setError('Erreur lors du chargement des parkings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (parkingId) => {
    navigate(`/parking/${parkingId}`);
  };

  const handleReserve = (parkingId) => {
    navigate(`/reservation/${parkingId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Tous les Parkings Disponibles
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 4
        }}>
          <Grid container spacing={4} sx={{ maxWidth: '1600px' }}>
            {parkings.map((parking) => (
              <Grid item xs={12} md={4} key={parking._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    },
                    minWidth: '350px'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={parking.image}
                    alt={parking.name}
                    onError={(e) => {
                      console.error('Erreur de chargement de l\'image:', e);
                      e.target.src = '/images/default-parking.jpg';
                    }}
                    sx={{
                      objectFit: 'cover',
                      height: '200px'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 2 }}>
                      {parking.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                      {parking.description}
                    </Typography>
                    <Box sx={{ mt: 2, mb: 3 }}>
                      <Chip 
                        label={`${parking.availableSpots}/${parking.totalSpots} places`} 
                        color={parking.availableSpots > 0 ? "success" : "error"} 
                        sx={{ mr: 1, fontSize: '1rem', py: 1 }} 
                      />
                      <Chip 
                        label={`${parking.pricePerHour} FCFA/heure`} 
                        color="primary"
                        sx={{ fontSize: '1rem', py: 1 }}
                      />
                    </Box>
                    <ButtonGroup 
                      variant="contained" 
                      sx={{ mt: 3, width: '100%' }}
                    >
                      <Button 
                        color="primary"
                        onClick={() => handleViewDetails(parking._id)}
                        sx={{ flex: 1, py: 1.5, fontSize: '1rem' }}
                      >
                        Voir détails
                      </Button>
                      <Button 
                        color="secondary"
                        onClick={() => handleReserve(parking._id)}
                        disabled={parking.availableSpots === 0}
                        sx={{ flex: 1, py: 1.5, fontSize: '1rem' }}
                      >
                        {parking.availableSpots === 0 ? 'Complet' : 'Réserver'}
                      </Button>
                    </ButtonGroup>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Parkings; 