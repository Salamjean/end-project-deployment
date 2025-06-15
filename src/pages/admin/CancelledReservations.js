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
  Box,
  Alert,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CancelledReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

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

      const response = await axios.get('https://end-project-formation-frontend.onrender.com/api/reservations/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Filtrer uniquement les réservations annulées
      const cancelledReservations = response.data.reservations.filter(
        reservation => reservation.status === 'cancelled'
      );
      
      setReservations(cancelledReservations);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des réservations');
    }
  };

  const handleDeleteClick = (reservation) => {
    setReservationToDelete(reservation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non authentifié');
        return;
      }

      await axios.delete(`https://end-project-formation-frontend.onrender.com/api/reservations/admin/${reservationToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Réservation supprimée avec succès');
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
      fetchReservations();
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la suppression de la réservation');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setReservationToDelete(null);
  };

  const formatDate = (date) => {
    if (!date) return 'Date non disponible';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Date invalide';
      }
      return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Réservations annulées
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
                  Aucune réservation annulée
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
                      color="error"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(reservation)}
                      title="Supprimer la réservation"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer définitivement cette réservation ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CancelledReservations; 