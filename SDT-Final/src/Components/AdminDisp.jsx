import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseconfig';
import '../styles/AdminDips.css';

function AdminDisponibilidad() {
  const [fecha, setFecha] = useState('');
  const [mesasAdicionales, setMesasAdicionales] = useState([]);
  const [cantidadMesas, setCantidadMesas] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const mesasPredeterminadas = [1, 2, 3, 4, 5, 6]; // Mesas predeterminadas

  // Función para cargar la disponibilidad (solo mesas)
  const cargarDisponibilidad = async () => {
    if (!fecha) return;
  
    const docRef = doc(db, 'disponibilidad', fecha);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Cargar las mesas adicionales desde la base de datos
        setMesasAdicionales(data.mesasAdicionales || []);
      } else {
        // Si no hay datos, usar las mesas predeterminadas
        setMesasAdicionales([]);
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad: ", error);
    }
  };

  // useEffect para cargar disponibilidad cuando cambia la fecha
  useEffect(() => {
    cargarDisponibilidad();
  }, [fecha]);

  // Función para guardar la disponibilidad en Firebase
  const guardarDisponibilidad = async () => {
    if (!fecha) {
      alert("Seleccione una fecha");
      return;
    }

    const docRef = doc(db, 'disponibilidad', fecha);
    try {
      await setDoc(docRef, {
        mesasAdicionales, // Guardar solo las mesas adicionales
      }, { merge: true }); // Combina con los datos existentes
      alert('Disponibilidad actualizada');
    } catch (error) {
      console.error("Error al guardar disponibilidad: ", error);
      alert("Hubo un error al guardar la disponibilidad.");
    }
  };

  // Función para agregar nuevas mesas
  const handleAgregarMesas = () => {
    const cantidad = parseInt(cantidadMesas);
    if (!cantidad || cantidad <= 0) return;

    // Verificar si al agregar las nuevas mesas no superamos el límite de 9 mesas
    const totalMesas = mesasPredeterminadas.length + mesasAdicionales.length + cantidad;
    if (totalMesas > 9) {
      alert("El total de mesas no puede superar las 9.");
      return;
    }

    const nuevasMesas = [];
    for (let i = 1; i <= cantidad; i++) {
      const nuevaMesa = mesasPredeterminadas.length + mesasAdicionales.length + i;
      nuevasMesas.push(nuevaMesa);
    }

    setMesasAdicionales([...mesasAdicionales, ...nuevasMesas]);
    setCantidadMesas('');
  };

  // Función para eliminar mesas
  const handleEliminarMesa = (mesa) => {
    setMesasAdicionales((prevMesas) => {
      return prevMesas.filter((item) => item !== mesa);
    });
  };

  return (
    <section className='disponibilidad'>
      <h1>Gestionar Disponibilidad</h1>
      <div className='fecha-dips'>
        <label>
          Fecha:
          <input
            type="date"
            value={fecha}
            min={today}
            onChange={(e) => setFecha(e.target.value)}
          />
        </label>
      </div>

      {/* Gestión de Mesas */}
      <div className='gestion-mesas'>
        <h3>Gestionar Mesas</h3>
        <div>
          <h4>Agregar Mesas</h4>
          <input
            type="number"
            value={cantidadMesas}
            min={1}
            max={3}
            placeholder="Cantidad de mesas"
            onChange={(e) => setCantidadMesas(e.target.value)}
          />
          <button onClick={handleAgregarMesas}>Agregar Mesas</button>
        </div>

        <h4>Eliminar Mesas</h4>
        <ul>
          {[...mesasPredeterminadas, ...mesasAdicionales].map((mesa) => (
            <li key={mesa}>
              Mesa {mesa}
              <button onClick={() => handleEliminarMesa(mesa)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button onClick={guardarDisponibilidad}>Guardar Disponibilidad</button>
      </div>
    </section>
  );
}

export default AdminDisponibilidad;
