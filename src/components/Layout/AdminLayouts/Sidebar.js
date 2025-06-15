import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
  Divider,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalParking as ParkingIcon,
  People as PeopleIcon,
  EventNote as ReservationIcon,
  ExpandLess,
  ExpandMore,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

const drawerWidth = 240;

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [reservationsOpen, setReservationsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleReservationsClick = () => {
    setReservationsOpen(!reservationsOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Tableau de Bord',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: 'Parkings',
      icon: <ParkingIcon />,
      path: '/dashboard/parkings'
    },
    {
      text: 'Clients',
      icon: <PeopleIcon />,
      path: '/dashboard/clients'
    }
  ];

  const reservationItems = [
    {
      text: 'En Attente',
      path: '/dashboard/reservations/pending'
    },
    {
      text: 'Confirmées',
      path: '/dashboard/reservations/confirmed'
    },
    {
      text: 'Annulées',
      path: '/dashboard/reservations/cancelled'
    }
  ];

  const drawer = (
    <>
      <Box className="sidebar-header">
        <Typography variant="h6" className="sidebar-title">
          Admin Dashboard
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              className={`sidebar-menu-item ${location.pathname === item.path ? 'selected' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <ListItemButton onClick={handleReservationsClick} className="sidebar-menu-item">
            <ListItemIcon>
              <ReservationIcon />
            </ListItemIcon>
            <ListItemText primary="Réservations" />
            {reservationsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={reservationsOpen} timeout="auto" unmountOnExit className="sidebar-collapse">
          <List component="div" disablePadding>
            {reservationItems.map((item) => (
              <ListItemButton
                key={item.text}
                className={`sidebar-submenu-item ${location.pathname === item.path ? 'selected' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>

      <Box className="sidebar-logout">
        <ListItemButton
          onClick={handleLogout}
          className="sidebar-logout-button"
        >
          <ListItemIcon className="sidebar-logout-icon">
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <Box component="nav" className="sidebar">
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          className="sidebar-drawer"
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          className="sidebar-drawer"
          open
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar; 