import React from 'react';
import { useState, useEffect,} from 'react';
import { collection, addDoc, doc, getDocs, serverTimestamp, where, query , getDoc} from 'firebase/firestore'; 
import { db } from '../firebase/firebaseconfig'; 
import horas from '../const/horas';
import Login from './Login';
import emailjs from 'emailjs-com';
import '../styles/reserva.css'; // Asegúrate de crear este archivo para los estilos

function Reserva() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: '', correo: '', telefono: '' });
  const [reserva, setReserva] = useState(true);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [horario, setHorario] = useState(null);
  const [mesasOcupadas, setMesasOcupadas] = useState([]); // Estado para mesas ocupadas
  const mesas = [1, 2, 3, 4, 5, 6];
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Verificar mesas ocupadas cuando se selecciona una fecha y horario
    const fetchMesasOcupadas = async () => {
      if (fecha && horario) {
        const reservasRef = collection(db, "reservas");
        const q = query(reservasRef, where("fecha", "==", fecha), where("horario", "==", horario), where("estado", "==", "Confirmada"));
        const querySnapshot = await getDocs(q);
        const ocupadas = [];
        querySnapshot.forEach((doc) => {
          ocupadas.push(doc.data().mesa);
        });
        setMesasOcupadas(ocupadas);
      }else{
        setMesasOcupadas([]);
      }
    };
    
    fetchMesasOcupadas();
  }, [fecha, horario]);

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
    setReserva(false); // al hacer click muestra las mesas
  };

  const handleReserva = () => {
    setReserva(true); // al hacer click muestra el formulario
  };

  const handleSeleccionarMesa = (mesa) => {
    setMesaSeleccionada(mesa); // establece la mesa seleccionada
  }

  // enviar reserva a la bd
  const handleConfrimationReserv = async () => {

    const uid = localStorage.getItem('uid');
    if (mesaSeleccionada && grupo && fecha && horario) {
      try {
        // Crea un documento en la colección "reserva" en Firestore
        await addDoc(collection(db, "reservas"), {
          uid: uid,
          estado: "Confirmada",
          nombre: usuario.nombre, // Usa el nombre del usuario autenticado
          correo: usuario.correo, // Usa el correo del usuario autenticado
          telefono: usuario.telefono, // Usa el teléfono del usuario autenticado
          grupo: grupo, // Usar referencia
          fecha: fecha, // Usar referencia
          horario: horario, // Usar referencia
          mesa: mesaSeleccionada, // Utiliza la mesa seleccionada
          createdAt: serverTimestamp() // Agregar el timestamp aquí
        });
        alert("Reservación confirmada con éxito!, por favor verifica tu correo");
        
        let messagueComfirm = `Nombre: ${usuario.nombre}\nEmail: ${usuario.correo}\nTelefono: ${usuario.telefono}\nTmaño del grupo: ${grupo}\nFecha: ${fecha}\nHorario: ${horario}\nN° de mesa: ${mesaSeleccionada}`;
        messagueComfirm+= "\n\nMuchas gracias por su preferencia";

       

        // Configura los datos del mensaje que se envía con EmailJS
        const templateParams = {
          messague: messagueComfirm,
          subject: "Confirmacion de reserva!!",
          email:usuario.correo,
        };

        // Reemplaza 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', y 'YOUR_USER_ID' con tus valores de EmailJS
        emailjs.send('service_4ie5ez4', 'template_rqpmnbl', templateParams, 'msvOlm1YjIR6h1Xs5')
        .then((response) => {
          console.log('Reserva enviada con éxito:', response.status, response.text);
          console.log(templateParams);
        })
        .catch((error) => {
          console.error('Error al enviar el correo:', error);
          alert('Hubo un error al enviar el correo');
        });
        
      } catch (error) {
        console.error("Error al confirmar la reservación: ", error);
        alert("Hubo un problema al confirmar la reservación.");
      }
    }
  };




  return (
    <main >
        {isAuthenticated ? (
        // Si está autenticado, muestra el formulario de reserva
        <div className='reservation'>
          {reserva ? (
            <>
              <form>
                <h1>¡Reserva ahora!</h1>
                <p>Nombre: {usuario.nombre}</p>
                <p>Correo: {usuario.correo}</p>
                <p>Teléfono: {usuario.telefono}</p>

                <label htmlFor="grupo">Tamaño del grupo:</label>
                <select name="grupo" id="grupo" required value={grupo} onChange={(e)=> setGrupo(e.target.value)}>
                  <option value="" disabled selected>Seleccione el tamaño del grupo</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4 personas</option>
                  <option value="5">5 personas</option>
                  <option value="6">6 personas</option>
                </select>

                <label htmlFor="fecha">Fecha:</label>
                <input type="date" id='fecha' name='fecha' min={today} required value={fecha} onChange={(e)=> setFecha(e.target.value)} />

                <label htmlFor="horario">Horario:</label>
                <select name="horario" id="horario" required value={horario} onChange={(e)=> setHorario(e.target.value)}>
                  {horas.map(horario => (
                    <option key={horario.value} value={horario.label}>
                      {horario.label}
                    </option>
                  ))}
                </select>

                <button type='button' id='elegir-mesa' onClick={handleElegirMesa}>Elegir Mesa.</button>

              </form>
            </>
          ) : (
            <>
              <div id='mesa-container'>
                <h3>Elige una mesa</h3>
                <div id='mesas'>
                  {mesas.map(mesa => (
                    <button key={mesa} id='mesa-btn' onClick={() => handleSeleccionarMesa(mesa)} 
                    style={{
                      backgroundColor: mesasOcupadas.includes(mesa) ? 'red' : (mesaSeleccionada === mesa ? 'green' : '#746743')
                    }}
                    disabled={mesasOcupadas.includes(mesa)} // Desactiva el botón si está ocupada
                  >
                    {mesa}
                  </button>
                  ))}
                </div>
                {mesaSeleccionada && (
                  <button id='confirmar-mesa' onClick={handleConfrimationReserv}>
                    Confirmar Reservación.
                  </button>
                )}

                <button type='button' id='volver' onClick={handleReserva}>Volver atrás.</button>
              </div>
            </>
          )}
        </div>
      ) : (
        // Si no está autenticado, muestra el mensaje de inicio de sesión
        <Login/>
      )}
        
    </main>
  );
}

export default Reserva;
