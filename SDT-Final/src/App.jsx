import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/NavBar'; // Importa el Navbar
import Home from './Components/Home';
import About from './Components/About';
import Menu from './Components/Menu';
import Reserva from './Components/Reserva';
import AdminDisponibilidad from './Components/AdminDisp'
import VerReservas from './Components/VerReservas';
import VerReservasAdmin from './Components/VerReservaAdmin';
import Contact from './Components/Contact';
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
        <Route path='/ver-reservas-admin' element={<VerReservasAdmin/>}/>
        <Route path='/contacto' element={<Contact/>}/>
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path='/AdminRes' element={<AdminDisponibilidad/>}/>
        {/* Agrega más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App;
