import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Lightbulb as VisionIcon,
  Star as ValuesIcon,
  EmojiObjects as InnovationIcon,
  Verified as QualityIcon,
  Accessibility as AccessibilityIcon
} from '@mui/icons-material';

const ValueCard = ({ icon: Icon, title, description, featured }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={0}
      sx={{
        p: featured ? 6 : 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        gridColumn: featured ? 'span 2' : 'span 1',
        gridRow: featured ? 'span 2' : 'span 1',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: '#6C63FF',
          opacity: 0.8
        },
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
        }
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
          color: '#6C63FF',
          mb: featured ? 3 : 2,
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
          fontSize: featured ? { xs: '1.1rem', md: '1.2rem' } : { xs: '1rem', md: '1.1rem' }
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const values = [
    {
      icon: InnovationIcon,
      title: "Innovation",
      description: "Nous développons constamment de nouvelles solutions pour améliorer l'expérience de stationnement.",
      featured: true
    },
    {
      icon: QualityIcon,
      title: "Qualité",
      description: "Nous nous engageons à fournir un service de haute qualité à nos utilisateurs."
    },
    {
      icon: AccessibilityIcon,
      title: "Accessibilité",
      description: "Nous rendons le stationnement accessible à tous."
    }
  ];

  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 10 },
          backgroundColor: '#6C63FF',
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
              À propos de nous
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                opacity: 0.9
              }}
            >
              Parking Manager est une solution innovante de gestion de parking qui simplifie la vie des automobilistes et des gestionnaires de parking.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 3,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            mb: 8
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <VisionIcon sx={{ fontSize: 40, color: '#6C63FF', mr: 2 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#6C63FF' }}>
              Notre Mission
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              lineHeight: 1.8,
              color: 'text.secondary'
            }}
          >
            Notre mission est de rendre le stationnement plus facile, plus efficace et plus agréable pour tous. 
            Nous aspirons à devenir la référence en matière de solutions de gestion de parking, en offrant une 
            expérience utilisateur exceptionnelle et des services de qualité.
          </Typography>
        </Paper>

        {/* Values Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <ValuesIcon sx={{ fontSize: 40, color: '#6C63FF', mr: 2 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#6C63FF' }}>
              Nos Valeurs
            </Typography>
          </Box>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 4
            }}
          >
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </Box>
        </Box>

        {/* Contact Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 3,
            backgroundColor: '#6C63FF',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              fontSize: { xs: '1.8rem', md: '2.2rem' }
            }}
          >
            Rejoignez-nous dans notre mission
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Ensemble, nous pouvons transformer l'expérience de stationnement pour tous.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default About; 