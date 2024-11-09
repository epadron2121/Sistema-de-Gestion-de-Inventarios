import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig'; // Asegúrate de que este import esté correcto y de haber inicializado Firestore en firebaseConfig.js
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('empleado'); // Asigna un rol por defecto o permite que el usuario elija uno

  // Llama a registerUser al enviar el formulario
  const registerUser = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar el rol y otros datos del usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role // Aquí se asigna el rol, puede ser 'admin' o 'empleado'
      });

      console.log("Usuario registrado con rol:", role);
      // Opcional: Redirige al usuario o limpia el formulario
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
    }
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
        <div>
          <label>Rol:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employee">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
