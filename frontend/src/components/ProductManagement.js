import React, { useState } from "react"; 
import { TextField, Button, Snackbar, Alert, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const ProductManagement = ({ onProductAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sales, setSales] = useState(0);  // Nuevo estado para cantidad vendida
  const [category, setCategory] = useState(""); // Nuevo estado para la categoría
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (price <= 0 || quantity <= 0 || !category) {
      setError("El precio, la cantidad y la categoría son obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://sistema-de-gestion-de-inventarios-4vgy.vercel.app/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          quantity: Number(quantity),
          category,
          sales: Number(sales),  // Enviamos el campo sales
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la creación del producto");
      }

      const data = await response.json();
      console.log("Producto Agregado:", data);

      // Reinicia los campos del formulario
      setName("");
      setPrice("");
      setQuantity("");
      setSales("");  // Reinicia el campo sales
      setCategory("");  // Reinicia el campo de categoría
      setError(null);
      setSuccess(true);

      // Actualiza la lista de productos
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <form onSubmit={handleAddProduct}>
      <TextField
        label="Nombre del Producto"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Precio"
        type="number"
        variant="outlined"
        placeholder="Ej. 100.00"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        fullWidth
        margin="normal"
        inputProps={{ min: "0.01", step: "0.01" }}
      />
      <TextField
        label="Cantidad"
        type="number"
        variant="outlined"
        placeholder="Ej. 10"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        fullWidth
        margin="normal"
        inputProps={{ min: "1" }}
      />

      <TextField
        label="Cantidad Vendida"
        type="number"
        variant="outlined"
        placeholder="Ej. 5"
        value={sales}
        onChange={(e) => setSales(e.target.value)}
        required
        fullWidth
        margin="normal"
        inputProps={{ min: "0" }}
      />

      {/* Campo para seleccionar la categoría */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Categoría</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          label="Categoría"
          required
        >
          <MenuItem value="Electrónica">Electrónica</MenuItem>
          <MenuItem value="Ropa">Ropa</MenuItem>
          <MenuItem value="Hogar">Hogar</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Agregar Producto
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Snackbar para mensajes de éxito/error */}
      <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Producto agregado con éxito.
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default ProductManagement;
