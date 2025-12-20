import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Inventario from "../pages/Inventario";
import Mispedidos from "../pages/MisPedidos";
import Asistencia from "../pages/Asistencia";
import Justificaciones from "../pages/Justificaciones";
import Login from "../pages/Login";
import GenerarIncidencia from "../pages/GenerarIncidencia";
import ListaIncidencias from "../pages/ListaIncidencias";
import PrivateRoute from "./PrivateRoute";
import CrearProducto from "../pages/CrearProducto";
import MisProductos from "../pages/MisProductos";
import ListaPedidosUsuarios from "../pages/ListaPedidosUsuarios";
import Perfil from "../pages/Perfil";
import CambiarPassword from "../pages/CambiarPassword";
import CrearUsuario from "../pages/CrearUsuario";

// 👇 1. CREAMOS EL GUARDIÁN PARA ADMINISTRADORES
const AdminRoute = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  // Verificamos si tiene el rol exacto
  const esAdmin = usuario?.roles?.includes("ADMINISTRATIVO");

  // Si es admin, muestra la página. Si no, lo manda al Home.
  return esAdmin ? children : <Navigate to="/home" replace />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* 🔹 Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔹 Login (público) */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 Rutas protegidas (Requieren Login) */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>

            {/* --- RUTAS PARA TODOS (Docentes, Admins, etc) --- */}
            <Route path="/home" element={<Home />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/pedidos" element={<Mispedidos />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/justificaciones" element={<Justificaciones />} />
            <Route path="/generar-incidencia" element={<GenerarIncidencia />} />
            <Route path="/mis-productos" element={<MisProductos />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/cambiar-password" element={<CambiarPassword />} />

            {/* --- 🔒 RUTAS SOLO PARA ADMINISTRADORES (Nicole) --- */}

            <Route
              path="/crear-producto"
              element={
                <AdminRoute>
                  <CrearProducto />
                </AdminRoute>
              }
            />

            <Route
              path="/lista-incidencias"
              element={
                <AdminRoute>
                  <ListaIncidencias />
                </AdminRoute>
              }
            />

            <Route
              path="/pedidos-usuarios"
              element={
                <AdminRoute>
                  <ListaPedidosUsuarios />
                </AdminRoute>
              }
            />
            <Route
              path="/crear-usuario"
              element={
                <AdminRoute>
                  <CrearUsuario />
                </AdminRoute>
              }
            />

          </Route>
        </Route>

        {/* 🔹 Cualquier ruta inválida */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;