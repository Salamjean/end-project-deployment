import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './style/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          className="navbar-title"
          sx={{ 
            flexGrow: 1,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/home')}
        >
          Parking Manager
        </Typography>
        <Box>
          <Button className="nav-button" color="inherit" onClick={() => navigate('/parkings')}>
            Parkings
          </Button>
          <Button className="nav-button" color="inherit" onClick={() => navigate('/services')}>
            Services
          </Button>
          <Button className="nav-button" color="inherit" onClick={() => navigate('/about')}>
            À propos
          </Button>
          <Button className="nav-button" color="inherit" onClick={() => navigate('/contact')}>
            Contact
          </Button>
          <Button 
            className="welcome-button" 
            onClick={() => navigate('/')}
          >
            Bienvenue
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;