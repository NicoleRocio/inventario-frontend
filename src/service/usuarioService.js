// src/service/usuarioService.js
const API_URL = "http://localhost:8080/api/usuarios";

//  Obtener todos los usuarios
export const getUsuarios = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener usuarios");
  return await response.json();
};

//  Crear nuevo usuario
export const crearUsuario = async (usuario) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!response.ok) throw new Error("Error al crear usuario");
  return await response.json();
};

//  Obtener usuario por ID
export const getUsuarioById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener usuario");
  return await response.json();
};

//  Nuevo: iniciar sesión (login)
export const loginUsuario = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 401) throw new Error("Contraseña incorrecta");
    if (response.status === 404) throw new Error("Usuario no encontrado");
    if (!response.ok) throw new Error("Error al iniciar sesión");

    return await response.json(); // Devuelve el usuario completo
  } catch (error) {
    throw new Error(error.message || "Error al conectar con el servidor");
  }

};

  //  NUEVO: Obtener resumen para el Dashboard
export const getResumenUsuario = async (id) => {
  try {
    // Llama al endpoint que acabamos de crear en Java
    const response = await fetch(`${API_URL}/${id}/dashboard`);
    if (!response.ok) throw new Error("Error al obtener datos del dashboard");
    return await response.json(); 
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Cambiar contraseña
export const cambiarPassword = async (id, currentPassword, newPassword) => {
  const response = await fetch(`${API_URL}/${id}/cambiar-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (response.status === 401) throw new Error("La contraseña actual no coincide");
  if (!response.ok) throw new Error("Error al cambiar la contraseña");
  
  return await response.text();
};


//  Obtener lista de roles (para llenar el select)
export const getRoles = async () => {
  const response = await fetch(`${API_URL}/roles`); 
  if (!response.ok) throw new Error("Error al obtener roles");
  return await response.json();
};

//  Registrar usuario nuevo (Enviando el DTO correcto)
export const registrarUsuario = async (datosUsuario) => {
  const response = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosUsuario),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || "Error al registrar usuario");
  }
  return await response.text();
};


