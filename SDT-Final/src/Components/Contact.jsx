// Home.jsx
import React from 'react';
import '../styles/Contact.css';

function Contact() {
  return (
    <main className='content'>
      <h1 className="titulo"> ¿Tienes una duda?</h1>

      <div className='contact-wrapper'>
        <div className='contact-form'>
          <h3>Contactanos.</h3>
          <form className='form-contact'>
            <p>
              <label htmlFor="name">Nombre</label>
              <input type="text" name="name" id="name" placeholder="Nombre"/>
            </p>
                    
            <p>
              <label htmlFor="last-name">Apellido</label>
              <input type="text" name="last-name" id="last-name" placeholder="Apellido"/>
            </p>

            <p>
              <label htmlFor="email">Correo Electronico</label>
              <input type="email" name="email" id="email" placeholder="ejemplo12@correo.com"/>
            </p>

            <p>
              <label htmlFor="affair">Asunto</label>
              <input type="text" name="affair" id="asunto" placeholder="Nombre"/>
            </p>

            <p>
              <label htmlFor="coment">Comentario</label>
              <textarea name="coment" id="coment" rows="3"></textarea>
            </p>

            <p>
              <button type="submit">Enviar</button>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;
