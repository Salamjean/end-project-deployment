import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';

const ContactInfo = ({ icon: Icon, title, content, featured }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 3,
        p: featured ? 4 : 3,
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        gridColumn: featured ? 'span 2' : 'span 1',
        '&:hover': {
          backgroundColor: 'rgba(33, 150, 243, 0.05)',
          transform: 'translateX(8px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '& .icon-box': {
            transform: 'scale(1.1) rotate(5deg)',
            backgroundColor: '#6C63FF',
            color: 'white',
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
          }
        }
      }}
    >
      <Box
        className="icon-box"
        sx={{
          width: featured ? (isMobile ? 60 : 70) : (isMobile ? 50 : 60),
          height: featured ? (isMobile ? 60 : 70) : (isMobile ? 50 : 60),
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#6C63FF',
          color: 'white',
          mr: 3,
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0 4px 8px rgba(33, 150, 243, 0.2)'
        }}
      >
        <Icon sx={{ fontSize: featured ? (isMobile ? 30 : 35) : (isMobile ? 24 : 30) }} />
      </Box>
      <Box>
        <Typography
          variant={featured ? "h6" : "subtitle1"}
          sx={{
            fontWeight: 'bold',
            color: '#6C63FF',
            mb: 0.5,
            fontSize: featured ? { xs: '1.1rem', md: '1.2rem' } : { xs: '1rem', md: '1.1rem' }
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ 
            fontSize: featured ? { xs: '1rem', md: '1.1rem' } : { xs: '0.9rem', md: '1rem' },
            lineHeight: 1.6
          }}
        >
          {content}
        </Typography>
      </Box>
    </Box>
  );
};

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: EmailIcon,
      title: "Email",
      content: "contact@parkingmanager.com",
      featured: true
    },
    {
      icon: PhoneIcon,
      title: "Téléphone",
      content: "+33 1 23 45 67 89"
    },
    {
      icon: LocationIcon,
      title: "Adresse",
      content: "123 Rue du Parking, 75000 Paris"
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
              Contactez-nous
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                opacity: 0.9
              }}
            >
              Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
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
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  color: '#6C63FF',
                  mb: 4,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                Informations de contact
              </Typography>
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)'
                  },
                  gap: 3
                }}
              >
                {contactInfo.map((info, index) => (
                  <ContactInfo key={index} {...info} />
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
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
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  color: '#6C63FF',
                  mb: 4,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                Envoyez-nous un message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nom"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover fieldset': {
                            borderColor: '#6C63FF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6C63FF',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'text.secondary'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover fieldset': {
                            borderColor: '#6C63FF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6C63FF',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'text.secondary'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Sujet"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'text.secondary'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover fieldset': {
                            borderColor: '#6C63FF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6C63FF',
                            borderWidth: 2
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: 'text.secondary'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<SendIcon />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        background: 'linear-gradient(to bottom, rgb(140, 138, 232) 0%, rgb(99,96,247) 100%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 10px 4px rgba(33, 150, 243, .3)'
                        },
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      Envoyer le message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact; 