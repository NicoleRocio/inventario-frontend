// src/service/pedidoService.js
const API_URL = "http://localhost:8080/api/pedidos";

// 🔵 Pedidos por usuario
export const getPedidosPorUsuario = async (usuarioId) => {
  const response = await fetch(`${API_URL}/usuario/${usuarioId}`);
  if (!response.ok) throw new Error("Error al obtener pedidos del usuario");
  return await response.json();
};

// 🔵 Crear pedido (con usuario_id)
export const crearPedido = async (pedido) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  });
  if (!response.ok) throw new Error("Error al crear pedido");
  return await response.json();
};

// 🔵 Obtener todos (para pruebas)
export const getPedidos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener pedidos");
  return await response.json();
};

// 🔵 Obtener por ID
export const getPedidoById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener pedido");
  return await response.json();
};

// 🆕 Actualizar estado del pedido (En espera / Atendido)
export const actualizarEstadoPedido = async (id, estado) => {
  const response = await fetch(`${API_URL}/${id}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });

  if (!response.ok) throw new Error("Error al actualizar el estado del pedido");
  return await response.text();
};

