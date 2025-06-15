import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert,
  Chip
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const PendingReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non authentifié');
        return;
      }

      const response = await axios.get('https://end-projet-backend-3.onrender.com/api/reservations/admin/pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des réservations');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non authentifié');
        return;
      }

      await axios.put(
        `https://end-projet-backend-3.onrender.com/api/reservations/admin/${id}/${newStatus === 'confirmed' ? 'confirm' : 'reject'}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(`Réservation ${newStatus === 'confirmed' ? 'confirmée' : 'annulée'} avec succès`);
      
      // Si la réservation est confirmée, rediriger vers la page des réservations confirmées
      if (newStatus === 'confirmed') {
        setTimeout(() => {
          navigate('/dashboard/reservations/confirmed');
        }, 1500); // Attendre 1.5 secondes pour que l'utilisateur voie le message de succès
      } else {
        // Si la réservation est annulée, rafraîchir la liste
        fetchReservations();
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Réservations en attente
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Parking</TableCell>
              <TableCell>Véhicule</TableCell>
              <TableCell>Période</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation._id}>
                <TableCell>
                  {reservation.name}
                  <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {reservation.email}
                    <br />
                    {reservation.phone}
                  </Box>
                </TableCell>
                <TableCell>
                  {reservation.parking?.name}
                  <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {reservation.parking?.address}
                  </Box>
                </TableCell>
                <TableCell>
                  {reservation.vehicleModel}
                  <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {reservation.vehiclePlate}
                  </Box>
                </TableCell>
                <TableCell>
                  Du {formatDate(reservation.startDate)}
                  <br />
                  Au {formatDate(reservation.endDate)}
                  <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    Durée: {reservation.duration} heures
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${reservation.totalPrice} FCFA`}
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleStatusUpdate(reservation._id, 'confirmed')}
                    >
                      Confirmer
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleStatusUpdate(reservation._id, 'cancelled')}
                    >
                      Annuler
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PendingReservations; 