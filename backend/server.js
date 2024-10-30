const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simulación de una base de datos
let products = [];

// Endpoint para agregar un producto
app.post('/api/products', (req, res) => {
  const { name, price, quantity } = req.body;
  const newProduct = { id: products.length + 1, name, price, quantity };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Endpoint para obtener todos los productos
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
