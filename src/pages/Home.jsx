import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
// IMPORTANTE: Importamos la función del servicio que acabamos de crear
import { getResumenUsuario } from "../service/usuarioService"; 

import { 
  FaBoxOpen, 
  FaExclamationTriangle, 
  FaLaptopCode, 
  FaClipboardList 
} from "react-icons/fa";

// --- ANIMACIONES Y ESTILOS (Se mantienen igual) ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 30px;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
  font-family: 'Poppins', sans-serif;
`;

const Header = styled.div`
  margin-bottom: 35px;
`;

const Greeting = styled.h1`
  font-size: 2.2rem;
  color: #2f4f5f;
  margin: 0;
  font-weight: 700;
  span { color: #7EC4DD; }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin-top: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const StatCard = styled (Link)`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 5px solid ${props => props.$color || "#7EC4DD"};
  text-decoration: none; 
  color: inherit;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    
  }
`;

const IconBox = styled.div`
  background: ${props => props.$bg || "#e3f4fa"};
  color: ${props => props.$color || "#7EC4DD"};
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  h3 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #2f4f5f;
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #888;
    font-weight: 500;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: #2f4f5f;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
  display: inline-block;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const ActionButton = styled(Link)`
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  padding: 20px;
  border-radius: 12px;
  text-decoration: none;
  color: #2f4f5f;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  &:hover {
    background: #7EC4DD;
    color: white;
    border-color: #7EC4DD;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(126, 196, 221, 0.4);
    svg { color: white; }
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  color: #7EC4DD;
  transition: color 0.3s ease;
`;

const ActionText = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
`;

// --- COMPONENTE PRINCIPAL ---
const Home = () => {
  const [usuario, setUsuario] = useState(null);
  
  // 1. ESTADO NUEVO: Aquí guardaremos los números que vienen de la BD
  const [stats, setStats] = useState({
    totalActivos: 0,
    totalIncidencias: 0,
    totalSolicitudes: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const userParsed = JSON.parse(storedUser);
      setUsuario(userParsed);
      
      // 2. CONEXIÓN: Llamamos al servicio cuando carga la página
      cargarDatos(userParsed.id);
    }
  }, []);

  const cargarDatos = async (id) => {
    try {
      const data = await getResumenUsuario(id);
      // Actualizamos los números con lo que respondió Java
      setStats(data); 
    } catch (error) {
      console.log("Error cargando dashboard:", error);
    }
  };

  if (!usuario) {
    return <div style={{ padding: "30px" }}>Cargando panel...</div>;
  }

  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const rol = usuario?.roles?.[0] || "Usuario";

  return (
    <Container>
      <Header>
        <Greeting>
          {getSaludo()}, <span>{usuario?.nombre?.split(" ")[0]}</span>
        </Greeting>
        <Subtitle>
          Panel de Control - Sistema de Inventario Grupo Zárate | Rol: <strong>{rol}</strong>
        </Subtitle>
      </Header>

      <StatsGrid>
        {/* TARJETA 1: Mis Activos */}
        <StatCard to="/mis-productos" $color="#7EC4DD">
          <IconBox $bg="#e3f4fa" $color="#7EC4DD">
            <FaBoxOpen />
          </IconBox>
          <StatInfo>
            {/* 3. VISUALIZACIÓN: Mostramos la variable stats.totalActivos */}
            <h3>{stats.totalActivos}</h3>
            <p>Mis Activos</p>
          </StatInfo>
        </StatCard>

        {/* TARJETA 2: Incidencias */}
        <StatCard to="/generar-incidencia" state={{irAlHistorial:true}} $color="#f39c12">
          <IconBox $bg="#fef5e7" $color="#f39c12">
            <FaExclamationTriangle />
          </IconBox>
          <StatInfo>
            {/* Variable stats.totalIncidencias */}
            <h3>{stats.totalIncidencias}</h3>
            <p>Incidencias</p>
          </StatInfo>
        </StatCard>

        {/* TARJETA 3: Solicitudes */}
        <StatCard to="/pedidos" $color="#27ae60">
          <IconBox $bg="#eafaf1" $color="#27ae60">
            <FaClipboardList />
          </IconBox>
          <StatInfo>
             {/* Variable stats.totalSolicitudes */}
            <h3>{stats.totalSolicitudes}</h3>
            <p>Solicitudes</p>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* ACCESOS RÁPIDOS */}
      <div>
        <SectionTitle>¿Qué deseas hacer hoy?</SectionTitle>
        <ActionsGrid>
          <ActionButton to="/mis-productos">
            <ActionIcon><FaLaptopCode /></ActionIcon>
            <ActionText>Ver mis Activos</ActionText>
          </ActionButton>

          <ActionButton to="/generar-incidencia">
            <ActionIcon><FaExclamationTriangle /></ActionIcon>
            <ActionText>Reportar Falla</ActionText>
          </ActionButton>

          <ActionButton to="/inventario">
            <ActionIcon><FaBoxOpen /></ActionIcon>
            <ActionText>Solicitar Material</ActionText>
          </ActionButton>
        </ActionsGrid>
      </div>

    </Container>
  );
};

export default Home;