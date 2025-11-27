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
import PrivateRoute from "./PrivateRoute"; // 🔹 Importa el nuevo archivo
import CrearProducto from "../pages/CrearProducto";
import MisProductos from "../pages/MisProductos";
import ListaPedidosUsuarios from "../pages/ListaPedidosUsuarios";



const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* 🔹 Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔹 Login (público) */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/pedidos" element={<Mispedidos />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/justificaciones" element={<Justificaciones />} />
            <Route path="/generar-incidencia" element={<GenerarIncidencia />} />
            <Route path="/lista-incidencias" element={<ListaIncidencias />} />
            <Route path="/crear-producto" element={<CrearProducto />} />
            <Route path="/mis-productos" element={<MisProductos />} />
            <Route path="/pedidos-usuarios" element={<ListaPedidosUsuarios />} />
          </Route>
        </Route>

        {/* 🔹 Cualquier ruta inválida */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
