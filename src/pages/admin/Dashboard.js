import React, { useState, useEffect } from 'react';
import { 
  People, 
  LocalParking, 
  EventAvailable, 
  AttachMoney,
  ArrowUpward,
  Warning,
  CheckCircle,
  Schedule,
  Refresh
} from '@mui/icons-material';
import { dashboardService } from '../../services/api';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    clients: 0,
    parkings: 0,
    reservations: 0,
    revenue: 0,
    pending: 0,
    confirmed: 0,
    recentActivities: [],
    statusStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats({
        ...data,
        statusStats: [
          { label: 'Confirmées', value: data.confirmed, color: 'success' },
          { label: 'En attente', value: data.pending, color: 'warning' },
          { label: 'Annulées', value: data.cancelled || 0, color: 'error' }
        ]
      });
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
        <button onClick={fetchStats} className="retry-button">
          <Refresh /> Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Tableau de bord</h1>
          <div className="dashboard-actions">
            <button onClick={fetchStats} className="refresh-button">
              <Refresh /> Actualiser
            </button>
          </div>
        </header>

        {/* Statistiques principales */}
        <div className="stats-grid">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Clients</h3>
              <div className="card-icon">
                <People />
              </div>
            </div>
            <div className="card-value">{stats.clients}</div>
          </div>

          <div className="card card-secondary">
            <div className="card-header">
              <h3 className="card-title">Parkings</h3>
              <div className="card-icon">
                <LocalParking />
              </div>
            </div>
            <div className="card-value">{stats.parkings}</div>
          </div>

          <div className="card card-success">
            <div className="card-header">
              <h3 className="card-title">Réservations</h3>
              <div className="card-icon">
                <EventAvailable />
              </div>
            </div>
            <div className="card-value">{stats.reservations}</div>
          </div>

          <div className="card card-warning">
            <div className="card-header">
              <h3 className="card-title">Revenus</h3>
              <div className="card-icon">
                <AttachMoney />
              </div>
            </div>
            <div className="card-value">{formatCurrency(stats.revenue)}</div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="content-grid">
          {/* Activités récentes */}
          <div className="card activity-card">
            <div className="card-header">
              <h3 className="card-title">Activités récentes</h3>
            </div>
            <ul className="activity-list">
              {stats.recentActivities.map(activity => (
                <li key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.status === 'confirmed' 
                      ? <CheckCircle color="success" /> 
                      : <Warning color="warning" />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-date">
                      {new Date(activity.date).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Statut des réservations */}
          <div className="card status-card">
            <div className="card-header">
              <h3 className="card-title">Statut des réservations</h3>
            </div>
            <div className="card-value">{stats.reservations}</div>
            <div className="card-footer">Total réservations</div>
            
            <div style={{ marginTop: '2rem' }}>
              {stats.statusStats.map((stat, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      <span className={`status-indicator status-${stat.color}`} />
                      {stat.label}
                    </span>
                    <span>{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;