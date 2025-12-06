import { useEffect, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { getPedidos, actualizarEstadoPedido } from "../service/pedidoService";

/* 🎨 SELECT FILTRO ESTADO */
const SelectEstado = styled.select`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  background-color: white;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  appearance: none;

  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='10' viewBox='0 0 20 20' width='25' xmlns='http://www.w3.org/2000/svg'><polygon points='0,0 20,0 10,10'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
`;

/* 🎨 CONTENEDORES */
const Contenedor = styled.div`
  padding: 30px;
  background: #E4F3FA;
  min-height: 100vh;
`;

const Titulo = styled.h2`
  color: #2F4F5F;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
`;

const FiltrosWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const Filtros = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const InputFiltro = styled.input`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  outline: none;

  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.35);
  }
`;

const BotonExportar = styled.button`
  padding: 10px 16px;
  background: #2F4F5F;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #1f3644;
  }
`;

/* 🎨 TABLA */
const TablaWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background: #7EC4DD;
  color: white;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #E7EEF1;
`;

const Fila = styled.tr`
  &:nth-child(even) {
    background: #F7FBFC;
  }
`;

/* 🎨 BADGE */
const BadgeEstado = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: bold;
  background-color: ${({ estado }) =>
    estado === "Atendido" ? "rgba(40,167,69,0.15)" : "rgba(211,158,0,0.20)"};
  color: ${({ estado }) =>
    estado === "Atendido" ? "#1C7C3E" : "#8A6D00"};
`;

/* 🎨 BOTÓN DINÁMICO ESTADO */
const BotonCambiarEstado = styled.button`
  padding: 8px 14px;
  border-radius: 12px;
  border: 2px solid;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 140px;

  ${({ estado }) =>
    estado === "Atendido"
      ? `
    background: #1C7C3E;
    border-color: #1C7C3E;
    color: white;
    &:hover { background: #155f2f; }
  `
      : `
    background: #8A6D00;
    border-color: #8A6D00;
    color: white;
    &:hover { background: #6d5500; }
  `}
`;

const BotonVer = styled.button`
  padding: 8px 14px;
  border-radius: 12px;
  border: none;
  background: #007BFF;
  color: white;
  cursor: pointer;
  margin-right: 10px;
  font-weight: 600;

  &:hover {
    background: #0066d3;
  }
`;

/* 🎨 PAGINACIÓN */
const ControlesPaginacion = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const BotonPagina = styled.button`
  padding: 8px 14px;
  background: ${({ disabled }) => (disabled ? "#BFDCE6" : "#7EC4DD")};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
`;

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
export default function ListaPedidosUsuarios() {
  const [pedidos, setPedidos] = useState([]);
  const [buscarUsuario, setBuscarUsuario] = useState("");
  const [filtrarFecha, setFiltrarFecha] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 5;

  const cargarPedidos = async () => {
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (err) {
      console.log("Error cargando pedidos", err);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  /* CAMBIAR ESTADO CON UN SOLO BOTÓN */
  /* CAMBIAR ESTADO CON ALERT BONITO */
const toggleEstado = async (pedido) => {
  const nuevoEstado =
    pedido.estado === "Atendido" ? "En espera" : "Atendido";

  try {
    await actualizarEstadoPedido(pedido.id, nuevoEstado);
    cargarPedidos();

    Swal.fire({
      title: "Actualizado",
      text: "El estado fue cambiado.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#6C63FF",
    });

  } catch {
    Swal.fire({
      title: "Error",
      text: "No se pudo actualizar.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#d33",
    });
  }
};


  /*  MODAL DETALLES */
  const verDetalles = (pedido) => {
    let html = `
      <strong>Usuario:</strong> ${pedido.usuario?.nombre}<br>
      <strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString()}<br><br>
      <strong>Detalles:</strong><br>
    `;
    pedido.detalles.forEach((d) => {
      html += `• <b>${d.producto?.nombre}</b> (x${d.cantidad})<br>`;
    });

    Swal.fire({
      title: "Detalles del Pedido",
      html,
      icon: "info",
      confirmButtonText: "Cerrar",
    });
  };

  /* FILTROS */
  const filtrados = pedidos.filter((p) => {
    const coincideUsuario = p.usuario?.nombre
      ?.toLowerCase()
      .includes(buscarUsuario.toLowerCase());

    const coincideFecha = filtrarFecha
      ? new Date(p.fecha).toISOString().slice(0, 10) === filtrarFecha
      : true;

    const coincideEstado =
      estadoFiltro === "Todos" ? true : p.estado === estadoFiltro;

    return coincideUsuario && coincideFecha && coincideEstado;
  });

  /* 🎯 PAGINACIÓN */
  const indiceInicial = (paginaActual - 1) * pedidosPorPagina;
  const paginados = filtrados.slice(indiceInicial, indiceInicial + pedidosPorPagina);
  const totalPaginas = Math.ceil(filtrados.length / pedidosPorPagina);

  /* 🎯 EXPORTAR EXCEL */
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(
      filtrados.map((p) => ({
        Usuario: p.usuario?.nombre,
        Fecha: new Date(p.fecha).toLocaleString(),
        Estado: p.estado,
        Detalles: p.detalles
          ?.map((d) => `${d.producto?.nombre} (x${d.cantidad})`)
          .join(", "),
      }))
    );

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Pedidos");
    XLSX.writeFile(libro, "Reporte_Pedidos.xlsx");
  };

  return (
    <Contenedor>
      <Titulo>Lista de Pedidos de Usuarios</Titulo>

      {/* FILTROS */}
      <FiltrosWrapper>
        <Filtros>
          <InputFiltro
            type="text"
            placeholder="Buscar por usuario..."
            value={buscarUsuario}
            onChange={(e) => setBuscarUsuario(e.target.value)}
          />

          <InputFiltro
            type="date"
            value={filtrarFecha}
            onChange={(e) => setFiltrarFecha(e.target.value)}
          />

          <SelectEstado
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Atendido">Atendido</option>
            <option value="En espera">En espera</option>
          </SelectEstado>
        </Filtros>

        <BotonExportar onClick={exportarExcel}>📊 Exportar Excel</BotonExportar>
      </FiltrosWrapper>

      {/* TABLA */}
      <TablaWrapper>
        <Tabla>
          <thead>
            <tr>
              <Th>Usuario</Th>
              <Th>Fecha</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>

          <tbody>
            {paginados.map((p) => (
              <Fila key={p.id}>
                <Td>{p.usuario?.nombre}</Td>
                <Td>{new Date(p.fecha).toLocaleString()}</Td>

                <Td>
                  <BadgeEstado estado={p.estado}>{p.estado}</BadgeEstado>
                </Td>

                <Td>
                  <BotonVer onClick={() => verDetalles(p)}>
                    🔍 Ver detalles
                  </BotonVer>

                  <BotonCambiarEstado
                    estado={p.estado}
                    onClick={() => toggleEstado(p)}
                  >
                    {p.estado === "Atendido"
                      ? "Marcar En espera"
                      : "Marcar Atendido"}
                  </BotonCambiarEstado>
                </Td>
              </Fila>
            ))}
          </tbody>
        </Tabla>
      </TablaWrapper>

      {/* PAGINACIÓN */}
      <ControlesPaginacion>
        <BotonPagina
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
        >
          Anterior
        </BotonPagina>

        <span>Página {paginaActual} de {totalPaginas}</span>

        <BotonPagina
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
        >
          Siguiente 
        </BotonPagina>
      </ControlesPaginacion>
    </Contenedor>
  );
}
