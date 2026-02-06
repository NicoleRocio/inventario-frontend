import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaCalendarAlt, FaClock, FaSpinner, FaCheck, FaFileAlt, FaHistory, FaPlaneDeparture, FaStethoscope, FaUserClock } from "react-icons/fa";
// 👇 IMPORTAMOS EL SERVICIO
import { getSolicitudesByUsuario, crearSolicitud } from "../service/solicitudService";

// --- FUNCIÓN AUXILIAR: Generador de Horarios ---
const generarHorarios = () => {
  const horarios = [];
  const startHour = 7; 
  const endHour = 20;  
  
  for (let i = startHour; i <= endHour; i++) {
    for (let j = 0; j < 60; j += 15) { 
      const hour = i.toString().padStart(2, '0');
      const min = j.toString().padStart(2, '0');
      horarios.push(`${hour}:${min}`);
    }
  }
  return horarios;
};

const timeOptions = generarHorarios();

// --- ANIMACIONES ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`;

// --- ESTILOS MODERNOS (PREMIUM UI) ---
const Page = styled.div`
  padding: 40px 20px; 
  padding-bottom: 250px; /* Espacio para el dropdown */
  display: flex; 
  flex-direction: column; 
  align-items: center;
  background: #f4f7f6;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Container = styled.div`
  width: 100%; max-width: 1000px; display: flex; flex-direction: column; gap: 40px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

// Tarjeta Principal con efecto "Glass" sutil
const FormCard = styled.div`
  background: #ffffff;
  padding: 40px; 
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.05), 0 5px 15px rgba(0,0,0,0.02);
  border: 1px solid rgba(255,255,255,0.8);
  position: relative;
  overflow: hidden;

  /* Decoración superior */
  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px;
    background: linear-gradient(90deg, #2F4F5F, #4a7c94, #7EC4DD);
  }
`;

const Header = styled.div` margin-bottom: 35px; text-align: center; `;
const Title = styled.h2` 
  color: #2F4F5F; margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -0.5px;
  display: flex; align-items: center; justify-content: center; gap: 12px;
`;
const Subtitle = styled.p` color: #8898aa; font-size: 1rem; margin-top: 8px; font-weight: 500; `;

const FormGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
  @media(max-width: 768px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div` display: flex; flex-direction: column; gap: 10px; position: relative; `;

const Label = styled.label` 
  font-size: 0.9rem; font-weight: 700; color: #525f7f; 
  display: flex; align-items: center; gap: 8px; transition: 0.3s;
`;

// Inputs Estilizados
const commonInputStyles = css`
  padding: 14px 18px; 
  border: 2px solid #eef2f7; 
  border-radius: 12px; 
  font-size: 1rem; 
  background: #fcfdfe; 
  color: #333;
  transition: all 0.25s ease;
  
  &:hover { border-color: #cbd6e2; background: #fff; }
  &:focus { 
    border-color: #7EC4DD; 
    background: #fff; 
    outline: none; 
    box-shadow: 0 4px 12px rgba(126, 196, 221, 0.15);
    transform: translateY(-1px);
  }
  &:disabled {
    background: #e9ecef;
    color: #adb5bd;
    cursor: not-allowed;
    border-color: #e9ecef;
  }
`;

const Input = styled.input` ${commonInputStyles} `;
const Select = styled.select` ${commonInputStyles} cursor: pointer; appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232F4F5F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 15px center; background-size: 16px; padding-right: 40px;`;
const TextArea = styled.textarea` ${commonInputStyles} resize: none; height: 120px; grid-column: span 2; @media(max-width: 768px) { grid-column: span 1; }`;

// --- SWITCH PREMIUM ---
const SwitchContainer = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 35px; background: #f8fbfe; padding: 20px 25px; 
  border-radius: 16px; border: 1px solid #eef2f7;
  transition: 0.3s;
  &:hover { border-color: #dbeafe; box-shadow: 0 5px 15px rgba(0,0,0,0.03); }
`;
const SwitchText = styled.div` display: flex; flex-direction: column; `;
const SwitchTitle = styled.span` font-weight: 700; color: #2F4F5F; font-size: 1.05rem; `;
const SwitchDesc = styled.span` font-size: 0.85rem; color: #8898aa; margin-top: 4px; `;

const ToggleSwitch = styled.div`
  position: relative; width: 60px; height: 32px; 
  background: ${({ checked }) => checked ? 'linear-gradient(135deg, #2F4F5F 0%, #3e6b7f 100%)' : '#e0e6ed'};
  border-radius: 30px; cursor: pointer; transition: 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  
  &:after {
    content: ''; position: absolute; top: 4px; left: ${({ checked }) => checked ? '32px' : '4px'};
    width: 24px; height: 24px; background: white; border-radius: 50%; 
    transition: 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

// --- FILE UPLOAD ---
const FileUploadContainer = styled.div`
  grid-column: span 2; margin-top: 10px; @media(max-width: 768px) { grid-column: span 1; }
`;
const HiddenFileInput = styled.input` display: none; `;
const FileLabel = styled.label`
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  padding: 30px; border: 2px dashed #cbd6e2; border-radius: 16px;
  background: #fcfdfe; cursor: pointer; transition: all 0.3s; color: #8898aa;
  
  &:hover { 
    background: #f0f7ff; border-color: #7EC4DD; color: #2F4F5F;
    transform: translateY(-2px);
  }
  
  ${({ hasFile }) => hasFile && css`
    background: #e3f2fd; border-style: solid; border-color: #2F4F5F; color: #2F4F5F;
  `}
`;

// --- CALCULADORA TICKET ---
const TicketCard = styled.div`
  background: linear-gradient(135deg, #2F4F5F 0%, #1e3642 100%);
  color: white; padding: 20px 25px; border-radius: 16px;
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 15px; grid-column: span 2;
  box-shadow: 0 10px 25px rgba(47, 79, 95, 0.25);
  @media(max-width: 768px) { grid-column: span 1; flex-direction: column; gap: 10px; text-align: center; }
`;
const TicketLabel = styled.span` font-size: 0.9rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; `;
const TicketValue = styled.span` font-size: 1.2rem; font-weight: 800; color: #7EC4DD; `;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2F4F5F 0%, #1a3a4a 100%);
  color: white; padding: 18px; border: none; border-radius: 14px; 
  font-size: 1.1rem; font-weight: 700; letter-spacing: 0.5px;
  cursor: pointer; margin-top: 25px; width: 100%; 
  transition: all 0.3s; box-shadow: 0 10px 30px rgba(47, 79, 95, 0.3);
  display: flex; justify-content: center; align-items: center; gap: 12px;

  &:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(47, 79, 95, 0.4); }
  &:active { transform: translateY(-1px); }
  &:disabled { background: #999; cursor: not-allowed; transform: none; box-shadow: none; }
`;
const Spinner = styled(FaSpinner)` animation: ${spin} 1s linear infinite; `;

// --- TABLA ELEGANTE ---
const TableCard = styled.div`
  background: white; padding: 30px; border-radius: 24px; 
  box-shadow: 0 10px 40px rgba(0,0,0,0.06); width: 100%;
`;
const TableHeader = styled.div` 
  display: flex; align-items: center; gap: 10px; margin-bottom: 25px; 
  color: #2F4F5F; font-size: 1.3rem; font-weight: 700; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;
`;
const Table = styled.table` width: 100%; border-collapse: separate; border-spacing: 0 10px; `;
const Th = styled.th` 
  color: #8898aa; padding: 15px 20px; text-align: left; 
  font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; 
`;
const Tr = styled.tr`
  background: #fff; transition: 0.2s;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  &:hover { transform: scale(1.01); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
`;
const Td = styled.td` 
  padding: 20px; font-size: 0.95rem; color: #525f7f; border-top: 1px solid #f4f7f6; border-bottom: 1px solid #f4f7f6;
  &:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; border-left: 1px solid #f4f7f6; }
  &:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; border-right: 1px solid #f4f7f6; }
`;

// Badges de estado modernos
const StatusBadge = styled.span`
  padding: 8px 16px; border-radius: 30px; font-size: 0.8rem; font-weight: 700; display: inline-block;
  ${({ status }) => status === 'Aprobado' && css`background: #e0fbf0; color: #1aae6f;`}
  ${({ status }) => status === 'Rechazado' && css`background: #fee6e6; color: #f5365c;`}
  ${({ status }) => status === 'Pendiente' && css`background: #fff4cc; color: #ffab00;`}
`;

const SolicitudPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [esPorHoras, setEsPorHoras] = useState(false);
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);
  
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

  useEffect(() => { if (usuario?.id) cargarHistorial(); }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, fechaFin: esPorHoras ? prev.fechaInicio : "" }));
  }, [esPorHoras]);

  const cargarHistorial = async () => {
    try {
      const data = await getSolicitudesByUsuario(usuario.id);
      setPermisos(data);
    } catch (err) { console.error(err); }
  };

  // 👇 handleChange MEJORADO: Resetea la hora fin si cambias la inicio
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Si cambia la "Hora Salida", limpiamos la "Hora Retorno" por seguridad
      if (name === "horaInicio") {
        return { ...prev, [name]: value, horaFin: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        Swal.fire("Archivo incorrecto", "Solo se permiten archivos PDF", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { 
        Swal.fire("Archivo muy pesado", "Máximo 5MB", "warning");
        return;
      }
      setArchivo(file);
    }
  };

  // 👇 FILTRO DE HORAS: Solo muestra horas mayores a la de inicio
  const horasRetornoDisponibles = timeOptions.filter(time => {
    if (!formData.horaInicio) return false; // Si no hay inicio, no mostramos nada
    return time > formData.horaInicio;
  });

  const getCalculoVisual = () => {
    if (esPorHoras) {
      if (formData.horaInicio && formData.horaFin) return `⏱️ ${formData.horaInicio} - ${formData.horaFin}`;
      return "---";
    } else {
      if (formData.fechaInicio && formData.fechaFin) {
        const start = new Date(formData.fechaInicio);
        const end = new Date(formData.fechaFin);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        return diffDays > 0 ? `${diffDays} Días Solicitados` : "Fechas inválidas";
      }
      return "---";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      Swal.fire({
        title: "¡Solicitud Enviada!",
        text: "Tu solicitud ha sido registrada correctamente.",
        icon: "success",
        confirmButtonColor: "#2F4F5F"
      });
      
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
            <Title><FaPlaneDeparture /> Solicitud de Permisos</Title>
            <Subtitle>Gestione sus ausencias, vacaciones y licencias médicas en un solo lugar.</Subtitle>
          </Header>
          
          <form onSubmit={handleSubmit}>
            
            <SwitchContainer>
              <SwitchText>
                <SwitchTitle>Modo: Permiso por Horas</SwitchTitle>
                <SwitchDesc>Actívelo para citas médicas o trámites breves (menos de un día).</SwitchDesc>
              </SwitchText>
              <ToggleSwitch checked={esPorHoras} onClick={() => setEsPorHoras(!esPorHoras)} />
            </SwitchContainer>

            <FormGrid>
              <FormGroup>
                <Label><FaUserClock color="#7EC4DD"/> Tipo de Solicitud</Label>
                <Select name="tipoSolicitud" value={formData.tipoSolicitud} onChange={handleChange} required>
                  <option value="">-- Seleccione una opción --</option>
                  <option value="Salud">Licencia por Salud</option>
                  <option value="Personal">Asuntos Personales</option>
                  <option value="Vacaciones">Vacaciones</option>
                  <option value="Capacitacion">Capacitación / Estudios</option>
                  <option value="Onomastico">Día de Onomástico</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label><FaFileAlt color="#7EC4DD"/> Motivo Específico</Label>
                <Input 
                  name="motivo" 
                  placeholder="Ej: Cita en EsSalud, Trámite Notarial..." 
                  value={formData.motivo} 
                  onChange={handleChange} 
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label><FaCalendarAlt color="#7EC4DD"/> Fecha Inicio</Label>
                <Input 
                  type="date" 
                  name="fechaInicio" 
                  value={formData.fechaInicio} 
                  onChange={handleChange} 
                  min={today} 
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
                    min={formData.fechaInicio || today} 
                    required 
                  />
                </FormGroup>
              ) : (
                <>
                  <FormGroup>
                    <Label><FaClock color="#7EC4DD"/> Hora Salida</Label>
                    <Select name="horaInicio" value={formData.horaInicio} onChange={handleChange} required>
                      <option value="">-- Seleccione --</option>
                      {timeOptions.map((time) => (<option key={`s-${time}`} value={time}>{time}</option>))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label><FaClock color="#7EC4DD"/> Hora Retorno</Label>
                    {/* 👇 SELECT MEJORADO: Usamos las horas filtradas y bloqueamos si no hay inicio */}
                    <Select 
                        name="horaFin" 
                        value={formData.horaFin} 
                        onChange={handleChange} 
                        required
                        disabled={!formData.horaInicio}
                    >
                      <option value="">
                        {formData.horaInicio ? "-- Seleccione --" : "-- Primero elija salida --"}
                      </option>
                      {horasRetornoDisponibles.map((time) => (
                        <option key={`e-${time}`} value={time}>{time}</option>
                      ))}
                    </Select>
                  </FormGroup>
                </>
              )}

              <TicketCard>
                <TicketLabel>Resumen de Tiempo</TicketLabel>
                <TicketValue>{getCalculoVisual()}</TicketValue>
              </TicketCard>

              <TextArea 
                name="descripcion" 
                placeholder="Detalles adicionales para su supervisor (Opcional)..." 
                value={formData.descripcion} 
                onChange={handleChange}
              />

              <FileUploadContainer>
                <Label>Evidencia o Sustento (PDF)</Label>
                <HiddenFileInput 
                  type="file" id="pdfUpload" accept="application/pdf" onChange={handleFileChange}
                />
                <FileLabel htmlFor="pdfUpload" hasFile={!!archivo}>
                  {archivo ? <FaCheck size={32} /> : <FaCloudUploadAlt size={40} color="#cbd6e2" />}
                  <span style={{fontWeight:600}}>{archivo ? archivo.name : "Haga click o arrastre su archivo PDF aquí"}</span>
                </FileLabel>
              </FileUploadContainer>

            </FormGrid>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? <><Spinner /> Enviando Solicitud...</> : "Registrar Solicitud"}
            </SubmitButton>

          </form>
        </FormCard>

        {/* HISTORIAL */}
        <TableCard>
          <TableHeader><FaHistory /> Historial Reciente</TableHeader>
          {permisos.length === 0 ? (
            <p style={{textAlign:'center', color:'#888', fontStyle:'italic'}}>No se han encontrado registros recientes.</p>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <Table>
                <thead>
                  <tr>
                    <Th>Tipo / Motivo</Th>
                    <Th>Periodo Solicitado</Th>
                    <Th>Tiempo Total</Th>
                    <Th>Estado Actual</Th>
                  </tr>
                </thead>
                <tbody>
                  {permisos.map((p) => (
                    <Tr key={p.id}>
                      <Td>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <div style={{background:'#e3f2fd', padding:'8px', borderRadius:'8px', color:'#2F4F5F'}}>
                            {p.tipoSolicitud === 'Salud' ? <FaStethoscope/> : <FaFileAlt/>}
                          </div>
                          <div>
                            <strong style={{color:'#2F4F5F', display:'block'}}>{p.tipoSolicitud}</strong>
                            <span style={{fontSize:'0.85rem', color:'#8898aa'}}>{p.motivo}</span>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        {p.esPorHoras ? (
                          <div style={{fontSize:'0.9rem'}}>
                            <div style={{fontWeight:'bold', color:'#525f7f'}}>{p.fechaInicio}</div>
                            <div style={{color:'#8898aa'}}>⏰ {p.horaInicio} - {p.horaFin}</div>
                          </div>
                        ) : (
                          <div style={{fontSize:'0.9rem'}}>
                             <div style={{color:'#525f7f'}}>Desde: <strong>{p.fechaInicio}</strong></div>
                             <div style={{color:'#525f7f'}}>Hasta: <strong>{p.fechaFin}</strong></div>
                          </div>
                        )}
                      </Td>
                      <Td>
                        {p.esPorHoras ? (
                          <span style={{color:'#11cdef', fontWeight:'bold', background:'rgba(17, 205, 239, 0.1)', padding:'4px 8px', borderRadius:'4px'}}>{p.totalHoras} hrs</span>
                        ) : (
                          <span style={{color:'#2dce89', fontWeight:'bold', background:'rgba(45, 206, 137, 0.1)', padding:'4px 8px', borderRadius:'4px'}}>{p.totalDias} días</span>
                        )}
                      </Td>
                      <Td><StatusBadge status={p.estado}>{p.estado}</StatusBadge></Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </TableCard>
      </Container>
    </Page>
  );
};

export default SolicitudPermisos;