import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

// Importez vos images ici
// Exemple:
// import parking1 from '../assets/images/parking1.jpg';
// import parking2 from '../assets/images/parking2.jpg';
// import parking3 from '../assets/images/parking3.jpg';

const images = [
  {
    // Remplacez ces URLs par vos images importées
    // Exemple: url: parking1,
    url: '/images/pak.jpg',
    title: 'Parking moderne'
  },
  {
    url: '/images/par.jpg',
    title: 'Parking sécurisé'
  },
  {
    url: '/images/voi.jpg',
    title: 'Parking intelligent'
  }
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fonction pour passer à l'image suivante
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Fonction pour passer à l'image précédente
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Effet pour le défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval); // Nettoie l'intervalle quand le composant est démonté
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '700px' }}>
      <Paper
        sx={{
          height: '87%',
          width: '100%',
          backgroundImage: `url(${images[currentIndex].url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          transition: 'background-image 0.5s ease-in-out'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: 2,
            textAlign: 'center'
          }}
        >
          {images[currentIndex].title}
        </Box>
      </Paper>
      
      <IconButton
        sx={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
        onClick={handlePrevious}
      >
        <KeyboardArrowLeft />
      </IconButton>
      
      <IconButton
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
        onClick={handleNext}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

export default Carousel; 