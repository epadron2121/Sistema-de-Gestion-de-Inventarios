import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Asegúrate de que este import esté correcto
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Llama a registerUser al enviar el formulario
  const registerUser = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Usuario registrado:", userCredential.user);
        // Opcional: Redirige al usuario o limpia el formulario
      })
      .catch((error) => {
        console.error("Error al registrar usuario:", error.message);
      });
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={registerUser}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
