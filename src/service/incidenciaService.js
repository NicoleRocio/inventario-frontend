// src/service/incidenciaService.js

const API_URL = "http://localhost:8080/api/incidencias";

// 🟦 Registrar nueva incidencia
export const crearIncidencia = async (incidencia) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incidencia),
  });

  if (!response.ok) {
    throw new Error("Error al crear incidencia");
  }

  return await response.json();
};

// 🟦 Obtener incidencias por usuario
export const getIncidenciasPorUsuario = async (usuarioId) => {
  const response = await fetch(`${API_URL}/usuario/${usuarioId}`);

  if (!response.ok) {
    throw new Error("Error al obtener incidencias");
  }

  return await response.json();
};

// 🟦 Obtener TODAS las incidencias (para administrador)
export const getIncidencias = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener todas las incidencias");
  }

  return await response.json();
};

// 🟦 Actualizar estado de una incidencia
export const actualizarEstado = async (id, estado) => {
  const response = await fetch(`${API_URL}/${id}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar estado");
  }

  return await response.json();
};

// 🟦 (Opcional) Eliminar incidencia si lo agregas en backend luego
export const eliminarIncidencia = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar incidencia");
  }

  return true;
};
