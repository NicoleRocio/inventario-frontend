import { useEffect, useState } from "react";
import styled from "styled-components";
import * as XLSX from "xlsx";

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

/* WRAPPER QUE UNE FILTROS + EXPORTAR */
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

/* Caja de los dos filtros */
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

/* BOTÓN EXPORTAR */
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

/* TABLA */
const Tabla = styled.table`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: white;
  /*border-radius: 0px;*/
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(247, 240, 240, 0.09);
`;

const Encabezado = styled.th`
  background: #7EC4DD;
  color: #F7FBFC;
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

/* BOTONES DE ACCIÓN */
const BotonAccion = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  font-size: 0.82rem;
  margin-right: 8px;

  ${({ tipo }) =>
    tipo === "atendido"
      ? `
        background: #1C7C3E;
        color: white;
        &:hover { background: #155f2f; }
      `
      : tipo === "pendiente"
      ? `
        background: #7EC4DD;
        color: #1E1E2F;
        &:hover { background: #68B1C9; }
      `
      : tipo === "eliminar"
      ? `
        background: #C03737;
        color: white;
        &:hover { background: #a92f2f; }
      `
      : `
        background: #2F4F5F;
        color: white;
        &:hover { background: #22323f; }
      `}
`;

/* -----------------------------
   COMPONENTE
----------------------------- */

const ListaIncidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("incidencias")) || [];
    setIncidencias(guardadas);
  }, []);

  const marcarComoAtendido = (index) => {
    const nuevas = [...incidencias];
    nuevas[index].estado =
      nuevas[index].estado === "Atendido" ? "Pendiente" : "Atendido";
    setIncidencias(nuevas);
    localStorage.setItem("incidencias", JSON.stringify(nuevas));
  };

  const eliminarIncidencia = (index) => {
    const nuevas = incidencias.filter((_, i) => i !== index);
    setIncidencias(nuevas);
    localStorage.setItem("incidencias", JSON.stringify(nuevas));
  };

  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(incidencias);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Incidencias");
    XLSX.writeFile(libro, "Reporte_Incidencias.xlsx");
  };

  const filtradas = incidencias.filter(
    (i) =>
      i.usuario.toLowerCase().includes(filtro.toLowerCase()) &&
      (fechaFiltro ? i.fecha === fechaFiltro : true)
  );

  return (
    <Contenedor>
      <Titulo> Lista de Incidencias</Titulo>

      {/* FILTROS Y EXPORTAR */}
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

        <BotonExportar onClick={exportarExcel}>
          📊 Exportar Excel
        </BotonExportar>

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
          {filtradas.map((i, index) => (
            <Fila key={index}>
              <Celda>{i.usuario}</Celda>
              <Celda>{i.area}</Celda>
              <Celda>{i.descripcion}</Celda>
              <Celda>{i.fecha}</Celda>
              <Celda>{i.hora}</Celda>
              <Celda>{i.estado}</Celda>

              <Celda>
                <BotonAccion
                  tipo={i.estado === "Atendido" ? "pendiente" : "atendido"}
                  onClick={() => marcarComoAtendido(index)}
                >
                  {i.estado === "Atendido" ? "Pendiente" : "Atendido"}
                </BotonAccion>

                <BotonAccion
                  tipo="eliminar"
                  onClick={() => eliminarIncidencia(index)}
                >
                  Eliminar
                </BotonAccion>
              </Celda>
            </Fila>
          ))}
        </tbody>
      </Tabla>
    </Contenedor>
  );
};

export default ListaIncidencias;
