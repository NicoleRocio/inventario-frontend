import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaCalendarAlt, FaClock, FaSpinner, FaCheck } from "react-icons/fa";
// 👇 IMPORTAMOS EL SERVICIO
import { getSolicitudesByUsuario, crearSolicitud } from "../service/solicitudService";

// --- ESTILOS MODERNOS Y ANIMACIONES ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;
const spin = keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`;

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
const Label = styled.label` font-size: 0.9rem; font-weight: 600; color: #444; display: flex; align-items: center; gap: 8px; `;

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

// --- SWITCH MEJORADO ---
const SwitchContainer = styled.div`
  display: flex; align-items: center; gap: 15px; margin-bottom: 25px; 
  background: #E8F4FA; padding: 15px 20px; border-radius: 12px; border: 1px solid #BFE6F5;
`;
const SwitchLabel = styled.span` font-weight: 600; color: #2F4F5F; cursor: pointer; user-select: none; `;
const ToggleSwitch = styled.div`
  position: relative; width: 50px; height: 26px; background: ${({ checked }) => checked ? '#2F4F5F' : '#ccc'};
  border-radius: 20px; transition: 0.3s; cursor: pointer;
  &:after {
    content: ''; position: absolute; top: 3px; left: ${({ checked }) => checked ? '26px' : '3px'};
    width: 20px; height: 20px; background: white; border-radius: 50%; transition: 0.3s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

// --- FILE UPLOAD PERSONALIZADO ---
const FileUploadContainer = styled.div`
  grid-column: span 2; display: flex; flex-direction: column; gap: 8px;
  @media(max-width: 700px) { grid-column: span 1; }
`;
const HiddenFileInput = styled.input` display: none; `;
const FileLabel = styled.label`
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 20px; border: 2px dashed #A7D4E6; border-radius: 12px;
  background: #F8FDFF; color: #5A8EAA; font-weight: 600; cursor: pointer; transition: 0.2s;
  &:hover { background: #EAF8FF; border-color: #7EC4DD; }
`;
const FileNameDisplay = styled.div`
  font-size: 0.9rem; color: #28a745; display: flex; align-items: center; gap: 5px; margin-top: 5px; font-weight: 600;
`;

// --- CALCULADORA VISUAL ---
const LiveCalc = styled.div`
  background: #2F4F5F; color: white; padding: 10px 20px; border-radius: 8px;
  font-size: 0.95rem; font-weight: bold; display: flex; justify-content: space-between; align-items: center;
  margin-top: 10px; grid-column: span 2;
  @media(max-width: 700px) { grid-column: span 1; }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2F4F5F 0%, #1e3642 100%);
  color: white; padding: 16px; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: bold; cursor: pointer; 
  margin-top: 15px; width: 100%; transition: transform 0.2s; display: flex; justify-content: center; align-items: center; gap: 10px;
  
  &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(47, 79, 95, 0.3); }
  &:disabled { background: #999; cursor: not-allowed; transform: none; }
`;
const Spinner = styled(FaSpinner)` animation: ${spin} 1s linear infinite; `;

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
  const [esPorHoras, setEsPorHoras] = useState(false);
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);
  
  // Obtenemos la fecha de hoy para bloquear días pasados (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

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

  useEffect(() => {
    if (usuario?.id) cargarHistorial();
  }, []);

  // Limpiar fecha fin si cambiamos de modo
  useEffect(() => {
    setFormData(prev => ({ ...prev, fechaFin: esPorHoras ? prev.fechaInicio : "" }));
  }, [esPorHoras]);

  const cargarHistorial = async () => {
    try {
      const data = await getSolicitudesByUsuario(usuario.id);
      setPermisos(data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        Swal.fire("Archivo incorrecto", "Solo se permiten archivos PDF", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        Swal.fire("Archivo muy pesado", "Máximo 5MB", "warning");
        return;
      }
      setArchivo(file);
    }
  };

  // --- CÁLCULO VISUAL EN TIEMPO REAL ---
  const getCalculoVisual = () => {
    if (esPorHoras) {
      if (formData.horaInicio && formData.horaFin) {
        return `⏱️ Horas: De ${formData.horaInicio} a ${formData.horaFin}`;
      }
      return "Seleccione horas...";
    } else {
      if (formData.fechaInicio && formData.fechaFin) {
        const start = new Date(formData.fechaInicio);
        const end = new Date(formData.fechaFin);
        // Calculamos diferencia en milisegundos
        const diffTime = end - start;
        // Convertimos a días (+1 para incluir el último día)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        
        return diffDays > 0 ? `📅 Total: ${diffDays} días` : "Fechas inválidas";
      }
      return "Seleccione rango de fechas...";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. VALIDACIONES
    if (!formData.tipoSolicitud || !formData.fechaInicio) {
      Swal.fire("Falta información", "Complete los campos obligatorios", "warning");
      setLoading(false); return;
    }

    if (esPorHoras) {
      if (!formData.horaInicio || !formData.horaFin) {
        Swal.fire("Atención", "Indique Hora Salida y Retorno", "warning");
        setLoading(false); return;
      }
      if (formData.horaInicio >= formData.horaFin) {
        Swal.fire("Error", "La hora de retorno debe ser después de la salida", "error");
        setLoading(false); return;
      }
    } else {
      if (!formData.fechaFin) {
        Swal.fire("Atención", "Indique la Fecha de Fin", "warning");
        setLoading(false); return;
      }
      if (formData.fechaFin < formData.fechaInicio) {
        Swal.fire("Error", "La fecha fin no puede ser anterior a la inicio", "error");
        setLoading(false); return;
      }
    }

    // 2. PREPARAR DATOS
    const datosEnviar = {
      tipoSolicitud: formData.tipoSolicitud,
      motivo: formData.motivo,
      esPorHoras: esPorHoras,
      fechaInicio: formData.fechaInicio,
      fechaFin: esPorHoras ? formData.fechaInicio : formData.fechaFin,
      horaInicio: esPorHoras && formData.horaInicio ? `${formData.horaInicio}:00` : null,
      horaFin: esPorHoras && formData.horaFin ? `${formData.horaFin}:00` : null,
      descripcion: formData.descripcion,
      archivoEvidencia: archivo ? archivo.name : null 
    };

    try {
      await crearSolicitud(usuario.id, datosEnviar);
      Swal.fire("¡Éxito!", "Solicitud enviada correctamente.", "success");
      
      setFormData({ tipoSolicitud: "", motivo: "", fechaInicio: "", fechaFin: "", horaInicio: "", horaFin: "", descripcion: "" });
      setArchivo(null);
      cargarHistorial(); 
    } catch (err) {
      Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Container>
        <FormCard>
          <Header>
            <Title>Solicitud de Permisos y Licencias</Title>
            <Subtitle>Complete el formulario para gestionar su ausencia.</Subtitle>
          </Header>
          
          <form onSubmit={handleSubmit}>
            
            {/* SWITCH MEJORADO */}
            <SwitchContainer>
              <ToggleSwitch checked={esPorHoras} onClick={() => setEsPorHoras(!esPorHoras)} />
              <SwitchLabel onClick={() => setEsPorHoras(!esPorHoras)}>
                {esPorHoras ? "Modo: Permiso por Horas (Cita médica)" : "Modo: Licencia por Días (Vacaciones)"}
              </SwitchLabel>
            </SwitchContainer>

            <FormGrid>
              <FormGroup>
                <Label>Tipo de Asistencia</Label>
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
                  placeholder="Ej: Trámite bancario, Cita médica..." 
                  value={formData.motivo} 
                  onChange={handleChange} 
                  required
                />
              </FormGroup>

              {/* FECHAS INTERACTIVAS */}
              <FormGroup>
                <Label><FaCalendarAlt color="#7EC4DD"/> Fecha Inicio</Label>
                <Input 
                  type="date" 
                  name="fechaInicio" 
                  value={formData.fechaInicio} 
                  onChange={handleChange} 
                  min={today} // Bloquea días pasados
                  required 
                />
              </FormGroup>

              {!esPorHoras ? (
                <FormGroup>
                  <Label><FaCalendarAlt color="#7EC4DD"/> Fecha Fin</Label>
                  <Input 
                    type="date" 
                    name="fechaFin" 
                    value={formData.fechaFin} 
                    onChange={handleChange} 
                    min={formData.fechaInicio || today} // Bloquea fechas anteriores a la de inicio
                    required 
                  />
                </FormGroup>
              ) : (
                <>
                  <FormGroup>
                    <Label><FaClock color="#7EC4DD"/> Hora Salida</Label>
                    <Input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label><FaClock color="#7EC4DD"/> Hora Retorno</Label>
                    <Input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
                  </FormGroup>
                </>
              )}

              {/* CALCULADORA VISUAL */}
              <LiveCalc>
                <span>Resumen:</span>
                <span>{getCalculoVisual()}</span>
              </LiveCalc>

              <TextArea 
                name="descripcion" 
                placeholder="Detalles adicionales (Opcional)..." 
                value={formData.descripcion} 
                onChange={handleChange}
              />

              {/* SUBIDA DE ARCHIVO MEJORADA */}
              <FileUploadContainer>
                <Label>Adjuntar Evidencia (PDF)</Label>
                <HiddenFileInput 
                  type="file" 
                  id="pdfUpload" 
                  accept="application/pdf" 
                  onChange={handleFileChange}
                />
                <FileLabel htmlFor="pdfUpload">
                  <FaCloudUploadAlt size={24} /> 
                  {archivo ? "Cambiar archivo" : "Click para subir PDF"}
                </FileLabel>
                {archivo && (
                  <FileNameDisplay>
                    <FaCheck /> Listo: {archivo.name}
                  </FileNameDisplay>
                )}
              </FileUploadContainer>

            </FormGrid>

            {/* BOTÓN CON LOADING */}
            <SubmitButton type="submit" disabled={loading}>
              {loading ? <><Spinner /> Procesando...</> : "Enviar Solicitud"}
            </SubmitButton>

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
                <Th>Duración</Th>
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