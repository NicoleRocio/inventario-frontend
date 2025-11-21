import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

/* Animación suave */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.4s ease;
  background: #E4F3FA;
  min-height: 100vh;
`;

const Card = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 750px;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Header = styled.div`
  text-align: center;
  border-bottom: 2px solid #E4F3FA;
  padding-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  color: #2F4F5F;
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 3px 0 0 0;
  color: #63838F;
  font-size: 0.95rem;
`;

/* ----------- FORMULARIO ----------- */

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.93rem;
  font-weight: 600;
  color: #2F4F5F;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  background: #FFFFFF;
  outline: none;
  font-size: 1rem;
  transition: 0.25s;

  &:focus {
    background: #ffffff;
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.35);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  background: #FFFFFF;
  outline: none;
  resize: none;
  height: 130px;
  transition: 0.25s;

  &:focus {
    background: #ffffff;
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.35);
  }
`;

const FileInput = styled.input`
  border: 1.5px dashed #A7D4E6;
  border-radius: 12px;
  padding: 12px;
  background: #F3FAFD;
  cursor: pointer;
  color: #466974;

  &::file-selector-button {
    background: #7EC4DD;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 10px;
    margin-right: 10px;
    cursor: pointer;
    transition: 0.25s;
  }

  &::file-selector-button:hover {
    background: #68B1C9;
  }
`;

const InfoFile = styled.p`
  font-size: 0.9rem;
  color: #5A6C73;
`;

const SubmitButton = styled.button`
  background: #7EC4DD;
  color: white;
  padding: 14px;
  width: 100%;
  max-width: 220px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1.05rem;
  align-self: center;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: #68B1C9;
    transform: translateY(-2px);
  }
`;

/* ----------- TABLA HISTORIAL (IGUAL QUE MISPEDIDOS) ----------- */

const TableWrapper = styled.div`
  margin-top: 35px;
  max-width: 900px;
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  color: #2F4F5F;
`;

const Th = styled.th`
  background: #7EC4DD;
  color: white;
  padding: 12px;
  font-weight: 700;
  text-align: left;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #F7FBFC;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #E7EEF1;
`;

const FileLink = styled.a`
  color: #0073e6;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

/* ----------- COMPONENTE PRINCIPAL ----------- */

const Justificaciones = () => {
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [justificaciones, setJustificaciones] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("justificaciones")) || [];
    setJustificaciones(data);
  }, []);

  const handleArchivo = (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      setArchivo(file);
    } else {
      alert("Solo se permiten PDF menores a 5 MB");
      e.target.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fecha || !motivo || !detalle || !archivo) {
      alert("Por favor completa todos los campos y sube un PDF.");
      return;
    }

    const fileURL = URL.createObjectURL(archivo);

    const nuevaJustificacion = {
      id: Date.now(),
      fecha,
      motivo,
      detalle,
      archivo: { nombre: archivo.name, url: fileURL },
    };

    const updated = [...justificaciones, nuevaJustificacion];
    setJustificaciones(updated);
    localStorage.setItem("justificaciones", JSON.stringify(updated));

    setFecha("");
    setMotivo("");
    setDetalle("");
    setArchivo(null);
  };

  return (
    <Page>
      <Card>
        <Header>
          <Title>Registro de Justificaciones</Title>
          <Subtitle>Adjunte un PDF y complete la información</Subtitle>
        </Header>

        <form onSubmit={handleSubmit}>
          <Section>

            <FieldGroup>
              <Label>Fecha del evento</Label>
              <Input type="date" value={fecha} onChange={(e)=>setFecha(e.target.value)} />
            </FieldGroup>

            <FieldGroup>
              <Label>Motivo</Label>
              <Input
                type="text"
                placeholder="Ejemplo: Cita médica"
                value={motivo}
                onChange={(e)=>setMotivo(e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Detalle</Label>
              <TextArea
                placeholder="Explique brevemente el motivo..."
                value={detalle}
                onChange={(e)=>setDetalle(e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label>Adjuntar PDF</Label>
              <FileInput type="file" accept="application/pdf" onChange={handleArchivo} />
              {archivo && <InfoFile>📎 {archivo.name}</InfoFile>}
            </FieldGroup>

            <SubmitButton type="submit">Enviar Justificación</SubmitButton>
          </Section>
        </form>
      </Card>

      {/* ----------- TABLA HISTORIAL ----------- */}
      {justificaciones.length > 0 && (
        <TableWrapper>
          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#2F4F5F" }}>
            Historial de Justificaciones
          </h3>

          <Table>
            <thead>
              <tr>
                <Th>Fecha</Th>
                <Th>Motivo</Th>
                <Th>Detalle</Th>
                <Th>Archivo</Th>
              </tr>
            </thead>

            <tbody>
              {justificaciones.map((j) => (
                <Tr key={j.id}>
                  <Td>{j.fecha}</Td>
                  <Td>{j.motivo}</Td>
                  <Td>{j.detalle}</Td>
                  <Td>
                    <FileLink href={j.archivo.url} target="_blank">
                      {j.archivo.nombre}
                    </FileLink>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Page>
  );
};

export default Justificaciones;
