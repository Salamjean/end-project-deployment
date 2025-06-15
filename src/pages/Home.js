import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { parkingService } from '../services/api';
import Carousel from '../components/Carousel';

const Home = () => {
  const navigate = useNavigate();
  const [latestParkings, setLatestParkings] = useState([]);

  useEffect(() => {
    fetchLatestParkings();
  }, []);

  const fetchLatestParkings = async () => {
    try {
      const response = await parkingService.getAll();
      if (response.data && Array.isArray(response.data)) {
        setLatestParkings(response.data.slice(-3).reverse());
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
    <Box className="home-container">
      {/* Hero Section avec Carousel */}
      <Box className="home-header">
        <Carousel className="home-carousel" />
      </Box>

      {/* Section des derniers parkings */}
      <Container maxWidth="xl" className="home-parkings-container">
        <Typography variant="h4" component="h2" className="home-section-title">
          Derniers parkings ajoutés
        </Typography>
        
        <Box className="home-parkings-grid">
          {latestParkings.map((parking, index) => (
            <Card 
              key={parking.id} 
              className={`home-card ${index % 2 === 0 ? 'home-card-even' : 'home-card-odd'}`}
            >
              <Box className="home-card-media-container">
                <CardMedia
                  component="img"
                  image={parking.image}
                  alt={parking.name}
                  className="home-card-media"
                />
                <Box className="home-location-badge">
                  <Typography variant="caption">📍 {parking.address}</Typography>
                </Box>
              </Box>
              
              <CardContent className="home-card-content">
                <Typography gutterBottom variant="h5" className="home-card-title">
                  {parking.name}
                </Typography>
                <Typography variant="body2" className="home-card-description">
                  {parking.description}
                </Typography>
                
                <Box className="home-chip-group">
                  <Chip
                    label={`${parking.availableSpots}/${parking.totalSpots} places`}
                    className={`home-chip ${
                      parking.availableSpots > 0 ? 'home-chip-available' : 'home-chip-full'
                    }`}
                  />
                  <Chip
                    label={`${parking.pricePerHour} Fcfa/h`}
                    className="home-chip-price"
                  />
                </Box>
                
                <Box className="home-card-actions">
                  <Button
                    onClick={() => handleViewDetails(parking.id)}
                    className="home-card-button details"
                  >
                    Voir détails
                  </Button>
                  <Button
                    onClick={() => handleReserve(parking.id)}
                    disabled={parking.availableSpots === 0}
                    className={`home-card-button reserve ${
                      parking.availableSpots === 0 ? 'home-card-button-disabled' : ''
                    }`}
                  >
                    {parking.availableSpots === 0 ? 'Complet' : 'Réserver'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;