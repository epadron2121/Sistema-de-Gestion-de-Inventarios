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
  const { name, price, quantity, category, sales } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    quantity,
    category,  // Categoria agregada
    sales,
    dateAdded: new Date().toISOString(),  // Fecha de creación del producto
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Endpoint para obtener todos los productos con filtros
app.get('/api/products', (req, res) => {
  const { category, dateAdded, stock } = req.query;

  let filteredProducts = [...products];

  // Filtro por categoría
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  // Filtro por fecha de adición (si se proporciona en formato YYYY-MM-DD)
  if (dateAdded) {
    filteredProducts = filteredProducts.filter(product => {
      return product.dateAdded.startsWith(dateAdded); // Solo coincide con el año, mes y día
    });
  }

  // Filtro por cantidad en stock (si se proporciona)
  if (stock) {
    const stockLimit = parseInt(stock, 10);
    filteredProducts = filteredProducts.filter(product => product.quantity >= stockLimit);
  }

  res.json(filteredProducts);
});

// Endpoint para eliminar un producto
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(product => product.id === parseInt(id));

  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Eliminar el producto de la lista
  const deletedProduct = products.splice(productIndex, 1);
  
  res.status(200).json(deletedProduct[0]);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
