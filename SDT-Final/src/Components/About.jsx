import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css'; // Asegúrate de crear este archivo para los estilos
import Pedro from '../img/Pedro.jpg';
import Isabel from '../img/Isabel.jpg';
import Fachada from '../img/fachada.jpeg';

const members = [
  {
      id: 1,
      name: 'Don Pedro',
      description: 'Pedro es un hombre oriundo de la zona central de Chile, con un sueño de toda la vida: crear un espacio donde la autenticidad y la calidad fueran los pilares fundamentales. Su pasión por la cultura chilena y su deseo de mantener vivas las tradiciones culinarias del país lo llevaron a cofundar "Sabores de la Tierra" junto a su esposa Isabel. Pedro es conocido por su atención a los detalles y su compromiso con ofrecer a los clientes una experiencia gastronómica que refleje lo mejor de Chile. Su visión ha sido clave en el éxito y la reputación del restaurante, que se ha convertido en un referente de la cocina chilena en Santiago.',
      image: Pedro
  },
  {
      id: 2,
      name: 'Doña Isabel',
      description: 'Isabel es una mujer de origen sureño, nacida en una pequeña localidad del sur de Chile. Desde muy joven, estuvo inmersa en la tradición culinaria de su familia, donde aprendió los secretos de la cocina chilena de la mano de su madre y abuela. Apasionada por la gastronomía, Isabel siempre ha buscado preservar las recetas tradicionales que le fueron transmitidas, infundiendo en cada plato el cariño y la autenticidad que caracterizan su cocina. Su dedicación y amor por la cocina se reflejan en cada uno de los platos que prepara en "Sabores de la Tierra", donde lleva años deleitando a los comensales con sabores auténticos y llenos de historia.',
      image: Isabel
  },
];




function About() {
  return (
    <main className='About-us'>
        <section className="history">
          <div className="history-container">
            <div className="history-image">
            <img src={Fachada} alt="Imagen de Nuestra Historia" />
          </div>
          <div className="history-text">
            <h2>Nuestra Historia</h2>
            <p>
              Sabores de la Tierra es un restaurante que abrió sus puertas en el año 2006 en el corazón de Santiago de Chile. Fundado por doña Isabel y don Pedro, una pareja apasionada por la gastronomía chilena, el restaurante nació con el objetivo de preservar y celebrar las tradiciones culinarias del país. Isabel, nacida en una pequeña localidad del sur de Chile, creció entre los fogones, aprendiendo los secretos de las recetas familiares transmitidas de generación en generación. Pedro, oriundo de la zona central, siempre soñó con tener un espacio donde la autenticidad y la calidad fueran los pilares fundamentales.
              <br /><br />
              Desde sus inicios, Sabores de la Tierra se ha destacado por ofrecer una experiencia culinaria auténtica, en la que los comensales pueden disfrutar de platos tradicionales chilenos preparados con ingredientes frescos y de origen local. El menú incluye una variedad de opciones que van desde empanadas crujientes rellenas de pino hasta cazuelas humeantes y pastel de choclo cremoso, todo acompañado de una selección de vinos de los mejores viñedos del país.
              <br /><br />
              A lo largo de los años, el restaurante ha ganado un lugar especial en el corazón de sus clientes, no solo por la calidad de sus platos, sino también por el ambiente acogedor y familiar que se respira en cada rincón. Con una decoración que evoca la calidez de las cocinas campesinas, "Sabores de la Tierra" es un refugio para quienes buscan reconectar con las raíces de la gastronomía chilena.
            </p>
          </div>
        </div>
      </section>

      <section className='Members'>
        <div className="members-section">
          <div className="members-container">
            {members.map(member => (
            <div key={member.id} className="member-card">
              <img src={member.image} alt={member.name} className="member-image" />
              <h3>{member.name}</h3>
              <p>{member.description}</p>
            </div>
            ))}
          </div>
        </div>
        
      </section>
    </main>
  );
}

export default About;
