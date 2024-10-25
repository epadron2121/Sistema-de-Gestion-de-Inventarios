import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register"; // Importa el componente de registro
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./AuthContext";
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Nueva ruta para registro */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute component={Dashboard} />
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to={user ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
