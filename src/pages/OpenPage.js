import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/OpenPage.css'; // Assurez-vous que le chemin est correct

const OpenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="open-page-container">
      <h1 className="open-page-title">Bienvenue</h1>
        <p className="open-page-description ">
            Vous êtes un client ou un administrateur ? <br></br> Choisissez une option pour continuer.
        </p>
      <button
        className="open-page-btn"
        onClick={() => navigate('/home')}
      >
        Client
      </button>
      <button
        className="open-page-btn"
        onClick={() => navigate('/login')}
      >
        Admin
      </button>
    </div>
  );
};

export default OpenPage;