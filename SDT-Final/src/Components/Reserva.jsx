import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDocs, serverTimestamp, where, query, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebaseconfig';
import horas from '../const/horas';
import Login from './Login';
import emailjs from 'emailjs-com';
import '../styles/reserva.css';

function Reserva() {
  const Navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: '', correo: '', telefono: '' });
  const [reserva, setReserva] = useState(true);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [grupo, setGrupo] = useState('');
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [mesasOcupadas, setMesasOcupadas] = useState([]);
  const [mesas, setMesas] = useState([]);  // Estado para las mesas
  const [horasDisponibles, setHoras] = useState(horas);  // Estado para las horas
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      if (fecha) {
        const docRef = doc(db, 'disponibilidad', fecha);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Asegurarse de que las mesas y horarios se actualicen correctamente
          const mesasAdicionales = data.mesasAdicionales || [];
          setMesas([1, 2, 3, 4, 5, 6, ...mesasAdicionales]);  // Siempre añades las mesas predeterminadas
          const horariosAdicionales = data.horasAdicionales || [];
          setHoras([...horas, ...horariosAdicionales.map(h => ({ value: h, label: h }))]);  // Combinas las horas predeterminadas con las adicionales
        } else {
          setMesas([1, 2, 3, 4, 5, 6]);  // Si no hay datos adicionales, usa las mesas predeterminadas
          setHoras(horas);  // Usa los horarios predeterminados
        }
      }
    };
  
    fetchDisponibilidad();
  }, [fecha]);  // Esto se ejecutará cada vez que cambie la fecha

  useEffect(() => {
    const fetchMesasOcupadas = async () => {
      if (fecha && horario) {
        const reservasRef = collection(db, "reservas");
        const q = query(reservasRef, where("fecha", "==", fecha), where("horario", "==", horario), where("estado", "==", "Confirmada"));
        const querySnapshot = await getDocs(q);
        const ocupadas = [];
        querySnapshot.forEach((doc) => {
          ocupadas.push(doc.data().mesa);
        });
        setMesasOcupadas(ocupadas);  // Establece las mesas ocupadas correctamente
      } else {
        setMesasOcupadas([]);  // Si no se ha seleccionado una fecha o horario, reinicia las mesas ocupadas
      }
    };
    fetchMesasOcupadas();
  }, [fecha, horario]);  // Esto se ejecutará cada vez que cambien la fecha o el horario

  useEffect(() => {
    const fetchUsuario = async (uid) => {
      try {
        const docRef = doc(db, 'clientes', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsuario(docSnap.data());
        } else {
          console.log('No hay tal documento!');
        }
      } catch (error) {
        console.error("Error al obtener el usuario: ", error);
      }
    };

    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    
    if (token && uid) {
      setIsAuthenticated(true);
      fetchUsuario(uid);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleElegirMesa = () => {
    if (!grupo || !fecha || !horario) {
      alert("Por favor, complete todos los campos antes de continuar.");
    } else {
      setReserva(false); // Cambia al estado para mostrar las mesas si todos los campos están llenos
    }
  };

  const handleReserva = () => {
    setReserva(true); // Regresa al formulario de reserva
  };

  const handleSeleccionarMesa = (mesa) => {
    setMesaSeleccionada(mesa); // Establece la mesa seleccionada
  };

  const handleConfrimationReserv = async () => {
    const uid = localStorage.getItem('uid');
    if (mesaSeleccionada && grupo && fecha && horario) {
      try {
        await addDoc(collection(db, "reservas"), {
          uid: uid,
          estado: "Confirmada",
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono,
          grupo: grupo,
          fecha: fecha,
          horario: horario,
          mesa: mesaSeleccionada,
          createdAt: serverTimestamp()
        });
        alert("Reservación confirmada con éxito!, por favor verifica tu correo");

        let messagueComfirm = `Nombre: ${usuario.nombre}\nEmail: ${usuario.correo}\nTelefono: ${usuario.telefono}\nTamaño del grupo: ${grupo}\nFecha: ${fecha}\nHorario: ${horario}\nN° de mesa: ${mesaSeleccionada}`;        
        messagueComfirm += "\n\nMuchas gracias por su preferencia";

        const templateParams = {
          messague: messagueComfirm,
          subject: "Confirmacion de reserva!!",
          email: usuario.correo,
        };

        emailjs.send('service_4ie5ez4', 'template_rqpmnbl', templateParams, 'msvOlm1YjIR6h1Xs5')
        .then((response) => {
          console.log('Reserva enviada con éxito:', response.status, response.text);
        })
        .catch((error) => {
          console.error('Error al enviar el correo:', error);
          alert('Hubo un error al enviar el correo');
        });

        Navigate('/');
      } catch (error) {
        console.error("Error al confirmar la reservación: ", error);
        alert("Hubo un problema al confirmar la reservación.");
      }
    }
  };

  return (
    <main>
      {isAuthenticated ? (
        <div className='reservation'>
          {reserva ? (
            <>
              <form>
                <h1>¡Reserva ahora!</h1>
                <p>Nombre: {usuario.nombre}</p>
                <p>Correo: {usuario.correo}</p>
                <p>Teléfono: {usuario.telefono}</p>

                <label htmlFor="grupo">Tamaño del grupo:</label>
                <select name="grupo" id="grupo" required value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                  <option value="" disabled>Seleccione el tamaño del grupo</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4 personas</option>
                  <option value="5">5 personas</option>
                  <option value="6">6 personas</option>
                </select>

                <label htmlFor="fecha">Fecha:</label>
                <input type="date" id='fecha' name='fecha' min={today} required value={fecha} onChange={(e) => setFecha(e.target.value)} />

                <label htmlFor="horario">Horario:</label>
                <select name="horario" id="horario" required value={horario} onChange={(e) => setHorario(e.target.value)}>
                  <option value="" disabled>Seleccione el horario</option>
                  {horasDisponibles.map(horario => (
                    <option key={horario.value} value={horario.label}>
                      {horario.label}
                    </option>
                  ))}
                </select>

                <button type='button' id='elegir-mesa' onClick={handleElegirMesa}>Elegir Mesa</button>
              </form>
            </>
          ) : (
            <>
              <div id='mesa-container'>
                <h3>Elige una mesa</h3>
                <div id='mesas'>
  {mesas.map(mesa => (
    <button
      key={mesa}
      id='mesa-btn'
      onClick={() => handleSeleccionarMesa(mesa)}
      style={{
        backgroundColor: mesasOcupadas.includes(mesa) ? 'red' : (mesaSeleccionada === mesa ? 'green' : ''),
        pointerEvents: mesasOcupadas.includes(mesa) ? 'none' : 'auto', // Desactiva el botón si la mesa está ocupada
      }}
      disabled={mesasOcupadas.includes(mesa)} // Desactiva el botón si la mesa está ocupada
    >
      Mesa {mesa}
    </button>
  ))}
</div>


                <button onClick={handleReserva}>Cancelar</button>
                {mesaSeleccionada && <button onClick={handleConfrimationReserv}>Confirmar Reserva</button>}
              </div>
            </>
          )}
        </div>
      ) : (
        <Login />
      )}
    </main>
  );
}

export default Reserva;
