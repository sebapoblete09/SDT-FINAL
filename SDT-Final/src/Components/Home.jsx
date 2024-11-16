import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../Firebase/firebaseconfig'; // Importa tu configuración de Firebase
import { collection, addDoc, getDocs, orderBy, query , updateDoc, doc} from 'firebase/firestore';

import '../styles/Home.css'; 

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const [newsItems, setNewsItems] = useState([]);
  const [newNews, setNewNews] = useState({ nombre: '', desc: '', img: '' });
  const [editing, setEditing] = useState(null);


  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role'); // Obtiene el rol de localStorage
      setIsAuthenticated(!!token);
      setRole(storedRole);
      fetchNews()
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Función para obtener las últimas 4 noticias
  const fetchNews = async () => {
    const q = query(collection(db, 'news'), orderBy('fecha_creacion', 'desc'));
    const querySnapshot = await getDocs(q);
    const newsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNewsItems(newsData.slice(0, 4)); // Solo muestra las 4 últimas
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNews({ ...newNews, [name]: value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (editing !== null) {
      // Actualiza un elemento de noticia existente
      await updateNews(editing, { ...newNews });
    } else {
      // Agrega un nuevo elemento de noticia
      await addDoc(collection(db, 'news'), {
        ...newNews,
        fecha_creacion: new Date() // Fecha actual
      });
    }

    setNewNews({ nombre: '', desc: ''});
    setEditing(null);
    fetchNews(); // Actualiza la lista de noticias
  };

  const handleEdit = (item) => {
    setNewNews({ nombre: item.nombre, desc: item.desc,  });
    setEditing(item.id);
  };

  const updateNews = async (id, updatedData) => {
    // Lógica para actualizar la noticia en Firestore
    const newsRef = doc(db, 'news', id);
    await updateDoc(newsRef, updatedData);
    fetchNews(); // Actualiza la lista de noticias
  };


  return (
    <div className='home'>
      {isAuthenticated ? (
        <>
          <section id="hero">
            <h1>Sabores de la Tierra</h1>
            <h2>Donde la tradición y la pasión por la comida chilena se unen</h2>
            <li><Link to="/menu" className='button'>Menú</Link></li>
          </section>

          <section id="About-us">
          <div className="Au-section">
            <h2>Quienes Somos</h2>
            <div className="AboutUs-Container">
                <div className="Card">
                    <h3>Descubre la esencia de Sabores de la tierra</h3>
                    <p>En 2006, en el corazón de Santiago, nació Sabores de la Tierra como un pequeño proyecto familiar, inspirado en recetas tradicionales transmitidas de generación en generación. Con el tiempo, se ha convertido en un restaurante reconocido por su compromiso con la calidad y el sabor auténtico, ofreciendo a nuestros clientes una experiencia culinaria que celebra nuestras raíces y cultura.</p>
                </div>
                <div className="Card">
                    <h3>Ubicados en el corazon de Santiago</h3>
                    <p>Sabores de la Tierra es un lugar donde la calidez y la hospitalidad chilena se sienten desde el momento en que cruzas la puerta. Nos encontramos en Calle Ejemplo 123, a pocos pasos de los principales puntos de interés de la ciudad.</p>
                </div>
                <div className="Card">
                    <h3>Expertos en la cocina</h3>
                    <p>En Sabores de la tierra, nos enorgullecemos de ofrecer una auténtica experiencia culinaria chilena. Nuestro menú está cuidadosamente diseñado para resaltar los sabores tradicionales de la gastronomía de Chile, con platos emblemáticos como empanadas, cazuela y pastel de choclo, elaborados con ingredientes frescos y locales. Desde las recetas caseras hasta los métodos de cocción tradicionales, cada bocado en nuestro restaurante te transportará a las raíces culinarias de Chile.</p>
                </div>
              </div>
            </div>
          </section>
          {role === 'admin' &&(
            <section id="events-news">
              <div className="news-section">
                <h2>Últimas Noticias</h2>
                <div className="news-container">
                {newsItems.map(item => (
                  <div className="news-item" key={item.id}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <button onClick={() => handleEdit(item)}>Editar</button>
                  </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {role === 'admin' && (
            <section id="add-edit-news">
            <h2>{editing ? 'Editar Noticia' : 'Agregar Noticia'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Título"
                value={newNews.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Descripción"
                value={newNews.description}
                onChange={handleChange}
                required
              />
              <div  className="button-container">
                <button className="button" type="submit">
                  {editing ? 'Guardar Cambios' : 'Agregar Noticia'}
                </button>
                {/* Este botón solo se muestra cuando estamos editando */}
                {editing && (
                  <button 
                    type="button" 
                    className="button" 
                    onClick={() => {
                      setEditing(false); // Cambia el estado de editing a false
                      setNewNews({ title: '', description: '' }); // Limpia los campos
                    }}
                  >
                    Volver a Añadir Noticia
                  </button>
                )}
              </div>
            </form>
          </section>
          
          
          )}

          {role === 'cliente' &&(
            <section id="events-news">
            <div className="news-section">
              <h2>Últimas Noticias</h2>
              <div className="news-container">
              {newsItems.map(item => (
                  <div className="news-item" key={item.id}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  ))}
                </div>
                
              </div>
            </section>
          )}

          {role==='cliente' && (
            <section id="Adm_reserva">
            <li><Link to="/reservar" className='button'>Reservar</Link></li>
            <li><Link to="/mis-reservas" className='button'>Cancelar Reserva</Link></li>
          </section>

          )}
          
        </>

      ):(
        <>
        <section id="hero">
            <h1>Sabores de la Tierra</h1>
            <h2>Donde la tradición y la pasión por la comida chilena se unen</h2>
            <li><Link to="/menu" className='button'>Menú</Link></li>
          </section>

          <section id="About-us">
          <div className="Au-section">
            <h2>Quienes Somos</h2>
            <div className="AboutUs-Container">
                <div className="Card">
                    <h3>Descubre la esencia de Sabores de la tierra</h3>
                    <p>En 2006, en el corazón de Santiago, nació Sabores de la Tierra como un pequeño proyecto familiar, inspirado en recetas tradicionales transmitidas de generación en generación. Con el tiempo, se ha convertido en un restaurante reconocido por su compromiso con la calidad y el sabor auténtico, ofreciendo a nuestros clientes una experiencia culinaria que celebra nuestras raíces y cultura.</p>
                </div>
                <div className="Card">
                    <h3>Ubicados en el corazon de Santiago</h3>
                    <p>Sabores de la Tierra es un lugar donde la calidez y la hospitalidad chilena se sienten desde el momento en que cruzas la puerta. Nos encontramos en Calle Ejemplo 123, a pocos pasos de los principales puntos de interés de la ciudad.</p>
                </div>
                <div className="Card">
                    <h3>Expertos en la cocina</h3>
                    <p>En Sabores de la tierra, nos enorgullecemos de ofrecer una auténtica experiencia culinaria chilena. Nuestro menú está cuidadosamente diseñado para resaltar los sabores tradicionales de la gastronomía de Chile, con platos emblemáticos como empanadas, cazuela y pastel de choclo, elaborados con ingredientes frescos y locales. Desde las recetas caseras hasta los métodos de cocción tradicionales, cada bocado en nuestro restaurante te transportará a las raíces culinarias de Chile.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="events-news">
          <div className="news-section">
            <h2>Últimas Noticias</h2>
            <div className="news-container">
            {newsItems.map(item => (
                  <div className="news-item" key={item.id}>
                    
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  ))}
              </div>
              
            </div>
          </section>

          <section id="Adm_reserva">
            <li><Link to="/reservar" className='button'>Reservar</Link></li>
            <li><Link to="/mis-reservas" className='button'>Cancelar Reserva</Link></li>
          </section></>

      )}       
    </div>
  );
}

export default Home;
