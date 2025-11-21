import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const usuario = localStorage.getItem("usuario");

  // 🔹 Si no hay usuario logueado, redirige al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Si hay sesión, renderiza el contenido normal
  return <Outlet />;
};

export default PrivateRoute;
