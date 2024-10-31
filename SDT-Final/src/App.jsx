import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/NavBar'; // Importa el Navbar
import Home from './Components/Home';
import About from './Components/About';
import Login from './Components/Login';
// Importa otros componentes aquí

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route path="/iniciar-sesion" element={<Login />} />
        {/* Agrega más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;
