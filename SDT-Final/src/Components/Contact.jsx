// Home.jsx
import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    affair: '',
    comment: '',
  });

  // Función para manejar el cambio de valores en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para construir el enlace mailto con los valores del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { name, lastName, email, affair, comment } = formData;
    const mailtoLink = `mailto:sdt.restaurantechile@gmail.com?subject=${encodeURIComponent(affair)}&body=${encodeURIComponent(
      `Nombre: ${name} ${lastName}\nCorreo: ${email}\n\n${comment}`
    )}`;
    
    // Abrir el enlace mailto en una nueva ventana
    window.location.href = mailtoLink;
  };

  return (
    <main className='content'>
      <h1 className="titulo">¿Tienes una duda?</h1>

      <div className='contact-wrapper'>
        <div className='contact-form'>
          <h3>Contáctanos.</h3>
          <form className='form-contact' onSubmit={handleSubmit}>
            <p>
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
              />
            </p>
                    
            <p>
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                name="lastName"
                id="last-name"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
              />
            </p>

            <p>
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="ejemplo12@correo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </p>

            <p>
              <label htmlFor="affair">Asunto</label>
              <input
                type="text"
                name="affair"
                id="affair"
                placeholder="Asunto"
                value={formData.affair}
                onChange={handleChange}
              />
            </p>

            <p>
              <label htmlFor="comment">Comentario</label>
              <textarea
                name="comment"
                id="comment"
                rows="3"
                value={formData.comment}
                onChange={handleChange}
              ></textarea>
            </p>

            <p>
              <button type="submit">Contactarnos</button>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;
