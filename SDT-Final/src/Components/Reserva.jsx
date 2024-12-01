import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDocs, serverTimestamp, where, query, getDoc, updateDoc, setDoc } from 'firebase/firestore';
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
  const [selectMenu, setSelectMenu] = useState(false);
  const [selectMesa, setSelectMesa] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [grupo, setGrupo] = useState('');
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [mesasOcupadas, setMesasOcupadas] = useState([]);
  const [mesas, setMesas] = useState([]);  // Estado para las mesas
  const [horasDisponibles, setHoras] = useState(horas);  // Estado para las horas
  const today = new Date().toISOString().split('T')[0]; 
  const [modal, setModal] = useState(false);
  const [platosSeleccionados, setPlatosSeleccionados] = useState([]);
  const [presupuesto, setPresupuesto] = useState(0);
   const [cantidadSeleccionada, setCantidadSeleccionada] = useState({}); // Almacena las cantidades por plato



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

  // Función para obtener y actualizar el contador
  const obtenerYActualizarContador = async () => {
    const counterRef = doc(db, 'counters', 'reservaCode');  // Referencia al documento de contador
  
    try {
      // Verificar si el documento existe
      const counterSnap = await getDoc(counterRef);
  
      if (counterSnap.exists()) {
        // Si el documento existe, obtenemos el valor actual y lo incrementamos
        const currentValue = counterSnap.data().value;
        const newValue = currentValue + 1;
  
        // Actualizar el documento con el nuevo valor
        await updateDoc(counterRef, { value: newValue });
  
        return currentValue;  // Retornar el valor anterior
      } else {
        // Si no existe el documento, crearlo con el valor inicial
        await setDoc(counterRef, { value: 100 });  // Establecer el valor inicial a 1
        return 0;  // Retornar 0 ya que esta es la primera reserva
      }
    } catch (error) {
      console.error("Error al obtener o actualizar el contador:", error);
      throw new Error("Hubo un problema con el contador de la reserva");
    }
  };

 // Función para generar el código de reserva
const generarCodigoReserva = (contador) => {
  const prefijo = "RES";  // Prefijo para el código
  const codigo = `${prefijo}-${String(contador).padStart(4, '0')}`;  // Código final

  return codigo;
};
  const handleConfrimationReserv = async () => {
    const uid = localStorage.getItem('uid');
    
    if (mesaSeleccionada && grupo && fecha && horario) {
      try {
        // Obtenemos el contador de reservas e incrementamos su valor
      const contador = await obtenerYActualizarContador();

      // Generamos el código de reserva único
      const codigoReserva = generarCodigoReserva(contador);

        await addDoc(collection(db, "reservas"), {
          uid: uid,
          codigoReserva: codigoReserva,  // Añadimos el código de reserva
          estado: "Confirmada",
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono,
          grupo: grupo,
          fecha: fecha,
          horario: horario,
          mesa: mesaSeleccionada,
          createdAt: serverTimestamp(),
          platos : platosSeleccionados,
          precioInicial : presupuesto,
        });
        alert("Reservación confirmada con éxito!, por favor verifica tu correo");

        let menuReservado = platosSeleccionados.map(plato => 
          `- Plato: ${plato.Nombre}\n  Cantidad: ${plato.cantidad}\n  Precio unitario: $${plato.precio}\n  Total: $${plato.precio * plato.cantidad}`
        ).join('\n\n');
        
        let messagueComfirm = `Codigo reserva: ${codigoReserva}\nNombre: ${usuario.nombre}\nEmail: ${usuario.correo}\nTelefono: ${usuario.telefono}\nTamaño del grupo: ${grupo}\nFecha: ${fecha}\nHorario: ${horario}\nN° de mesa: ${mesaSeleccionada}\n\nMenu reservado:\n\n${menuReservado}\n\nPresupuesto: ${presupuesto}`;
        messagueComfirm += "\n\nMuchas gracias por su preferencia \n\nPuedes ver tu reserva en:\nhttps://sabores-de-la-tierra-81626.web.app";
        

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

  const handleMostrarPreseleccion = () => {
    if (mesaSeleccionada) {
      setSelectMenu(true); // Mostrar preselección
      setModal(false); // Ocultar modal
    } else {
      alert("Por favor, seleccione una mesa antes de continuar.");
    }
  };
  
  const handleModal = () => {
    setModal(true); // Mostrar modal de selección de platos
    setSelectMenu(false); // Ocultar preselección
    setSelectMesa(false)
  };



  const handleVolverMesas = () => {
    setSelectMenu(false);
    setSelectMesa(true);
  };

  //Seleccioanr platos
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Entrada');



  useEffect(() => {
      const checkAuthStatus = () => {
          const token = localStorage.getItem('token');
          setIsAuthenticated(!!token);
  
      };

      checkAuthStatus();
  }, []);

  const fetchMenuItems = async () => {
      const menuCollection = collection(db, 'menu');
      const menuSnapshot = await getDocs(menuCollection);
      const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(menuList);
  };

  useEffect(() => {
      fetchMenuItems();
  }, []);


  const handleCategoryChange = (category) => {
      setSelectedCategory(category);
  };

  const filteredMenuItems = menuItems.filter(item => item.Tipo === selectedCategory);

  const addDish = (item) => {
    // Verifica si el plato ya está en la lista
    const existingDish = platosSeleccionados.find(plato => plato.id === item.id);
    if (existingDish) {
      // Si el plato ya está, aumenta la cantidad
      existingDish.cantidad += cantidadSeleccionada[item.id];
    } else {
      // Si el plato no está, lo agrega con la cantidad seleccionada
      platosSeleccionados.push({ ...item, cantidad: cantidadSeleccionada[item.id] });
    }
    
    // Llama a calPres para recalcular el presupuesto
    calPres();
  };

  const calPres = () => {
    let total = 0;
    platosSeleccionados.forEach(plato => {
      total += plato.precio * plato.cantidad;
    });
    setPresupuesto(total); // Actualiza el estado del presupuesto
  };

  const handleCantidadChange = (id, cantidad) => {
    setCantidadSeleccionada((prev) => ({
      ...prev,
      [id]: cantidad,
    }));
  };

  return (
    <main >
      {isAuthenticated ? (
        <div className='reservation'>
          
          {selectMenu ? (
            <>
            <div className='preseleccion'>
              <h2>¿Quiere preseleccionar platos?</h2>
              <p>De esta manera, el día de la reserva ya tendrá platos reservados y un presupuesto inicial.</p>
              <button type='button' onClick={handleVolverMesas}>Regresar</button>
              <button  type='button'onClick={handleModal}>Selecionar platos</button>
              <button  type='button'onClick={handleConfrimationReserv}>Continuar sin seleccionar</button>
            </div>
          </>
          ):modal?(
              <>
                <div className='SelectMenu'>
                  <div className='selecction'>
                    <div className='category-buttons'>
                          <button type='button' onClick={() => handleCategoryChange('Entrada')}>Entradas</button>
                          <button type='button' onClick={() => handleCategoryChange('Plato Principal')}>Plato Principal</button>
                          <button type='button' onClick={() => handleCategoryChange('Postre')}>Postres</button>
                          <button type='button' onClick={() => handleCategoryChange('Bebestible')}>Bebestible</button>
                    </div>

                    <div className='menu-items'>
                          {filteredMenuItems.map((item) => (
                              <div key={item.id} className='menu-item'>
                                  <div >
                                      <h3 >{item.Nombre}</h3>
                                      <p >{item.Descripcion}</p>
                                  </div>
                                  <div>
                                    <span >${item.precio}</span>
                                    <div>
                                    <label htmlFor="cantidad">Cantidad: </label>
                                    <input
                                      id={`cantidad-${item.id}`}
                                      type="number"
                                      min={0}
                                      max={15}
                                      value={cantidadSeleccionada[item.id] || ''}
                                      onChange={(e) => handleCantidadChange(item.id, parseInt(e.target.value, 10) || 0)}
                                    />
                                    </div>
                                    
                                    <button type="button"
                                        onClick={() => addDish(item)}
                                    >
                                        Agregar plato
                                      </button>
                                  </div>
                                 
                              </div>
                          ))}     
                  </div>    
                </div>

                <div className="resumen">
                  <h2>Resumen de la reserva</h2>
                  <ul>
                    {platosSeleccionados.map((plato, index) => (
                      <li key={index}>
                        <p><strong>Plato:</strong> {plato.Nombre}</p>
                        <p><strong>Precio unitario:</strong> ${plato.precio}</p>
                        <p><strong>Cantidad:</strong> {plato.cantidad}</p>
                        <p><strong>Total:</strong> ${plato.precio * plato.cantidad}</p>
                        <hr />
                      </li>
                    ))}
                  </ul>
                  <h3>Total a pagar: ${presupuesto}</h3>
                  <div className='opc'>
                    <button type='button' onClick={()=>(
                      handleConfrimationReserv()
                      )}>Confirmar platos</button>
                  <button  type='button' onClick={handleVolverMesas}>Volver atras</button>
                  </div> 
                </div>
              </div>
              </>
          ): reserva ?(
            <>
            <form className='form-reserv'>
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

          ): (<>
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
              {mesaSeleccionada && <button onClick={handleMostrarPreseleccion}>Confirmar Mesa</button>}
            </div>
          </>)}
          </div>
          ) : (
            <Login />
            )}
    </main>


  )};

  export default Reserva;