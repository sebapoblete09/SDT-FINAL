import React, { useState } from 'react';
import '../styles/reserva.css';

function ReservCard({ Reserva }) { 
  const [currentPage, setCurrentPage] = useState(0); // Controla la página actual
  const itemsPerPage = 3; // Número de elementos por página

  if (!Array.isArray(Reserva)) {
    return <p>No hay datos disponibles.</p>;
  }

  // Calcular el índice de inicio y final para las reservas actuales
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = Reserva.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < Reserva.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main className='reservation-dish'>
      <h2>Platos reservados:</h2>
      {Reserva.length >0 ? (
        <>
        {currentItems.map((plato, index) => (
        <div key={index} className="reservation-info">
          <p><strong>{plato.Nombre}</strong></p>
          <p><strong>Descripción:</strong> {plato.Descripcion}</p>
          <p><strong>Tipo:</strong> {plato.Tipo}</p>
          <p><strong>Cantidad:</strong> {plato.cantidad}</p>
          <p><strong>Precio total:</strong> {plato.precio}</p>
          <hr />
          <br />
        </div>
        ))}
        <div className="pagination-buttons">
          <button onClick={handlePrevious} disabled={currentPage === 0}>
            Anterior
          </button>
          <button onClick={handleNext} disabled={endIndex >= Reserva.length}>
            Siguiente
          </button>
      </div>
        </>
      ):(
        <>
        <div>No se seleccionaron platos para esta reserva</div>
        </>
      )}
      

      
    </main>
  );
}

export default ReservCard;
