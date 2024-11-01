// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate,  } from 'react-router-dom';
import '../styles/navbar.css'; // Asegúrate de tener el CSS en este archivo

function Navbar() {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const Navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token'); // Elimina el token de localStorage
        localStorage.removeItem('uid'); // Elimina el token de localStorage
        setIsAuthenticated(false); 
        Navigate('/');
        window.location.reload();         // Actualiza el estado de autenticación
    };
    
    useEffect(() => {
        // Función para verificar si hay un token en localStorage
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
            
        };

        // Verifica el estado de autenticación al montar el componente
        checkAuthStatus();

        // Listener para detectar cambios en localStorage
        window.addEventListener('storage', checkAuthStatus);

        // Limpia el listener al desmontar el componente
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {isAuthenticated ? (
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
            <li><button onClick={logout}>Cerrar Sesión</button></li>
          </ul>
        </nav>
      ):(
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
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/iniciar-sesion">Iniciar Sesión</Link></li>
        </ul>
      </nav>
      )}
    </div>
    
  );
}

export default Navbar;
