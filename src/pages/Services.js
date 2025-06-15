import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Paper,
  Button,
  Divider
} from '@mui/material';
import {
  LocalParking as ParkingIcon,
  Security as SecurityIcon,
  AccessTime as TimeIcon,
  Payment as PaymentIcon,
  DirectionsCar as CarIcon,
  Support as SupportIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const ServiceCard = ({ icon: Icon, title, description, featured }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
          '& .icon-box': {
            transform: 'scale(1.1) rotate(5deg)',
            backgroundColor: '#6C63FF',
            color: 'white'
          },
          '& .card-content': {
            backgroundColor: 'rgba(33, 150, 243, 0.03)'
          }
        },
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
        gridColumn: featured ? 'span 2' : 'span 1',
        gridRow: featured ? 'span 2' : 'span 1',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #6C63FF, #6C63FF)',
          opacity: 0.8
        }
      }}
    >
      <CardContent 
        className="card-content"
        sx={{ 
          p: featured ? 6 : 4, 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Box
          className="icon-box"
          sx={{
            width: featured ? (isMobile ? 100 : 120) : (isMobile ? 80 : 100),
            height: featured ? (isMobile ? 100 : 120) : (isMobile ? 80 : 100),
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#6C63FF',
            color: 'white',
            mb: featured ? 4 : 3,
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
          }}
        >
          <Icon sx={{ fontSize: featured ? (isMobile ? 50 : 60) : (isMobile ? 40 : 50) }} />
        </Box>
        <Typography
          variant={featured ? "h4" : "h5"}
          component="h3"
          sx={{
            fontWeight: 'bold',
            color:'#6C63FF',
            mb: featured ? 3 : 2,
            textAlign: 'center',
            fontSize: featured ? { xs: '1.5rem', md: '1.8rem' } : { xs: '1.3rem', md: '1.5rem' }
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            lineHeight: 1.8,
            fontSize: featured ? { xs: '1.1rem', md: '1.2rem' } : { xs: '1rem', md: '1.1rem' },
            textAlign: 'center',
            flexGrow: 1
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Services = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const services = [
    {
      icon: ParkingIcon,
      title: "Réservation en Ligne",
      description: "Réservez votre place de parking en quelques clics, 24h/24 et 7j/7. Simple, rapide et sécurisé.",
      featured: true
    },
    {
      icon: SecurityIcon,
      title: "Sécurité Garantie",
      description: "Nos parkings sont surveillés 24h/24 avec des systèmes de sécurité de pointe pour votre tranquillité d'esprit."
    },
    {
      icon: TimeIcon,
      title: "Disponibilité en Temps Réel",
      description: "Consultez en temps réel le nombre de places disponibles dans chaque parking."
    },
    {
      icon: PaymentIcon,
      title: "Paiement Sécurisé",
      description: "Paiement en ligne sécurisé avec plusieurs options de paiement disponibles."
    },
    {
      icon: CarIcon,
      title: "Gestion des Véhicules",
      description: "Gérez facilement vos véhicules et vos réservations depuis votre espace personnel."
    },
    {
      icon: SupportIcon,
      title: "Support 24/7",
      description: "Une équipe de support disponible 24h/24 pour répondre à toutes vos questions."
    }
  ];

  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 },
          backgroundColor:'#6C63FF',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgb(140, 138, 232) 0%, rgb(99,96,247) 100%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Nos Services
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                opacity: 0.9
              }}
            >
              Découvrez tous les services que nous proposons pour rendre votre expérience de stationnement plus simple et plus agréable.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 4,
            mb: 6
          }}
        >
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </Box>

        {/* Call to Action Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: { xs: 4, md: 6 },
            borderRadius: 3,
            background: 'linear-gradient(45deg, #6C63FF 30%, #6C63FF 90%)',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(33, 150, 243, 0.2)'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                fontSize: { xs: '1.8rem', md: '2.5rem' }
              }}
            >
              Prêt à Commencer ?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: '1rem', md: '1.2rem' }
              }}
            >
              Rejoignez-nous dès aujourd'hui et profitez de tous nos services de stationnement.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: 'white',
                color: '#6C63FF',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              Commencer Maintenant
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Services; 