import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Ajoutez ceci pour le déploiement
const PORT = process.env.PORT || 3000;
console.log(`Application prête sur le port ${PORT}`); // Vérification dans les logs


