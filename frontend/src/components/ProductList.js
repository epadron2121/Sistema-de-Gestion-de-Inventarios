import React from "react";
import { Grid, Card, CardContent, Typography, CardActions, Button } from "@mui/material";

const ProductList = ({ products }) => {
  return (
    <Grid container spacing={4} style={{ marginTop: "20px" }}>
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ backgroundColor: "#f9f9f9", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{product.name}</Typography>
              <Typography color="textSecondary">  Precio: ${Number(product.price).toFixed(2) || "N/A"}</Typography>

              <Typography color={product.quantity < 5 ? "error" : "textSecondary"}>
                Cantidad: {product.quantity}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">Editar</Button>
              <Button size="small" color="secondary">Eliminar</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
