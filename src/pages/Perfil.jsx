import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { getUsuarioById } from "../service/usuarioService"; 
import { FaUserCircle, FaIdBadge, FaUserTag, FaBriefcase } from "react-icons/fa";
import Swal from "sweetalert2";

// --- ESTILOS ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const Container = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Card = styled.div`
  background: white;
  width: 100%;
  max-width: 500px;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(135deg, #7EC4DD 0%, #4a90e2 100%);
    z-index: 0;
  }
`;

const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  padding: 5px;
  margin-top: 20px;
  margin-bottom: 20px;
  z-index: 1;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: #7EC4DD;
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  color: #2f4f5f;
  margin-bottom: 5px;
  font-size: 1.8rem;
  z-index: 1;
`;

const RoleBadge = styled.span`
  background: #e3f4fa;
  color: #0d6efd;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 1;
`;

const InfoGroup = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  color: #888;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  margin-left: 5px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 15px;
  transition: all 0.2s;

  &:hover {
    border-color: #7EC4DD;
    background: white;
  }

  svg {
    color: #7EC4DD;
    margin-right: 15px;
    font-size: 1.2rem;
  }
`;

const InfoText = styled.span`
  color: #333;
  font-weight: 500;
  font-size: 1.05rem;
`;

const LoadingText = styled.p`
  color: #666;
  margin-top: 20px;
`;

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));
        
        if (usuarioStorage && usuarioStorage.id) {
          const data = await getUsuarioById(usuarioStorage.id);
          // Agregamos esto para ver en la consola qué llega exactamente (opcional para debug)
          console.log("Datos del Backend:", data); 
          setPerfil(data);
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar la información del perfil", "error");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  // --- FUNCIÓN NUEVA: Detecta el formato del Rol ---
  const obtenerRol = (p) => {
    if (!p) return "Cargando...";
    
    // 1. Si viene como un campo simple "rol": "DOCENTE"
    if (p.rol) return p.rol;
    
    // 2. Si viene como un array (lista)
    if (p.roles && p.roles.length > 0) {
      const primerRol = p.roles[0];
      
      // Caso A: Es un texto simple ["DOCENTE"]
      if (typeof primerRol === 'string') return primerRol;
      
      // Caso B: Es un objeto [{id: 1, nombre: "DOCENTE"}]
      if (typeof primerRol === 'object') {
        return primerRol.nombre || primerRol.name || primerRol.descripcion || "Rol desconocido";
      }
    }

    return "Usuario"; // Fallback si no encuentra nada
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>Cargando perfil...</LoadingText>
      </Container>
    );
  }

  if (!perfil) return <Container><p>No se encontró información del usuario.</p></Container>;

  return (
    <Container>
      <Card>
        <AvatarContainer>
          <FaUserCircle />
        </AvatarContainer>
        
        <Title>{perfil.nombre}</Title>
        
        {/* Usamos la función inteligente aquí 👇 */}
        <RoleBadge>{obtenerRol(perfil)}</RoleBadge>

        <InfoGroup>
          <Label>Nombre de Usuario</Label>
          <InputWrapper>
            <FaUserTag />
            <InfoText>{perfil.username}</InfoText>
          </InputWrapper>
        </InfoGroup>

        <InfoGroup>
          <Label>ID de Empleado</Label>
          <InputWrapper>
            <FaIdBadge />
            <InfoText>{perfil.empleado?.id || "No asignado"}</InfoText>
          </InputWrapper>
        </InfoGroup>

        <InfoGroup>
          <Label>Área / Departamento</Label>
          <InputWrapper>
            <FaBriefcase />
            <InfoText>Docencia / General</InfoText>
          </InputWrapper>
        </InfoGroup>

      </Card>
    </Container>
  );
};

export default Perfil;