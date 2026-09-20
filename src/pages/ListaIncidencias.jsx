import { useEffect, useState } from "react";
import styled from "styled-components";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { getIncidencias, actualizarEstado, eliminarIncidencia } from "../service/incidenciaService";

/* -----------------------------
   ESTILOS
----------------------------- */

const Contenedor = styled.div`
  padding: 40px;
  background-color: #E4F3FA;
  min-height: 100vh;
`;

const Titulo = styled.h2`
  text-align: center;
  color: #2F4F5F;
  margin-bottom: 30px;
  font-weight: 600;
  font-size: 1.6rem;
`;

const FiltrosWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 25px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const Filtros = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const InputFiltro = styled.input`
  padding: 10px 14px;
  border: 1.5px solid #A7D4E6;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 5px rgba(126, 196, 221, 0.35);
  }
`;

const BotonExportar = styled.button`
  padding: 12px 18px;
  background-color: #2F4F5F;
  color: white;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  &:hover {
    background-color: #22323f;
    transform: translateY(-2px);
  }
`;

const Tabla = styled.table`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.09);
`;

const Encabezado = styled.th`
  background: #7EC4DD;
  color: white;
  padding: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: left;
`;

const Fila = styled.tr`
  &:nth-child(even) {
    background: #F7FBFC;
  }
`;

const Celda = styled.td`
  padding: 12px;
  border-bottom: 1px solid #E7EEF1;
  font-size: 0.95rem;
  color: #2F4F5F;
`;

const BotonAccion = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.82rem;
  margin-right: 8px;

  ${({ tipo }) =>
    tipo === "atendido"
      ? `
    background: #1C7C3E;
    color: white;
    &:hover { background: #155f2f; }
  `
      : `
    background: #7EC4DD;
    color: #1E1E2F;
    &:hover { background: #68B1C9; }
  `}
`;

/* -----------------------------
   COMPONENTE
----------------------------- */

const ListaIncidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const incidenciasPorPagina = 5; // Puedes cambiarlo a 10 o 15 segun se prefiera



  /* 🔵 Cargar incidencias reales desde backend */
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getIncidencias();
        setIncidencias(data);
      } catch (err) {
        console.log("Error cargando incidencias", err);
      }
    };

    cargar();
  }, []);

  /* 🔵 Cambiar estado */
  const marcarComoAtendido = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "Atendido" ? "Pendiente" : "Atendido";

    try {
      const actualizada = await actualizarEstado(id, nuevoEstado);

      // Actualizar en tabla sin recargar
      setIncidencias((prev) =>
        prev.map((i) => (i.id === id ? { ...i, estado: actualizada.estado } : i))
      );
    } catch (err) {
      console.log("Error actualizando estado", err);
    }
  };

  const eliminar = async (id) => {
    Swal.fire({
      title: "¿Eliminar incidencia?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C03737",
      cancelButtonColor: "#7EC4DD",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          await eliminarIncidencia(id);

          setIncidencias(prev => prev.filter(i => i.id !== id));

          Swal.fire({
            title: "Eliminado",
            text: "La incidencia fue eliminada correctamente.",
            icon: "success",
            timer: 1800,
            showConfirmButton: false
          });

        } catch (err) {
          Swal.fire("Error", "No se pudo eliminar la incidencia.", "error");
          console.log(err);
        }
      }
    });
  };



  /* 🔵 Exportar Excel */
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(incidencias);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Incidencias");
    XLSX.writeFile(libro, "Reporte_Incidencias.xlsx");
  };

  /* 🔵 Filtrar */
  const filtradas = incidencias.filter((i) => {
    const coincideUsuario = i.usuario.nombre
      .toLowerCase()
      .includes(filtro.toLowerCase());

    let coincideFecha = true;

    if (fechaFiltro) {
      // Convertir yyyy-mm-dd → dd/mm/yyyy
      const [yyyy, mm, dd] = fechaFiltro.split("-");
      const fechaFormateada = `${dd}/${mm}/${yyyy}`;
      coincideFecha = i.fecha === fechaFormateada;
    }

    return coincideUsuario && coincideFecha;
  });
  // Calcular índices
  const indiceInicial = (paginaActual - 1) * incidenciasPorPagina;
  const indiceFinal = indiceInicial + incidenciasPorPagina;

  // Datos filtrados + paginados
  const paginadas = filtradas.slice(indiceInicial, indiceFinal);

  // Total de páginas
  const totalPaginas = Math.ceil(filtradas.length / incidenciasPorPagina);



  return (
    <Contenedor>
      <Titulo>Lista de Incidencias</Titulo>

      {/* FILTROS + EXPORTAR */}
      <FiltrosWrapper>
        <Filtros>
          <InputFiltro
            type="text"
            placeholder="Filtrar por usuario..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <InputFiltro
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </Filtros>

        <BotonExportar onClick={exportarExcel}>📊 Exportar Excel</BotonExportar>
      </FiltrosWrapper>

      {/* TABLA */}
      <Tabla>
        <thead>
          <tr>
            <Encabezado>Usuario</Encabezado>
            <Encabezado>Área</Encabezado>
            <Encabezado>Descripción</Encabezado>
            <Encabezado>Fecha</Encabezado>
            <Encabezado>Hora</Encabezado>
            <Encabezado>Estado</Encabezado>
            <Encabezado>Acciones</Encabezado>
          </tr>
        </thead>

        <tbody>
          {paginadas.map((i) => (
            <Fila key={i.id}>
              <Celda>{i.usuario.nombre}</Celda>
              <Celda>{i.area}</Celda>
              <Celda>{i.descripcion}</Celda>
              <Celda>{i.fecha}</Celda>
              <Celda>{i.hora}</Celda>
              <Celda>{i.estado}</Celda>

              <Celda>
                <BotonAccion
                  tipo={i.estado === "Atendido" ? "pendiente" : "atendido"}
                  onClick={() => marcarComoAtendido(i.id, i.estado)}
                >
                  {i.estado === "Atendido" ? "Pendiente" : "Atendido"}
                </BotonAccion>

                <BotonAccion
                  tipo="eliminar"
                  onClick={() => eliminar(i.id)}
                  style={{ background: "#C03737", color: "white" }}
                >
                  Eliminar
                </BotonAccion>
              </Celda>

            </Fila>
          ))}
        </tbody>
      </Tabla>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "25px",
          gap: "12px"
        }}
      >
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
          style={{
            padding: "10px 18px",
            background: paginaActual === 1 ? "#BFDCE6" : "#7EC4DD",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: paginaActual === 1 ? "not-allowed" : "pointer",
            color: "#2F4F5F",
            transition: "0.25s",
            boxShadow:
              paginaActual === 1 ? "none" : "0 2px 6px rgba(0,0,0,0.15)"
          }}
          onMouseEnter={(e) => {
            if (paginaActual > 1)
              e.target.style.background = "#68B1C9";
          }}
          onMouseLeave={(e) => {
            if (paginaActual > 1)
              e.target.style.background = "#7EC4DD";
          }}
        >
          Anterior
        </button>

        <span
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#2F4F5F"
          }}
        >
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
          style={{
            padding: "10px 18px",
            background:
              paginaActual === totalPaginas ? "#BFDCE6" : "#7EC4DD",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor:
              paginaActual === totalPaginas ? "not-allowed" : "pointer",
            color: "#2F4F5F",
            transition: "0.25s",
            boxShadow:
              paginaActual === totalPaginas
                ? "none"
                : "0 2px 6px rgba(0,0,0,0.15)"
          }}
          onMouseEnter={(e) => {
            if (paginaActual < totalPaginas)
              e.target.style.background = "#68B1C9";
          }}
          onMouseLeave={(e) => {
            if (paginaActual < totalPaginas)
              e.target.style.background = "#7EC4DD";
          }}
        >
          Siguiente 
        </button>
      </div>


    </Contenedor>
  );
};

export default ListaIncidencias;
