import React from 'react';
import { auth } from '../firebase/firebaseconfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { db } from '../firebase/firebaseconfig'; 



function About() {
  return (
    <main>
        <h2>¡Bienvenido!</h2>
        <span>Inicia sesión para realizar una reserva</span>
        <form action="">
            <div>
                <input type="text" />
            </div>

            <div>
                <input type="password"/>
            </div>

            <div>
                <button>Iniciar sesion</button>
                <button>Registrarse</button>
                <button>Iniciar sesion con google</button>
            </div>
        </form>
    </main>
  );
}

export default About;
