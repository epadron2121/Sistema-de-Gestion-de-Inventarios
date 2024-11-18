const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');  // Para trabajar con archivos
const path = require('path');
const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: 'https://sistema-de-gestion-de-inventarios-l76c.vercel.app',  // Dominio del frontend
}));

app.use(bodyParser.json());

// Ruta del archivo JSON donde se guardarán los productos
const productsFilePath = path.join(__dirname, 'products.json');

// Función para leer los productos desde el archivo JSON
const readProductsFromFile = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo el archivo de productos:', error);
    return [];
  }
};

// Función para escribir los productos en el archivo JSON
const writeProductsToFile = (products) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error escribiendo en el archivo de productos:', error);
  }
};

// Endpoint para agregar un producto
app.post('/api/products', (req, res) => {
  const { name, price, quantity, category, sales } = req.body;
  const products = readProductsFromFile();  // Leemos los productos desde el archivo
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    quantity,
    category,
    sales,
    dateAdded: new Date().toISOString().split('T')[0],
  };

  products.push(newProduct);
  writeProductsToFile(products);  // Escribimos los productos actualizados en el archivo

  res.status(201).json(newProduct);
});

// Endpoint para obtener todos los productos con filtros
app.get('/api/products', (req, res) => {
  const { category, dateAdded, stock } = req.query;
  const products = readProductsFromFile();  // Leemos los productos desde el archivo
  let filteredProducts = [...products];

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

  if (stock && !isNaN(parseInt(stock, 10))) {
    const stockLimit = parseInt(stock, 10);
    filteredProducts = filteredProducts.filter(product => product.quantity >= stockLimit);
  }

  res.json(filteredProducts);
});

// Endpoint para eliminar un producto
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const products = readProductsFromFile();  // Leemos los productos desde el archivo
  const productIndex = products.findIndex(product => product.id === parseInt(id));

  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const deletedProduct = products.splice(productIndex, 1);
  writeProductsToFile(products);  // Escribimos los productos actualizados en el archivo

  res.status(200).json(deletedProduct[0]);
});

// Endpoint para actualizar un producto
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, category, sales } = req.body;
  const products = readProductsFromFile();  // Leemos los productos desde el archivo
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
  writeProductsToFile(products);  // Escribimos los productos actualizados en el archivo

  res.json(updatedProduct);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
