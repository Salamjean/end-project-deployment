import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { parkingService } from '../../services/api';

const EditParking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [parking, setParking] = useState({
    name: '',
    description: '',
    address: '',
    totalSpots: '',
    pricePerHour: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchParking();
  }, [id]);

  const fetchParking = async () => {
    try {
      const response = await parkingService.getById(id);
      setParking(response.data);
      if (response.data.image) {
        setPreviewImage(response.data.image);
      }
      setLoading(false);
    } catch (error) {
      setError('Erreur lors de la récupération du parking');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setParking(prev => ({
        ...prev,
        image: file
      }));
      setPreviewImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', parking.name);
      formData.append('description', parking.description);
      formData.append('address', parking.address);
      formData.append('totalSpots', parking.totalSpots);
      formData.append('pricePerHour', parking.pricePerHour);
      if (parking.image instanceof File) {
        formData.append('image', parking.image);
      }

      await parkingService.update(id, formData);
      setSuccess('Parking modifié avec succès');
      setTimeout(() => {
        navigate('/dashboard/parkings');
      }, 2000);
    } catch (error) {
      setError('Erreur lors de la modification du parking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Modifier le Parking
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du parking"
                name="name"
                value={parking.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={parking.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="address"
                value={parking.address}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre total de places"
                name="totalSpots"
                type="number"
                value={parking.totalSpots}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix par heure (FCFA)"
                name="pricePerHour"
                type="number"
                value={parking.pricePerHour}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                {previewImage && (
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={previewImage ? URL.createObjectURL(previewImage) : `http://localhost:5000/uploads/${parking.image}`} 
                      alt="Aperçu" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Changer l'image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/parkings')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Modification...' : 'Modifier le parking'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditParking; 