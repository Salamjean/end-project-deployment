import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import Sidebar from './Sidebar';
import { useAuth } from '../../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f5f7fa', margin: '0' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#6C63FF' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard Admin
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircle />
            <Typography variant="body1">
              Admin
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          mt: '64px' // Hauteur de la navbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 