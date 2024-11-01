import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; 

function Home() {
  return (
    <div className='home'>
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
                <div className="news-item">
                    <img src="/src/img/cueca.jpeg" alt="Noticia 1"/>
                    <h3>Competencia de cueca</h3>
                    <p>Ven este 17 y 18 de sept a participar de una cometencia de cueca por increibles premios. Mas informacion en nuestro local.</p>
                </div>
                <div className="news-item">
                    <img src="/src/img/coctel.jpeg" alt="Noticia 2"/>
                    <h3>Nuevos Platos</h3>
                    <p>Ven a probar nuestro nuevo plato: El coctel marino, un increible plato con la frescura del mar.</p>
                </div>
                <div className="news-item">
                    <img src="/src/img/Fiestas.jpeg" alt="Noticia 3"/>
                    <h3>Fiestas Patrias.</h3>
                    <p>Ven a vivir las fiestas patrias con buena musica y comida, Asegura tu mesa</p>
                </div>
                <div className="news-item">
                    <img src="/src/img/Cazuela-Dia-Cocina-Chilena-.jpg" alt="Noticia 4"/>
                    <h3>Nuevo sitio web</h3>
                    <p>Nos complace anunciar que el nuevo sitio web esta operativo
                    </p>
                </div>
            </div>
          </div>
        </section>

      <section id="Adm_reserva">
        <li><Link to="/reservar" className='button'>Reservar</Link></li>
        <li><Link to="/mis-reservas" className='button'>Cancelar Reserva</Link></li>
      </section>

       
    </div>
  );
}

export default Home;
