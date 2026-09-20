import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { getAsistencias } from "../service/asistenciaService";

/* Animación suave */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 35px;
  animation: ${fadeIn} 0.4s ease;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

/* Título */
const Title = styled.h2`
  font-weight: 600;
  color: #2F4F5F;
  text-align: center;
  font-size: 1.6rem;
`;

/* Zona de filtros */
const Filters = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2F4F5F;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  outline: none;
  transition: 0.25s;

  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.4);
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  outline: none;

  &:focus {
    border-color: #7EC4DD;
  }
`;

const TableBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  overflow-x: auto;
`;

/* Tabla */
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background: #E4F3FA;
  color: #2F4F5F;
  font-weight: 700;
  text-align: left;
  border-bottom: 2px solid #A7D4E6;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
  color: #2F4F5F;
`;

/* Badge de estado */
const EstadoBadge = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  color: white;

  background: ${({ estado }) =>
    estado === "Presente" ? "#28a745"
    : estado === "Tarde" ? "#ff9800"
    : estado === "Falta" ? "#e53935"
    : "#7EC4DD"};
`;

const ButtonExport = styled.button`
  background-color: #7EC4DD;
  color: white;
  font-weight: 600;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  align-self: center;
  transition: 0.25s;

  &:hover {
    background-color: #68B1C9;
    transform: translateY(-2px);
  }
`;

const Asistencia = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    if (u) setUsuario(u);

    getAsistencias().then(setAsistencias);
  }, []);

  const filtradas = asistencias.filter((a) => {
    if (!usuario) return false;
    if (a.empleado?.nombre !== usuario.nombre) return false;

    const fecha = a.fecha;

    if (fechaInicio && fecha < fechaInicio) return false;
    if (fechaFin && fecha > fechaFin) return false;

    if (estado && a.estado !== estado) return false;

    return true;
  });

  return (
    <Container>
      <Title>Registro de Asistencias</Title>

      {/* Filtros */}
      <Filters>
        <div>
          <Label>Desde:</Label>
          <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        </div>

        <div>
          <Label>Hasta:</Label>
          <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        </div>

        <div>
          <Label>Estado:</Label>
          <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="Presente">Presente</option>
            <option value="Tarde">Tarde</option>
            <option value="Falta">Falta</option>
          </Select>
        </div>
      </Filters>

      {/* Tabla */}
      <TableBox>
        <Table>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Ingreso</Th>
              <Th>Salida</Th>
              <Th>Estado</Th>
            </tr>
          </thead>

          <tbody>
            {filtradas.map((a) => (
              <tr key={a.id}>
                <Td>{a.fecha}</Td>
                <Td>{a.horaIngreso || "-"}</Td>
                <Td>{a.horaSalida || "-"}</Td>
                <Td>
                  <EstadoBadge estado={a.estado}>{a.estado}</EstadoBadge>
                </Td>
              </tr>
            ))}

            {filtradas.length === 0 && (
              <tr>
                <Td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                  No hay registros
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableBox>

      <ButtonExport>📄 Exportar reporte</ButtonExport>
    </Container>
  );
};

export default Asistencia;
