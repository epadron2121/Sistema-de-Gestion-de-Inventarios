import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, CardActions, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const ProductList = ({ products, onDeleteProduct }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        const response = await fetch(`http://localhost:5000/api/products/${selectedProduct.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }

        // Llamar a la función onDeleteProduct para actualizar la lista de productos
        if (onDeleteProduct) {
          onDeleteProduct(selectedProduct.id); // Esto eliminará el producto de la lista
        }

        handleCloseDialog();
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  return (
    <div>
      <Grid container spacing={4} style={{ marginTop: "20px" }}>
        {products.map((product) => (
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
              </CardContent>

              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button size="small" color="primary" variant="outlined">Editar</Button>
                <Button size="small" color="secondary" onClick={() => handleDeleteClick(product)} variant="outlined">
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
    </div>
  );
};

export default ProductList;
