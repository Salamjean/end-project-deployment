import axios from 'axios';
import { mockUsers } from '../mock/data';
import { parkingData } from '../mock/parkingData';

const API_URL = 'https://end-projet-backend-fin.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonction pour vérifier si l'API est disponible
const isApiAvailable = async () => {
  try {
    console.log('Vérification de la disponibilité de l\'API...');
    const response = await api.get('/health');
    console.log('Réponse de l\'API:', response.data);
    return response.status === 200;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'API:', error.message);
    return false;
  }
};

// Services d'authentification
export const authService = {
  login: async (credentials) => {
    try {
      const isAvailable = await isApiAvailable();
      if (isAvailable) {
        const response = await api.post('/auth/login', credentials);
        return response;
      } else {
        // Utiliser les données fictives si l'API n'est pas disponible
        console.log('API non disponible, utilisation des données fictives pour la connexion');
        const user = mockUsers.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password
        );
        
        if (user) {
          // Créer une réponse similaire à celle de l'API
          return {
            data: {
              token: 'mock-token-' + Date.now(),
              user: {
                id: user.id,
                email: user.email,
                role: user.role
              }
            }
          };
        } else {
          throw new Error('Email ou mot de passe incorrect');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const isAvailable = await isApiAvailable();
      if (isAvailable) {
        const response = await api.post('/auth/register', userData);
        return response;
      } else {
        // Vérifier si l'utilisateur existe déjà dans les données fictives
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          throw new Error('Cet email est déjà utilisé');
        }

        // Créer un nouvel utilisateur fictif
        const newUser = {
          id: 'mock-' + Date.now(),
          ...userData,
          role: 'user'
        };

        // Simuler une réponse réussie
        return {
          data: {
            token: 'mock-token-' + Date.now(),
            user: {
              id: newUser.id,
              email: newUser.email,
              role: newUser.role
            }
          }
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  getCurrentUser: () => api.get('/auth/me')
};

// Services de parking
export const parkingService = {
  getAll: async () => {
    try {
      console.log('Tentative de récupération des parkings depuis l\'API...');
      const response = await api.get('/parkings');
      console.log('Données reçues de l\'API:', response.data);

      // Vérifier si nous avons des données valides
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Transformer les données pour utiliser id au lieu de _id et gérer les images
        const formattedData = response.data.map(parking => ({
          ...parking,
          id: parking._id,
          image: parking.image ? `https://end-projet-backend-fin.onrender.com/uploads/${parking.image}` : '/images/default-parking.jpg',
          pricePerHour: parseFloat(parking.pricePerHour),
          totalSpots: parseInt(parking.totalSpots),
          availableSpots: parseInt(parking.availableSpots)
        }));
        console.log('Utilisation des données de la base de données:', formattedData);
        return { data: formattedData };
      }
      
      console.log('Aucune donnée dans la base, utilisation des données fictives');
      return { data: parkingData };
    } catch (error) {
      console.error('Erreur lors de la récupération des parkings:', error);
      // En cas d'erreur, on essaie quand même d'utiliser les données fictives
      return { data: parkingData };
    }
  },

  getById: async (id) => {
    try {
      console.log('Tentative de récupération du parking', id, 'depuis l\'API...');
      const response = await api.get(`/parkings/${id}`);
      console.log('Données reçues de l\'API:', response.data);

      if (response.data) {
        // Transformer les données pour utiliser id au lieu de _id et gérer les images
        const formattedData = {
          ...response.data,
          id: response.data._id,
          image: response.data.image ? response.data.image : null,
          pricePerHour: parseFloat(response.data.pricePerHour),
          totalSpots: parseInt(response.data.totalSpots),
          availableSpots: parseInt(response.data.availableSpots)
        };
        console.log('Utilisation des données de la base de données:', formattedData);
        return { data: formattedData };
      }
      
      console.log('Parking non trouvé dans la base, utilisation des données fictives');
      const parking = parkingData.find(p => p.id === id);
      return { data: parking };
    } catch (error) {
      console.error('Erreur lors de la récupération du parking:', error);
      const parking = parkingData.find(p => p.id === id);
      return { data: parking };
    }
  },

  create: async (parkingData) => {
    // Si les données sont déjà un FormData, les envoyer directement
    if (parkingData instanceof FormData) {
      return api.post('/parkings', parkingData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    
    // Sinon, créer un nouveau FormData
    const formData = new FormData();
    Object.entries(parkingData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    });
    
    return api.post('/parkings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  update: async (id, parkingData) => {
    const formData = new FormData();
    Object.keys(parkingData).forEach(key => {
      formData.append(key, parkingData[key]);
    });
    return api.put(`/parkings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/parkings/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la suppression du parking:', error);
      throw error;
    }
  }
};

// Services de réservation
export const reservationService = {
  getAll: async () => {
    try {
      const isAvailable = await isApiAvailable();
      if (isAvailable) {
        const response = await api.get('/reservations');
        return response;
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      throw error;
    }
  },

  create: async (reservationData) => {
    try {
      const isAvailable = await isApiAvailable();
      if (isAvailable) {
        const response = await api.post('/reservations', reservationData);
        return response;
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  },

  getByUser: () => api.get('/reservations/user'),
  getByParking: (parkingId) => api.get(`/reservations/parking/${parkingId}`),
  cancel: (id) => api.put(`/reservations/${id}/cancel`),
  getPending: () => api.get('/reservations/admin/pending'),
  getConfirmed: () => api.get('/reservations/admin/confirmed'),
  getCancelled: () => api.get('/reservations/admin/cancelled'),
  confirm: (id) => api.put(`/reservations/admin/${id}/confirm`),
  reject: (id) => api.put(`/reservations/admin/${id}/reject`)
};

// Services de client
export const clientService = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (clientData) => api.post('/clients', clientData),
  update: (id, clientData) => api.put(`/clients/${id}`, clientData),
  delete: (id) => api.delete(`/clients/${id}`)
};

// Services de tableau de bord
export const dashboardService = {
  getStats: async () => {
    try {
      const isAvailable = await isApiAvailable();
      if (isAvailable) {
        const response = await api.get('/dashboard/stats');
        return response.data;
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
};

export default api; 