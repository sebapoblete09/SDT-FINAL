// Members.js
import React from 'react';
import Pedro from '../img/Pedro.jpg';
import Isabel from '../img/Isabel.jpg';

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

const Members = () => {
    return (
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
    );
};

export default Members;
/*89 78 164 */ 