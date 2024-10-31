// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css'; // Asegúrate de tener el CSS en este archivo

function Navbar() {
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    
    <nav className="navbar">
      <div className="navbar-header">
        <button className="navbar-toggler" onClick={toggleMenu}>
          <span className="navbar-icon"></span>
          <span className="navbar-icon"></span>
          <span className="navbar-icon"></span>
        </button>
      </div>
      <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
        <li><Link to="/menu">Menú</Link></li>
        <li><Link to="/reservar">Reservar</Link></li>
        <li><Link to="/mis-reservas">Ver Mis Reservas</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/iniciar-sesion">Iniciar Sesión</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
