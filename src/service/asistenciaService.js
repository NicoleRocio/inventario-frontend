const API_URL = "http://localhost:8080/api/asistencias";

export const getAsistencias = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener asistencias");
  return await response.json();
};

export const crearAsistencia = async (asistencia) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(asistencia),
  });
  if (!response.ok) throw new Error("Error al crear asistencia");
  return await response.json();
};
