import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc,doc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseconfig';
import '../styles/reserva.css';
import emailjs from 'emailjs-com';
import ReservCard from './reservCard';

function VerReservasAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reservasPorPagina = 4;
  const [showModal, setShowModal] = useState(false);
  const [reservaAct, setReservAct] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const q = query(collection(db, "reservas"));
        const querySnapshot = await getDocs(q);
        
        // Mapear y ordenar las reservas de más recientes a más antiguas
        const userReservas = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setReservas(userReservas);
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

  // Filtrar reservas por código
  const filteredReservas = reservas.filter(reserva =>
    reserva.codigoReserva.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextPage = () => {
    if (currentIndex + reservasPorPagina < filteredReservas.length) {
      setCurrentIndex(currentIndex + reservasPorPagina);
    }
  };

  const prevPage = () => {
    if (currentIndex - reservasPorPagina >= 0) {
      setCurrentIndex(currentIndex - reservasPorPagina);
    }
  };

  const totalPages = Math.ceil(filteredReservas.length / reservasPorPagina);
  const currentPage = Math.floor(currentIndex / reservasPorPagina) + 1;

  const openModal = (reserva) => {
    setReservAct(reserva);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCancel = async (id) => {
    const confirmarCancelacion = window.confirm("¿Estás seguro de que deseas cancelar esta reserva?");

  if (!confirmarCancelacion) {
    return; // Si el usuario cancela, no se ejecuta el código siguiente
  }
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

  return (
    <main className="reservation-list">
      {isAuthenticated ? (
        <div>
          <h1>Reservas</h1>
          
          {/* Campo de búsqueda */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por código de reserva"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredReservas.length > 0 ? (
            <>
              {filteredReservas.slice(currentIndex, currentIndex + reservasPorPagina).map(reserva => (
                <div key={reserva.id} className="reservation-item">
                  <div className="reservation-info">
                    <p><strong>{reserva.codigoReserva}</strong></p> 
                    <p><strong>Cliente:</strong> {reserva.nombre }</p>
                    <p><strong>Correo:</strong> {reserva.correo}</p>
                    <p><strong>Fecha:</strong> {reserva.fecha}</p>
                    <p><strong>Horario:</strong> {reserva.horario}</p>
                  </div>
                  <div className="reservation-info">
                    <p><strong>Mesa:</strong> {reserva.mesa}</p>
                    <p><strong>Grupo:</strong> {reserva.grupo} personas</p>
                  </div>
                  <div className="reservation-info">
                    <p><strong>Estado:</strong> {reserva.estado}</p>
                    <button className='delete-button' onClick={() => openModal(reserva.platos)}>Ver Más</button>
                    {reserva.estado !== "cancelada" && (
                      <div className='Button-container'>
                        <button className="delete-button" onClick={() => handleCancel(reserva.id)}>
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="pagination-buttons">
                {currentIndex > 0 && (
                  <button onClick={prevPage}>Ver Anteriores</button>
                )}
                {currentIndex + reservasPorPagina < filteredReservas.length && (
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
            <ReservCard Reserva={reservaAct} />
            <div className='btn-volver'>
              <button onClick={closeModal}>Volver</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default VerReservasAdmin;
