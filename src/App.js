import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomeLayout from './components/Layout/HomeLayout';
import DashboardLayout from './components/Layout/AdminLayouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/admin/Auth/Login';
import Register from './pages/admin/Auth/Register';
import Dashboard from './pages/admin/Dashboard';
import Parkings from './pages/admin/Parkings';
import EditParking from './pages/admin/EditParking';
import ClientParkings from './pages/ClientParkings';
import AddParking from './pages/admin/AddParking';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import ParkingDetails from './pages/ParkingDetails';
import Reservation from './pages/Reservation';
import Clients from './pages/admin/Clients';
import AddClient from './pages/admin/AddClient';
import PendingReservations from './pages/admin/PendingReservations';
import ConfirmedReservations from './pages/admin/ConfirmedReservations';
import CancelledReservations from './pages/admin/CancelledReservations';
import OpenPage from './pages/OpenPage';
import Navbar from './components/Layout/AdminLayouts/Navbar';

// Thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Composant pour protéger les routes admin
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();
  // Masquer la navbar uniquement sur la page d'accueil "/"
  const hideNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={
          <HomeLayout>
            <OpenPage />
          </HomeLayout>
        } />
        <Route path="/home" element={
          <HomeLayout>
            <Home />
          </HomeLayout>
        } />
        <Route path="/parkings" element={
          <HomeLayout>
            <ClientParkings />
          </HomeLayout>
        } />
        <Route path="/services" element={
          <HomeLayout>
            <Services />
          </HomeLayout>
        } />
        <Route path="/about" element={
          <HomeLayout>
            <About />
          </HomeLayout>
        } />
        <Route path="/contact" element={
          <HomeLayout>
            <Contact />
          </HomeLayout>
        } />
        <Route path="/parking/:id" element={
          <HomeLayout>
            <ParkingDetails />
          </HomeLayout>
        } />
        <Route path="/reservation/:id" element={
          <HomeLayout>
            <Reservation />
          </HomeLayout>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="parkings" element={<Parkings />} />
                  <Route path="parkings/add" element={<AddParking />} />
                  <Route path="parkings/edit/:id" element={<EditParking />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/add" element={<AddClient />} />
                  <Route path="clients/edit/:id" element={<AddClient />} />
                  <Route path="reservations/pending" element={<PendingReservations />} />
                  <Route path="reservations/confirmed" element={<ConfirmedReservations />} />
                  <Route path="reservations/cancelled" element={<CancelledReservations />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* Routes protégées admin */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/add" element={<AddClient />} />
                  <Route path="clients/edit/:id" element={<AddClient />} />
                  <Route path="reservations/pending" element={<PendingReservations />} />
                  <Route path="reservations/confirmed" element={<ConfirmedReservations />} />
                  <Route path="reservations/cancelled" element={<CancelledReservations />} />
                  <Route path="parkings" element={<Parkings />} />
                  <Route path="parkings/add" element={<AddParking />} />
                  <Route path="parkings/edit/:id" element={<AddParking />} />
                  <Route path="*" element={<Navigate to="/admin" />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;