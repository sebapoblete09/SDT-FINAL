// Home.jsx
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    affair: '',
    comment: '',
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Enviar el correo al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, lastName, email, affair, comment } = formData;

    // Configura los datos del mensaje que se envía con EmailJS
    const templateParams = {
      name: name,
      last_name: lastName,
      email: email,
      affair: affair,
      comment: comment,
    };

    // Reemplaza 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', y 'YOUR_USER_ID' con tus valores de EmailJS
    emailjs.send('service_4ie5ez4', 'template_w73sbrm', templateParams, 'msvOlm1YjIR6h1Xs5')
      .then((response) => {
        console.log('Correo enviado con éxito:', response.status, response.text);
        console.log(templateParams);
        alert('Correo enviado con éxito');
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        alert('Hubo un error al enviar el correo');
      });
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
