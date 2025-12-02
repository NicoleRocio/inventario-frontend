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
