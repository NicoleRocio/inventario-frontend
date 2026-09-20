const API_URL = "http://localhost:8080/api/solicitudes";

// 1. Obtener el historial de un usuario
export const getSolicitudesByUsuario = async (usuarioId) => {
  const response = await fetch(`${API_URL}/usuario/${usuarioId}`);
  
  if (!response.ok) {
    throw new Error("Error al cargar el historial de solicitudes");
  }
  return await response.json();
};

// 2. Crear una nueva solicitud
export const crearSolicitud = async (usuarioId, solicitudData) => {
  const response = await fetch(`${API_URL}/${usuarioId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(solicitudData),
  });

  if (!response.ok) {
    throw new Error("Error al registrar la solicitud");
  }
  return await response.json();
};