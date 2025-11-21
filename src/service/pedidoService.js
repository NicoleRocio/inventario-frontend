// src/service/pedidoService.js
const API_URL = "http://localhost:8080/api/pedidos";

// ✅ Obtener todos los pedidos
export const getPedidos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener pedidos");
  return await response.json();
};

// ✅ Crear un nuevo pedido con sus detalles
export const crearPedido = async (pedido) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  });
  if (!response.ok) throw new Error("Error al crear pedido");
  return await response.json();
};

// ✅ Obtener un pedido por ID
export const getPedidoById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener pedido");
  return await response.json();
};
