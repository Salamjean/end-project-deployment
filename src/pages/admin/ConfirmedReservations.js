import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Box,
  Alert,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ConfirmedReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

      const response = await axios.get('https://end-projet-backend-3.onrender.com/api/reservations/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filtrer uniquement les réservations confirmées
      const confirmedReservations = response.data.reservations.filter(
        reservation => reservation.status === 'confirmed'
      );
      
      setReservations(confirmedReservations);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des réservations');
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non authentifié');
        return;
      }

      await axios.put(
        `https://end-projet-backend-3.onrender.com/api/reservations/admin/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSuccess('Réservation annulée avec succès');
      fetchReservations();
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de l\'annulation de la réservation');
    }
  };

  const handleRegisterClient = (reservation) => {
    // Stocker les informations de la réservation dans le localStorage
    const clientData = {
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      vehicleModel: reservation.vehicleModel,
      vehiclePlate: reservation.vehiclePlate,
      parkingId: reservation.parking._id,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      duration: reservation.duration,
      totalPrice: reservation.totalPrice
    };
    
    localStorage.setItem('pendingClientData', JSON.stringify(clientData));
    navigate('/admin/clients/add');
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Réservations confirmées
        </Typography>
      </Box>

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
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucune réservation confirmée
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((reservation) => (
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
                      <Tooltip title="Enregistrer le client">
                        <IconButton
                          color="primary"
                          onClick={() => handleRegisterClient(reservation)}
                        >
                          <PersonAddIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Annuler la réservation">
                        <IconButton
                          color="error"
                          onClick={() => handleCancel(reservation._id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ConfirmedReservations; 