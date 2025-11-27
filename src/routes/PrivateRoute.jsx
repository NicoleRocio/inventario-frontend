import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch (e) {
    console.error("Error al leer usuario:", e);
    return <Navigate to="/login" replace />;
  }

  // 🔹 Validar usuario válido
  if (!usuario || !usuario.id) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
