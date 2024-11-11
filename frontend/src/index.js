import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./AuthContext";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Crear un tema global
const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Elimina el border-radius en todos los inputs
        },
      },
    },
  },
});

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </AuthProvider>,
  document.getElementById("root")
);
