import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Grid, Container, Box } from "@mui/material"; 
import { useAuth } from "../AuthContext"; 
import { Bar } from "react-chartjs-2"; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"; 
import ProductManagement from "./ProductManagement";
import ProductList from "./ProductList"; // Importa ProductList

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { logout } = useAuth(); 
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error("Error al recuperar los productos");
      }
      const data = await response.json();
      setProducts(data);
      setTotalProducts(data.length);
      const lowStock = data.filter(product => product.quantity < 5).length;
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Error al recuperar productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const data = {
    labels: ["Producto 1", "Producto 2", "Producto 3"],
    datasets: [
      {
        label: "Cantidad Vendida",
        data: [12, 19, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Panel de Administración de Inventarios
      </Typography>
      
      <Grid container spacing={4} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#f5f5f5", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
            <CardContent>
              <Typography variant="h6">Total de Productos</Typography>
              <Typography variant="h4">{totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#f5f5f5", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
            <CardContent>
              <Typography variant="h6">Productos con Baja Existencia</Typography>
              <Typography variant="h4" color="error">{lowStockProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4} p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Ventas por Producto
        </Typography>
        <div style={{ height: "400px" }}>
          <Bar data={data} options={options} />
        </div>
      </Box>

      <Box mt={4} p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Lista de Productos
        </Typography>
        <ProductList products={products} />
      </Box>

      <Box mt={4} p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Administrar Productos
        </Typography>
        <ProductManagement onProductAdded={fetchProducts} />
      </Box>

      <Box mt={4} textAlign="center">
        <Button variant="contained" color="secondary" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
