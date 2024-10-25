import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material"; // Asegúrate de importar Button
import { useAuth } from "../AuthContext"; // Importa el contexto de autenticación
import { Bar } from "react-chartjs-2"; // Importa el gráfico de barras
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"; // Importa lo necesario de chart.js
import ProductManagement from "./ProductManagement"; // Importa el componente ProductManagement

// Registra las escalas y elementos necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { logout } = useAuth(); // Obtén la función logout del contexto

  // Datos para el gráfico de barras
  const data = {
    labels: ["Producto 1", "Producto 2", "Producto 3"],
    datasets: [
      {
        label: "Cantidad Vendida",
        data: [12, 19, 3],
        backgroundColor: ["rgba(75, 192, 192, 0.6)"], // Color del gráfico
      },
    ],
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5">Total de Productos: 100</Typography>
          <Typography variant="h5">Productos con Baja Existencia: 10</Typography>
          <Button variant="contained" color="secondary" onClick={logout}>
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
      {/* Agrega el gráfico de barras aquí */}
      <div style={{ marginTop: '20px' }}>
        <Bar data={data} />
      </div>
      {/* Agrega el formulario de gestión de productos aquí */}
      <div style={{ marginTop: '20px' }}>
        <h2>Administrar Productos</h2>
        <ProductManagement /> {/* Aquí se agrega el componente ProductManagement */}
      </div>
    </div>
  );
};

export default Dashboard;
