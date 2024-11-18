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
    dateAdded: new Date().toISOString().split('T')[0], // Solo toma la fecha

  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Endpoint para obtener todos los productos con filtros
app.get('/api/products', (req, res) => {
  const { category, dateAdded, stock } = req.query;

  // Asegúrate de que `products` contiene los productos correctamente
  let filteredProducts = [...products];

  // Filtro por categoría
  if (category && category !== '') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  if (dateAdded && dateAdded !== '') {
    const [start, end] = dateAdded.split(",");
    if (start) {
        filteredProducts = filteredProducts.filter(product => new Date(product.dateAdded) >= new Date(start));
    }
    if (end) {
        filteredProducts = filteredProducts.filter(product => new Date(product.dateAdded) <= new Date(end));
    }
}


  // Filtro por cantidad en stock
  if (stock && !isNaN(parseInt(stock, 10))) {
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

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, category, sales } = req.body;

  const productIndex = products.findIndex(product => product.id === parseInt(id));

  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const updatedProduct = {
    ...products[productIndex],
    name,
    price,
    quantity,
    category,
    sales,
  };

  products[productIndex] = updatedProduct;

  console.log('Producto actualizado:', updatedProduct); // Verifica si el producto fue actualizado
  res.json(updatedProduct);
});


