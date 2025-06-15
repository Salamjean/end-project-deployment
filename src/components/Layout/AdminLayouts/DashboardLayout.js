import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const { user: currentUser } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            pt: 8,
            px: 3,
            backgroundColor: theme.palette.background.default
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout; 