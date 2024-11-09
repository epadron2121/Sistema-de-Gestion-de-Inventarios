import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import TestAccess from "./components/TestAccess";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./AuthContext";
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute component={Dashboard} />}
        />
        <Route 
          path="/test-access" 
          element={<TestAccess />}
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
