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
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../services/api';
import './styles/Parkings.css'

const ClientParkings = () => {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);

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
    }
  };

  const handleViewDetails = (parkingId) => {
    navigate(`/parking/${parkingId}`);
  };

  const handleReserve = (parkingId) => {
    navigate(`/reservation/${parkingId}`);
  };

  return (
    <Box className="parkings-container">
      <Container maxWidth="xl" className="parkings-content">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          className="parkings-title"
        >
          Tous les Parkings Disponibles
        </Typography>
        
        <Grid container spacing={4} className="parkings-grid">
          {parkings.map((parking) => (
            <Grid item xs={12} sm={6} md={4} key={parking.id}>
              <Card className="parking-card">
                <Box className="parking-card-media-container" sx={{
                  width: '100%',
                  maxWidth: '350px' // Largeur fixe pour toutes les cartes
                }}>
                  <CardMedia
                    component="img"
                    image={parking.image}
                    alt={parking.name}
                    className="parking-card-media"
                  />
                  <Box className="parking-location-badge">
                    <Typography variant="caption">📍 {parking.address}</Typography>
                  </Box>
                </Box>
                
                <CardContent className="parking-card-content">
                  <Typography gutterBottom variant="h5" className="parking-card-title">
                    {parking.name}
                  </Typography>
                  <Typography variant="body2" className="parking-card-description">
                    {parking.description}
                  </Typography>
                  
                  <Box className="parking-chip-group">
                    <Chip
                      label={`${parking.availableSpots}/${parking.totalSpots} places`}
                      className={`parking-chip ${
                        parking.availableSpots > 0 ? 'parking-chip-available' : 'parking-chip-full'
                      }`}
                    />
                    <Chip
                      label={`${parking.pricePerHour} Fcfa/h`}
                      className="parking-chip-price"
                    />
                  </Box>
                  
                  <Box className="parking-card-actions">
                    <Button
                      onClick={() => handleViewDetails(parking.id)}
                      className="parking-card-button details"
                    >
                      Voir détails
                    </Button>
                    <Button
                      onClick={() => handleReserve(parking.id)}
                      disabled={parking.availableSpots === 0}
                      className={`parking-card-button reserve ${
                        parking.availableSpots === 0 ? 'parking-card-button-disabled' : ''
                      }`}
                    >
                      {parking.availableSpots === 0 ? 'Complet' : 'Réserver'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientParkings;