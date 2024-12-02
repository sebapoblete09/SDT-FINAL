import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseconfig';
import emailjs from 'emailjs-com';
import ReservCard from './reservCard';
import '../styles/reserva.css';

function VerReservas() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reservasPorPagina = 4;
  const [platos, setPlatos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaAct, setReservAct] = useState([]);
  const [codigoReservaFiltro, setCodigoReservaFiltro] = useState(""); // Estado para el filtro por código de reserva
  const [precio, setPrecio] = useState()

  useEffect(() => {
    const fetchReservas = async (uid) => {
      try {
        const q = query(collection(db, "reservas"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        
        // Mapear y ordenar las reservas de más recientes a más antiguas
        const userReservas = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Ordenar por fecha
        setReservas(userReservas);
        setPlatos(userReservas.platos);
      } catch (error) {
        console.error("Error al obtener las reservas: ", error);
      }
    };

    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');

    if (token && uid) {
      setIsAuthenticated(true);
      setUsuario({ uid });
      fetchReservas(uid);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Función para manejar la búsqueda por código de reserva
  const handleFiltroCodigo = (e) => {
    setCodigoReservaFiltro(e.target.value);
  };

  // Filtrar las reservas por código de reserva
  const reservasFiltradas = reservas.filter((reserva) => 
    reserva.codigoReserva.toLowerCase().includes(codigoReservaFiltro.toLowerCase())
  );

  const handleCancel = async (id) => {
    try {
      const reservaRef = doc(db, "reservas", id);
      const reservaCancelada = reservas.find(reserva => reserva.id === id);
      await updateDoc(reservaRef, { estado: "cancelada" });
      setReservas(reservas.map(reserva => 
        reserva.id === id ? { ...reserva, estado: "cancelada" } : reserva
      ));
      alert("Reserva cancelada exitosamente.");
      
      let messagueComfirm = `Nombre: ${reservaCancelada.nombre}\nEmail: ${reservaCancelada.correo}\nTelefono: ${reservaCancelada.telefono}\nTamaño del grupo: ${reservaCancelada.grupo}\nFecha: ${reservaCancelada.fecha}\nHorario: ${reservaCancelada.horario}\nN° de mesa: ${reservaCancelada.mesa}`;
      messagueComfirm+= "\n\nLamentamos la cancelación de su reserva, esperamos que nos visite de nuevo.";

      // Configura los datos del mensaje que se envía con EmailJS
      const templateParams = {
        messague: messagueComfirm,
        subject: "Cancelación de reserva!!",
        email: reservaCancelada.correo,
      };

      // Reemplaza 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', y 'YOUR_USER_ID' con tus valores de EmailJS
      emailjs.send('service_4ie5ez4', 'template_rqpmnbl', templateParams, 'msvOlm1YjIR6h1Xs5')
        .then((response) => {
          console.log('Reserva enviada con éxito:', response.status, response.text);
        })
        .catch((error) => {
          console.error('Error al enviar el correo:', error);
          alert('Hubo un error al enviar el correo');
        });
    } catch (error) {
      console.error("Error al cancelar la reserva: ", error);
      alert("Hubo un problema al cancelar la reserva.");
    }
  };

  const nextPage = () => {
    if (currentIndex + reservasPorPagina < reservasFiltradas.length) {
      setCurrentIndex(currentIndex + reservasPorPagina);
    }
  };

  const prevPage = () => {
    if (currentIndex - reservasPorPagina >= 0) {
      setCurrentIndex(currentIndex - reservasPorPagina);
    }
  };

  const totalPages = Math.ceil(reservasFiltradas.length / reservasPorPagina);
  const currentPage = Math.floor(currentIndex / reservasPorPagina) + 1;

  const openModal = (reserva,precioInicial) => {
    setReservAct(reserva); // Establecer la reserva seleccionada
    setPrecio(precioInicial)
    console.log(reserva);
    setShowModal(true); // Abrir el modal
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <main className="reservation-list">
      {isAuthenticated ? (
        <div>
          <h1>Mis Reservas</h1>

          {/* Campo de búsqueda */}
          <div>
            <label htmlFor="codigoReserva">Buscar por código de reserva: </label>
            <input 
              id="codigoReserva"
              type="text"
              value={codigoReservaFiltro}
              onChange={handleFiltroCodigo}
              placeholder="Ingrese el código de reserva"
            />
          </div>

          {reservasFiltradas.length > 0 ? (
            <>
              {reservasFiltradas.slice(currentIndex, currentIndex + reservasPorPagina).map(reserva => (
                <div key={reserva.id} className="reservation-item">
                  <div className="reservation-info">
                    <p><strong>{reserva.codigoReserva}</strong></p>
                    <p><strong>Fecha:</strong> {reserva.fecha}</p>
                    <p><strong>Horario:</strong> {reserva.horario}</p>
                  </div>
                  <div className="reservation-info">
                    <p><strong>Mesa:</strong> {reserva.mesa}</p>
                    <p><strong>Grupo:</strong> {reserva.grupo} personas</p>
                  </div>
                  <div className="reservation-info">
                    <p><strong>Estado:</strong> {reserva.estado}</p>
                    {reserva.estado !== "cancelada" && (
                      <div className='Button-container'>
                        <button className="delete-button" onClick={() => handleCancel(reserva.id)}>
                          Cancelar
                        </button>
                      </div>
                    )}
                    <button className='delete-button' onClick={() => openModal(reserva.platos,reserva.precioInicial)}>Ver Más.</button>
                  </div>
                </div>
              ))}
              <div className="pagination-buttons">
                {currentIndex > 0 && (
                  <button onClick={prevPage}>Ver Anteriores</button>
                )}
                {currentIndex + reservasPorPagina < reservasFiltradas.length && (
                  <button onClick={nextPage}>Ver Siguientes</button>
                )}
              </div>
              <div className="page-info">
                <p>Página {currentPage} de {totalPages}</p>
              </div>
            </>
          ) : (
            <p>No tienes reservas aún.</p>
          )}
        </div>
      ) : (
        <p>Por favor, inicia sesión para ver tus reservas.</p>
      )}

      {showModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <ReservCard Reserva={reservaAct} precioInicial = {precio} />
            <div className='btn-volver'>
              <button onClick={closeModal}>Volver</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default VerReservas;
