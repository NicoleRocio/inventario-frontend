import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productoService";

export default function ProductoList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerProductos()
      .then(setProductos)
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Sede</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.sede}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
