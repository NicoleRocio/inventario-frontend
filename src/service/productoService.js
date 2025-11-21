// src/service/productoService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/productos";

// ✅ Obtener productos
export const getProductos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ✅ Crear producto con imagen
export const crearProducto = async (producto, imagen) => {
  const formData = new FormData();

  formData.append(
    "producto",
    new Blob([JSON.stringify(producto)], { type: "application/json" })
  );

  if (imagen) {
    formData.append("imagen", imagen);
  }

  const response = await axios.post(`${API_URL}/crear`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ✅ Eliminar producto
export const eliminarProducto = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

// ✅ Reducir stock (CORREGIDO)
export const reducirStock = async (id, cantidad) => {
  const response = await axios.put(
    `${API_URL}/reducir-stock/${id}/${cantidad}`
  );
  return response.data;
};

