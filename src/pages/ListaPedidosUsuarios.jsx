import { useEffect, useState } from "react";
import styled from "styled-components";
import { getPedidos, actualizarEstadoPedido } from "../service/pedidoService";

// 🎨 Estilos
const Contenedor = styled.div`
  padding: 30px;
  background: #E4F3FA;
  min-height: 100vh;
`;

const Titulo = styled.h2`
  color: #2F4F5F;
  font-weight: 600;
  margin-bottom: 20px;
`;

const TablaWrapper = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 20px;
`;

const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  color: #2F4F5F;
`;

const Th = styled.th`
  background: #7EC4DD;
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e6eaee;
`;

const Fila = styled.tr`
  &:nth-child(even) {
    background: #F7FBFC;
  }
`;

const BadgeEstado = styled.span`
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  background-color: ${({ estado }) =>
    estado === "Atendido" ? "rgba(40,167,69,0.12)" : "rgba(211,158,0,0.15)"};
  color: ${({ estado }) =>
    estado === "Atendido" ? "#1C7C3E" : "#8A6D00"};
`;

const Boton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-right: 8px;
  font-weight: 600;
  color: white;
  background-color: ${({ tipo }) =>
    tipo === "ok" ? "#28A745" : "#D39E00"};

  &:hover {
    opacity: 0.9;
  }
`;

// 🔹 Componente principal
export default function ListaPedidosUsuarios() {
  const [pedidos, setPedidos] = useState([]);

  const cargarPedidos = async () => {
    try {
      const data = await getPedidos(); // trae TODOS los pedidos
      setPedidos(data);
    } catch (e) {
      console.error("Error cargando pedidos:", e);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      await cargarPedidos(); // refrescar tabla
    } catch (e) {
      alert("Error actualizando estado");
    }
  };

  return (
    <Contenedor>
      <Titulo>Lista de pedidos de usuarios</Titulo>

      <TablaWrapper>
        <Tabla>
          <thead>
            <tr>
              <Th>Usuario</Th>
              <Th>Fecha</Th>
              <Th>Detalles</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((p) => (
              <Fila key={p.id}>
                <Td>{p.usuario?.nombre || "—"}</Td>
                <Td>{new Date(p.fecha).toLocaleString()}</Td>
                <Td>
                  {p.detalles
                    ?.map(
                      (d) =>
                        `${d.producto?.nombre || "Producto"} (${d.cantidad})`
                    )
                    .join(", ")}
                </Td>
                <Td>
                  <BadgeEstado estado={p.estado}>{p.estado}</BadgeEstado>
                </Td>
                <Td>
                  <Boton
                    tipo="ok"
                    onClick={() => cambiarEstado(p.id, "Atendido")}
                  >
                    Marcar atendido
                  </Boton>
                  <Boton
                    tipo="espera"
                    onClick={() => cambiarEstado(p.id, "En espera")}
                  >
                    En espera
                  </Boton>
                </Td>
              </Fila>
            ))}
          </tbody>
        </Tabla>
      </TablaWrapper>
    </Contenedor>
  );
}
