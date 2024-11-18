import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, CardActions, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';


import { useAuth } from '../AuthContext';
import { format, parseISO } from 'date-fns';

const ProductList = ({ products, onDeleteProduct, setProducts  }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [startDate, setStartDate] = useState(""); // Fecha inicial del filtro
  const [endDate, setEndDate] = useState(""); // Fecha final del filtro
  const { role } = useAuth(); // Obtén el rol del usuario
  const [editProduct, setEditProduct] = useState(null); // Estado para el producto que se edita

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      try {
        const response = await fetch(`https://sistema-de-gestion-de-inventarios-4vgy.vercel.app/api/products/${selectedProduct.id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }
  
        // Aquí, después de la eliminación, obtienes nuevamente los productos
        //await fetchProducts(); // Actualiza la lista de productos

        // Llama a la función que obtendrá los productos actualizados
        onDeleteProduct(); // Llama a fetchProducts para actualizar la lista de productos
  
        handleCloseDialog(); // Cierra el diálogo
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };
  

  const handleEditClick = (product) => {
    setEditProduct(product);
  };

  const handleCloseEditDialog = () => {
    setEditProduct(null); // Cerrar el formulario de edición
  };

  const handleSaveEdit = async () => {
    if (editProduct) {
      try {
        const response = await fetch(`https://sistema-de-gestion-de-inventarios-4vgy.vercel.app/api/products/${editProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProduct),
        });
  
        if (!response.ok) {
          throw new Error("Error al editar el producto");
        }
  
        const updatedData = await response.json();
  
        // Aquí debes actualizar la lista de productos en el estado del componente padre
        const updatedProducts = products.map((product) =>
          product.id === updatedData.id ? updatedData : product
        );
  
        // Actualizar el estado de los productos en el componente Dashboard
        setProducts(updatedProducts); // Usar setProducts para actualizar el estado local
  
        handleCloseEditDialog(); // Cerrar el formulario de edición
      } catch (error) {
        console.error("Error al editar el producto:", error);
      }
    }
  };
  

  // Filtrar productos por rango de fecha
  const filteredProducts = products.filter((product) => {
    const productDate = new Date(product.dateAdded);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && productDate < start) return false;
    if (end && productDate > end) return false;
    return true;
  });

  // Condiciones para habilitar/deshabilitar
  const isAdmin = role === 'admin'; // Si el rol es 'admin', habilita los botones

  return (
    <div>
      <Grid container spacing={4} style={{ marginTop: "20px" }}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ backgroundColor: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "16px" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                  {product.name}
                </Typography>
                <Typography color="textSecondary" sx={{ marginBottom: "8px" }}>
                  <strong>Precio:</strong> ${Number(product.price).toFixed(2) || "N/A"}
                </Typography>
                <Typography color={product.quantity < 5 ? "error" : "textSecondary"} sx={{ marginBottom: "8px" }}>
                  <strong>Cantidad en Inventario:</strong> {product.quantity}
                </Typography>
                <Typography color="textSecondary" sx={{ marginBottom: "8px" }}>
                  <strong>Cantidad Vendida:</strong> {product.sales || 0}
                </Typography>
                <Typography color="textSecondary" sx={{ marginBottom: "16px" }}>
                  <strong>Categoría:</strong> {product.category || "N/A"}
                </Typography>
                <Typography color="textSecondary" sx={{ marginBottom: "8px" }}>
                  <strong>Fecha Agregado:</strong> {format(parseISO(product.dateAdded), 'dd/MM/yyyy')}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button size="small" color="primary" variant="outlined" disabled={!isAdmin} onClick={() => handleEditClick(product)}>
                  Editar
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDeleteClick(product)} variant="outlined" disabled={!isAdmin}>
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de confirmación para eliminar producto */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar el producto <strong>{selectedProduct?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar el producto */}
      <Dialog open={!!editProduct} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          {editProduct && (
            <>
              <TextField
                label="Nombre"
                fullWidth
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Precio"
                type="number"
                fullWidth
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                margin="normal"
              />
              <TextField
                label="Cantidad"
                type="number"
                fullWidth
                value={editProduct.quantity}
                onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
                margin="normal"
              />
               <TextField
                label="Cantidad Vendida:"
                type="number"
                fullWidth
                value={editProduct.sales}
                onChange={(e) => setEditProduct({ ...editProduct, sales: e.target.value })}
                margin="normal"
              /> 
              {/* Campo para seleccionar la categoría */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoría</InputLabel>
                <Select
                  label="Categoría"
                  value={editProduct.category}  // El valor es controlado por editProduct.category
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}  // Actualiza la categoría seleccionada
                >
                  <MenuItem value="Electrónica">Electrónica</MenuItem>
                  <MenuItem value="Ropa">Ropa</MenuItem>
                  <MenuItem value="Hogar">Hogar</MenuItem>
                </Select>
              </FormControl>
    
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} color="secondary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductList;
