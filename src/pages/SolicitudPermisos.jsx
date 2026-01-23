import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Swal from "sweetalert2";
// 👇 IMPORTAMOS EL SERVICIO NUEVO
import { getSolicitudesByUsuario, crearSolicitud } from "../service/solicitudService";

// --- ESTILOS MODERNOS ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

const Page = styled.div`
  padding: 40px; display: flex; flex-direction: column; align-items: center;
  animation: ${fadeIn} 0.5s ease; background: #F0F4F8; min-height: 100vh;
`;

const Container = styled.div`
  width: 100%; max-width: 950px; display: flex; flex-direction: column; gap: 30px;
`;

// Tarjeta del Formulario
const FormCard = styled.div`
  background: white; padding: 35px; border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-top: 5px solid #2F4F5F;
`;

const Header = styled.div` margin-bottom: 25px; text-align: center; `;
const Title = styled.h2` color: #2F4F5F; margin: 0; font-size: 1.8rem; `;
const Subtitle = styled.p` color: #666; font-size: 0.95rem; margin-top: 5px; `;

const FormGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 25px;
  @media(max-width: 700px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const Label = styled.label` font-size: 0.9rem; font-weight: 600; color: #444; `;

const Input = styled.input`
  padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 1rem; transition: 0.2s; background: #FAFAFA;
  &:focus { border-color: #7EC4DD; background: white; outline: none; box-shadow: 0 0 0 3px rgba(126,196,221,0.2); }
`;

const Select = styled.select`
  padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 1rem; background: #FAFAFA;
  &:focus { border-color: #7EC4DD; outline: none; }
`;

const TextArea = styled.textarea`
  padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 1rem; resize: none; height: 100px; grid-column: span 2; background: #FAFAFA;
  &:focus { border-color: #7EC4DD; background: white; outline: none; }
  @media(max-width: 700px) { grid-column: span 1; }
`;

// Switch para cambiar entre Días y Horas
const SwitchContainer = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 20px; background: #E8F4FA; padding: 15px; border-radius: 10px;
`;
const SwitchLabel = styled.span` font-weight: 600; color: #2F4F5F; `;
const Checkbox = styled.input` transform: scale(1.5); cursor: pointer; `;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2F4F5F 0%, #1e3642 100%);
  color: white; padding: 16px; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-top: 15px; width: 100%; transition: transform 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(47, 79, 95, 0.3); }
`;

// Tabla de Historial
const TableCard = styled.div`
  background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
`;
const Table = styled.table` width: 100%; border-collapse: collapse; margin-top: 15px; `;
const Th = styled.th` background: #F0FAFD; color: #2F4F5F; padding: 15px; text-align: left; font-size: 0.9rem; border-bottom: 2px solid #D1E9F6; `;
const Td = styled.td` padding: 15px; border-bottom: 1px solid #eee; font-size: 0.95rem; color: #555; `;

const StatusBadge = styled.span`
  padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;
  background: ${({ status }) => status === 'Aprobado' ? '#D4EDDA' : status === 'Rechazado' ? '#F8D7DA' : '#FFF3CD'};
  color: ${({ status }) => status === 'Aprobado' ? '#155724' : status === 'Rechazado' ? '#721C24' : '#856404'};
`;

const SolicitudPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  
  // Estado del Formulario
  const [esPorHoras, setEsPorHoras] = useState(false);
  const [formData, setFormData] = useState({
    tipoSolicitud: "",
    motivo: "",
    fechaInicio: "",
    fechaFin: "",
    horaInicio: "",
    horaFin: "",
    descripcion: ""
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Cargar historial al iniciar
  useEffect(() => {
    if (usuario?.id) cargarHistorial();
  }, []);

  // 👇 FUNCIÓN ACTUALIZADA CON SERVICIO
  const cargarHistorial = async () => {
    try {
      const data = await getSolicitudesByUsuario(usuario.id);
      setPermisos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.tipoSolicitud || !formData.fechaInicio) {
      Swal.fire("Falta información", "Por favor completa los campos obligatorios", "warning");
      return;
    }

    // Preparamos el objeto JSON
    const datosEnviar = {
      tipoSolicitud: formData.tipoSolicitud,
      motivo: formData.motivo,
      esPorHoras: esPorHoras,
      fechaInicio: formData.fechaInicio,
      // Si es por horas, la fecha fin es la misma que la inicio
      fechaFin: esPorHoras ? formData.fechaInicio : formData.fechaFin,
      horaInicio: esPorHoras ? `${formData.horaInicio}:00` : null,
      horaFin: esPorHoras ? `${formData.horaFin}:00` : null,
      descripcion: formData.descripcion
    };

    try {
      // 👇 FUNCIÓN ACTUALIZADA CON SERVICIO
      await crearSolicitud(usuario.id, datosEnviar);

      Swal.fire("Solicitud Enviada", "Tu solicitud ha sido registrada correctamente.", "success");
      
      // Limpiar form
      setFormData({ tipoSolicitud: "", motivo: "", fechaInicio: "", fechaFin: "", horaInicio: "", horaFin: "", descripcion: "" });
      cargarHistorial(); // Refrescar tabla
      
    } catch (err) {
      Swal.fire("Error", "No se pudo registrar la solicitud.", "error");
    }
  };

  return (
    <Page>
      <Container>
        {/* FORMULARIO */}
        <FormCard>
          <Header>
            <Title>Solicitud de Permisos y Licencias</Title>
            <Subtitle>Complete el formulario para gestionar su ausencia.</Subtitle>
          </Header>
          
          <form onSubmit={handleSubmit}>
            
            {/* SWITCH: ¿DÍAS U HORAS? */}
            <SwitchContainer>
              <Checkbox 
                type="checkbox" 
                checked={esPorHoras} 
                onChange={() => setEsPorHoras(!esPorHoras)} 
              />
              <SwitchLabel>Solicitar permiso por horas (ej: Cita médica)</SwitchLabel>
            </SwitchContainer>

            <FormGrid>
              <FormGroup>
                <Label>Tipo de Solicitud</Label>
                <Select name="tipoSolicitud" value={formData.tipoSolicitud} onChange={handleChange} required>
                  <option value="">-- Seleccione --</option>
                  <option value="Salud">Licencia por Salud</option>
                  <option value="Personal">Asuntos Personales</option>
                  <option value="Vacaciones">Vacaciones</option>
                  <option value="Capacitacion">Capacitación / Estudios</option>
                  <option value="Onomastico">Día de Onomástico</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Motivo Específico</Label>
                <Input 
                  name="motivo" 
                  placeholder="Ej: Trámite bancario, Descanso médico..." 
                  value={formData.motivo} 
                  onChange={handleChange} 
                  required
                />
              </FormGroup>

              {/* CAMPOS DINÁMICOS */}
              <FormGroup>
                <Label>Fecha Inicio</Label>
                <Input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
              </FormGroup>

              {!esPorHoras ? (
                // SI ES POR DÍAS
                <FormGroup>
                  <Label>Fecha Fin (Inclusive)</Label>
                  <Input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required />
                </FormGroup>
              ) : (
                // SI ES POR HORAS
                <>
                  <FormGroup>
                    <Label>Hora Salida</Label>
                    <Input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label>Hora Retorno</Label>
                    <Input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
                  </FormGroup>
                </>
              )}

              <TextArea 
                name="descripcion" 
                placeholder="Detalles adicionales (Opcional)..." 
                value={formData.descripcion} 
                onChange={handleChange}
              />
            </FormGrid>

            <SubmitButton type="submit">Enviar Solicitud</SubmitButton>
          </form>
        </FormCard>

        {/* HISTORIAL */}
        <TableCard>
          <h3 style={{color:'#2F4F5F', margin:'0 0 20px 0'}}>Mis Solicitudes Recientes</h3>
          <Table>
            <thead>
              <tr>
                <Th>Tipo</Th>
                <Th>Detalle de Tiempo</Th>
                <Th>Duración Calc.</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {permisos.length === 0 ? (
                <tr><Td colSpan="4" style={{textAlign:'center'}}>No hay historial disponible.</Td></tr>
              ) : (
                permisos.map((p) => (
                  <tr key={p.id}>
                    <Td>
                      <strong>{p.tipoSolicitud}</strong><br/>
                      <span style={{fontSize:'0.85rem', color:'#888'}}>{p.motivo}</span>
                    </Td>
                    <Td>
                      {p.esPorHoras ? (
                        <>📅 {p.fechaInicio} <br/> ⏰ {p.horaInicio} - {p.horaFin}</>
                      ) : (
                        <>📅 Del {p.fechaInicio} <br/> al {p.fechaFin}</>
                      )}
                    </Td>
                    <Td>
                      {p.esPorHoras ? (
                        <span style={{color:'#007bff', fontWeight:'bold'}}>{p.totalHoras} hrs</span>
                      ) : (
                        <span style={{color:'#28a745', fontWeight:'bold'}}>{p.totalDias} días</span>
                      )}
                    </Td>
                    <Td><StatusBadge status={p.estado}>{p.estado}</StatusBadge></Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableCard>
      </Container>
    </Page>
  );
};

export default SolicitudPermisos;