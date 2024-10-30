import React, { useState } from "react";

const ProductManagement = ({ onProductAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price: Number(price), quantity: Number(quantity) }),
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
      <input
        type="text"
        placeholder="Nombre del Producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Precio"
        value={price || ""}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Cantidad"
        value={quantity || ""}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <button type="submit">Agregar Producto</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default ProductManagement;
