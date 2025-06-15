import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import axios from 'axios';
import './styles/Clients.css';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non authentifié');
        return;
      }

      const response = await axios.get('https://end-projet-backend-3.onrender.com/api/clients', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setClients(response.data.clients);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      setError('Erreur lors de la récupération des clients');
    } finally {
      setLoading(false);
    }
  };

 const handleDelete = async (clientId) => {
  try {
    setError(''); // Réinitialiser les erreurs précédentes
    setSuccess(''); // Réinitialiser les succès précédents
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Non authentifié');
      return;
    }

    console.log('Tentative de suppression du client:', clientId); // Log pour déboguer

    const response = await axios.delete(
      `https://end-projet-backend-3.onrender.com/api/clients/${clientId}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    console.log('Réponse du serveur:', response.data); // Log pour déboguer

    if (response.data.success) {
      setSuccess(response.data.message || 'Client supprimé avec succès');
    } else {
      setError(response.data.message || 'Erreur lors de la suppression');
    }
  } catch (error) {
    console.error('Détails complets de l\'erreur:', error);
    console.error('Réponse du serveur:', error.response?.data);
    console.error('Statut de l\'erreur:', error.response?.status);
    
    let errorMessage = 'Erreur lors de la suppression du client';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status === 401) {
      errorMessage = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Client non trouvé.';
    } else if (error.response?.status === 403) {
      errorMessage = 'Vous n\'avez pas les droits pour supprimer ce client.';
    }
    
    setError(errorMessage);
  } finally {
    setDeleteDialogOpen(false); // Fermer la boîte de dialogue dans tous les cas
    fetchClients(); // Rafraîchir la liste dans tous les cas
  }
};
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePrintReceipt = () => {
    const printContent = document.getElementById('receipt-content');
    const originalContents = document.body.innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu de réservation - ${selectedClient.name}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
              margin: 0;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .section { 
              margin-bottom: 20px;
              padding: 10px;
            }
            .section h2 {
              color: #6C63FF;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            .total { 
              font-size: 1.2em; 
              font-weight: bold; 
              margin-top: 20px;
              padding: 15px;
              background-color: #f5f5f5;
              border-radius: 5px;
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              font-size: 0.8em;
              border-top: 1px solid #ccc;
              padding-top: 20px;
            }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #6C63FF; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Imprimer le reçu
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className="clients-container" maxWidth="lg">
      <Paper className="clients-paper">
        <Box className="clients-header">
          <Typography className="clients-title" variant="h4" component="h1">
            Liste des Clients
          </Typography>
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/clients/add')}
          >
            Ajouter un client
          </Button>
        </Box>

        {error && (
          <Alert className="alert" severity="error">
            {error}
          </Alert>
        )}

        {success && (
          <Alert className="alert" severity="success">
            {success}
          </Alert>
        )}

        <TableContainer>
          <Table className="clients-table">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Véhicule</TableCell>
                <TableCell>Parking</TableCell>
                <TableCell>Réservation</TableCell>
                <TableCell>Prix Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    {client.vehicleModel && (
                      <>
                        {client.vehicleModel}
                        {client.vehiclePlate && ` (${client.vehiclePlate})`}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {client.parking ? client.parking.name : 'Non spécifié'}
                  </TableCell>
                  <TableCell>
                    {client.startDate && (
                      <Chip
                        className="reservation-chip"
                        label={`${formatDate(client.startDate)} - ${formatDate(client.endDate)}`}
                        color="primary"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {client.totalPrice ? formatPrice(client.totalPrice) : 'Non spécifié'}
                  </TableCell>
                  <TableCell>
                    <Box className="action-buttons">
                      <Tooltip title="Voir les détails">
                        <IconButton
                          className="action-button"
                          color="primary"
                          onClick={() => {
                            setSelectedClient(client);
                            setViewDialogOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          className="action-button"
                          color="primary"
                          onClick={() => navigate(`/admin/clients/edit/${client._id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Imprimer le reçu">
                        <IconButton
                          className="action-button"
                          color="primary"
                          onClick={() => {
                            setSelectedClient(client);
                            setReceiptDialogOpen(true);
                          }}
                        >
                          <PrintIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          className="action-button"
                          color="error"
                          onClick={() => {
                            setSelectedClient(client);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog pour voir les détails du client */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedClient && (
          <>
            <DialogTitle className="dialog-title">Détails du Client</DialogTitle>
            <DialogContent className="dialog-content">
              <Box className="dialog-section">
                <Typography className="dialog-section-title" variant="h6">Informations Personnelles</Typography>
                <Typography><strong>Nom:</strong> {selectedClient.name}</Typography>
                <Typography><strong>Email:</strong> {selectedClient.email}</Typography>
                <Typography><strong>Téléphone:</strong> {selectedClient.phone}</Typography>
              </Box>

              <Box className="dialog-section">
                <Typography className="dialog-section-title" variant="h6">Informations du Véhicule</Typography>
                <Typography><strong>Modèle:</strong> {selectedClient.vehicleModel || 'Non spécifié'}</Typography>
                <Typography><strong>Plaque:</strong> {selectedClient.vehiclePlate || 'Non spécifiée'}</Typography>
              </Box>

              <Box className="dialog-section">
                <Typography className="dialog-section-title" variant="h6">Informations de Réservation</Typography>
                <Typography><strong>Parking:</strong> {selectedClient.parking ? selectedClient.parking.name : 'Non spécifié'}</Typography>
                <Typography><strong>Date de début:</strong> {formatDate(selectedClient.startDate)}</Typography>
                <Typography><strong>Date de fin:</strong> {formatDate(selectedClient.endDate)}</Typography>
                <Typography><strong>Durée:</strong> {selectedClient.duration} heures</Typography>
                <Typography><strong>Prix total:</strong> {formatPrice(selectedClient.totalPrice)}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle className="dialog-title">Confirmer la suppression</DialogTitle>
        <DialogContent className="dialog-content">
          <Typography>
            Êtes-vous sûr de vouloir supprimer le client {selectedClient?.name} ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={() => {
              if (selectedClient && selectedClient._id) {
                handleDelete(selectedClient._id);
              } else {
                setError('Impossible de supprimer le client : ID manquant');
                setDeleteDialogOpen(false);
              }
            }}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour le reçu */}
      <Dialog
        open={receiptDialogOpen}
        onClose={() => setReceiptDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Reçu de Réservation</Typography>
            <Button
              className="add-button"
              variant="contained"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={handlePrintReceipt}
            >
              Imprimer
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent className="dialog-content">
          {selectedClient && (
            <Box id="receipt-content" className="receipt-content">
              <Box className="receipt-header">
                <Typography variant="h4" gutterBottom>
                  Reçu de Réservation
                </Typography>
                <Typography>
                  Date: {new Date().toLocaleDateString('fr-FR')}
                </Typography>
              </Box>

              <Box className="receipt-section">
                <Typography variant="h6" gutterBottom>Informations Client</Typography>
                <Typography><strong>Nom:</strong> {selectedClient.name}</Typography>
                <Typography><strong>Email:</strong> {selectedClient.email}</Typography>
                <Typography><strong>Téléphone:</strong> {selectedClient.phone}</Typography>
              </Box>

              <Box className="receipt-section">
                <Typography variant="h6" gutterBottom>Informations Véhicule</Typography>
                <Typography><strong>Modèle:</strong> {selectedClient.vehicleModel || 'Non spécifié'}</Typography>
                <Typography><strong>Plaque:</strong> {selectedClient.vehiclePlate || 'Non spécifiée'}</Typography>
              </Box>

              <Box className="receipt-section">
                <Typography variant="h6" gutterBottom>Détails de la Réservation</Typography>
                <Typography><strong>Parking:</strong> {selectedClient.parking ? selectedClient.parking.name : 'Non spécifié'}</Typography>
                <Typography><strong>Date de début:</strong> {formatDate(selectedClient.startDate)}</Typography>
                <Typography><strong>Date de fin:</strong> {formatDate(selectedClient.endDate)}</Typography>
                <Typography><strong>Durée:</strong> {selectedClient.duration} heures</Typography>
              </Box>

              <Box className="receipt-total">
                <Typography variant="h6">Prix Total: {formatPrice(selectedClient.totalPrice)}</Typography>
              </Box>

              <Box className="receipt-footer">
                <Typography>Merci de votre confiance</Typography>
                <Typography>Ce reçu est une preuve de votre réservation</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Clients; 