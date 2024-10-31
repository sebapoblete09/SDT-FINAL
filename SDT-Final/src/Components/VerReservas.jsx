import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';
import '../styles/reserva.css';

function VerReservas() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reservasPorPagina = 4;

  useEffect(() => {
    const fetchReservas = async (uid) => {
      try {
        const q = query(collection(db, "reservas"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        
        // Mapear y ordenar las reservas de más recientes a más antiguas
        const userReservas = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar por fecha

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

  const handleCancel = async (id) => {
    try {
      const reservaRef = doc(db, "reservas", id);
      await updateDoc(reservaRef, { estado: "cancelada" });
      setReservas(reservas.map(reserva => 
        reserva.id === id ? { ...reserva, estado: "cancelada" } : reserva
      ));
      alert("Reserva cancelada exitosamente.");
    } catch (error) {
      console.error("Error al cancelar la reserva: ", error);
      alert("Hubo un problema al cancelar la reserva.");
    }
  };

  const nextPage = () => {
    if (currentIndex + reservasPorPagina < reservas.length) {
      setCurrentIndex(currentIndex + reservasPorPagina);
    }
  };

  const prevPage = () => {
    if (currentIndex - reservasPorPagina >= 0) {
      setCurrentIndex(currentIndex - reservasPorPagina);
    }
  };

  const totalPages = Math.ceil(reservas.length / reservasPorPagina);
  const currentPage = Math.floor(currentIndex / reservasPorPagina) + 1;

  return (
    <main className="reservation-list">
      {isAuthenticated ? (
        <div>
          <h1>Mis Reservas</h1>
          {reservas.length > 0 ? (
            <>
              {reservas.slice(currentIndex, currentIndex + reservasPorPagina).map(reserva => (
                <div key={reserva.id} className="reservation-item">
                  <div className="reservation-info">
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
                  </div>
                </div>
              ))}
              <div className="pagination-buttons">
                {currentIndex > 0 && (
                  <button onClick={prevPage}>Ver Anteriores</button>
                )}
                {currentIndex + reservasPorPagina < reservas.length && (
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
    </main>
  );
}

export default VerReservas;
