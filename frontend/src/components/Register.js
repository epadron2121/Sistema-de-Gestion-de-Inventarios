import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para redirección

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('empleado'); // Asigna un rol por defecto o permite que el usuario elija uno
  const navigate = useNavigate(); // Hook para redirigir al usuario a la página de inicio de sesión

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

  // Función para redirigir al inicio de sesión
  const goToLogin = () => {
    navigate('/login'); // Redirige a la página de inicio de sesión
  };

  return (
    <div className="auth-form-container">
      <h2>Registro</h2>
      <form onSubmit={registerUser}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Rol</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Rol"
            variant="outlined"
          >
            <MenuItem value="empleado">Empleado</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          style={{ borderRadius: 0 }}
        >
          Registrar
        </Button>

        {/* Botón de Iniciar sesión */}
        <Button
          variant="outlined"
          fullWidth
          color="secondary"
          style={{ marginTop: '10px', borderRadius: 0 }}
          onClick={goToLogin}
        >
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}

export default Register;
