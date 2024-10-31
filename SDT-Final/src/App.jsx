import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/NavBar'; // Importa el Navbar
import Home from './Components/Home';
import About from './Components/About';
import Menu from './Components/Menu';
import Reserva from './Components/Reserva';
import VerReservas from './Components/VerReservas';
import Login from './Components/Login';
// Importa otros componentes aquí

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservar" element={<Reserva />} />
        <Route path='/mis-reservas' element={<VerReservas/>}/>
        <Route path="/iniciar-sesion" element={<Login />} />
        {/* Agrega más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;
