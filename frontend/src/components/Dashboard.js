import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Grid, Container, Box, TextField, MenuItem } from "@mui/material";
import { useAuth } from "../AuthContext";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ProductManagement from "./ProductManagement";
import ProductList from "./ProductList";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Dashboard = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const { role } = useAuth(); // Obtenemos el rol desde el contexto

  // Fetch products when the component mounts
  const fetchProducts = async () => {
    try {
      const response = await fetch("https://sistema-de-gestion-de-inventarios-4vgy.vercel.app/api/products");
      if (!response.ok) {
        throw new Error("Error al recuperar los productos");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al recuperar productos:", error);
    }
  };

  const handleDeleteProduct = (id) => {
    // Eliminar producto en el estado local
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts); // Actualiza los productos
  };

  // Actualizar los productos filtrados según los filtros
  const filterProducts = () => {
    let filtered = [...products];

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    if (dateFilter) {
      filtered = filtered.filter(product => product.dateAdded === dateFilter);
    }
    if (stockFilter) {
      const stockLimit = parseInt(stockFilter, 10);
      filtered = filtered.filter(product => product.quantity >= stockLimit);
    }

    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setLowStockProducts(filtered.filter(product => product.quantity < 5).length);
  };

  // Call fetchProducts when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Llamar a la función de filtrado cada vez que cambien los filtros o los productos
  useEffect(() => {
    filterProducts();
  }, [categoryFilter, dateFilter, stockFilter, products]);

  // Datos para el gráfico
  const chartData = {
    labels: filteredProducts.map(product => product.name),
    datasets: [
      {
        label: "Cantidad Vendida",
        data: filteredProducts.map(product => product.sales || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
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

      {/* Filtros interactivos */}
      <Box mt={4} p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Filtros de Productos
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Filtrar por Categoría"
              select
              fullWidth
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="Electrónica">Electrónica</MenuItem>
              <MenuItem value="Ropa">Ropa</MenuItem>
              <MenuItem value="Hogar">Hogar</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Fecha de Agregado"
              type="date"
              fullWidth
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Cantidad Mínima en Stock"
              type="number"
              fullWidth
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Gráfico de productos más vendidos */}
      <Box mt={4} p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Ventas por Producto
        </Typography>
        <div style={{ height: "400px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Box>

      {/* Lista de Productos */}
      <Box mt={4} p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Lista de Productos
        </Typography>
        {/*}<ProductList products={filteredProducts} onDelete={handleDeleteProduct} />*/}
        {/*<ProductList products={filteredProducts} onDeleteProduct={handleDeleteProduct} onUpdateProduct={fetchProducts} />*/}
        {/* Pasamos los productos y la función setProducts a ProductList */}
        <ProductList products={filteredProducts} setProducts={setProducts} onDeleteProduct={fetchProducts}/>
      </Box>

      {/* Administración de Productos */}
      {/* Solo muestra la sección de administración de productos si el rol es "admin" */}
      {role === "admin" && (
        <Box mt={4} p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Administrar Productos
          </Typography>
          <ProductManagement onProductAdded={fetchProducts} />
        </Box>
      )}
      {/* Botón de Cerrar Sesión */}
      <Box mt={4} textAlign="center">
        <Button variant="contained" color="secondary" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
};


export default Dashboard;
