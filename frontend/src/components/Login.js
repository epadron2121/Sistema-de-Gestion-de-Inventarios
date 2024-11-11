import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom"; 
import { Button, TextField, Typography, Container, Box, Grid, Alert } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs">
      <Box mt={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5" gutterBottom>
          Iniciar sesión
        </Typography>
        
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0, // Elimina el border-radius en el input
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0, // Elimina el border-radius en el input
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Iniciar sesión
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}

        <Box mt={3}>
          <Button fullWidth variant="outlined" color="secondary" onClick={handleRegisterRedirect}>
            Crear una cuenta
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
