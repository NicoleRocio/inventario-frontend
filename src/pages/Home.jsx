import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 35px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  animation: ${fadeIn} 0.4s ease;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 35px 45px;
  border-radius: 18px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Titulo = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

const Rol = styled.span`
  background: #7EC4DD;
  padding: 8px 14px;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  display: inline-block;
  width: fit-content;
  margin-top: 5px;
`;

const Parrafo = styled.p`
  margin-top: 15px;
  font-size: 1.05rem;
  color: #444;
`;

const Home = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  if (!usuario) {
    return <p style={{ padding: "30px" }}>Cargando usuario...</p>;
  }

  const rol =
    typeof usuario?.empleado?.roles?.[0]?.nombre === "object"
      ? JSON.stringify(usuario.empleado.roles[0].nombre)
      : usuario?.empleado?.roles?.[0]?.nombre || "Sin rol";

  return (
    <Container>
      <Card>
        <Titulo>¡Bienvenid@, {usuario?.nombre || "Usuario"}!</Titulo>
        <Rol>{rol}</Rol>

        <Parrafo>
          Esta es tu página principal. Usa el menú lateral para navegar por los módulos del sistema.
        </Parrafo>
      </Card>
    </Container>
  );
};

export default Home;
