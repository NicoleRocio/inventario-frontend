// src/pages/Login.jsx
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import logoColegio from "../assets/logo-colegio.png";

const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
`;

const LeftPanel = styled.div`
  flex: 0.5;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 60px;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const RightPanel = styled.div`
  flex: 1.5;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7ec4dd, #68b1c9, #4b8ba8);
  background-size: 300% 300%;
  animation: ${shine} 10s ease infinite;
  color: white;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.25),
      transparent 70%
    );
  }
`;

const LogoContainer = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const LogoImg = styled.img`
  width: 170px;
  height: 170px;
  object-fit: contain;
  margin-bottom: 25px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.25));
`;

const LogoTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
`;

const LogoSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.95;
  margin-top: 10px;
  font-weight: 500;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: #2f4f5f;
  font-size: 2rem;
  margin-bottom: 30px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Label = styled.label`
  display: block;
  text-align: left;
  color: #2f4f5f;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 13px;
  border-radius: 10px;
  border: 1.5px solid #a7d4e6;
  background: #f7fbfc;
  font-size: 1rem;
  color: #2f4f5f;
  margin-bottom: 18px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #7ec4dd;
    background: #ffffff;
    box-shadow: 0 0 6px rgba(126, 196, 221, 0.4);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #7ec4dd, #68b1c9);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(126, 196, 221, 0.4);

  &:hover {
    background: linear-gradient(135deg, #68b1c9, #4b8ba8);
    transform: translateY(-2px);
  }
`;

const Message = styled.p`
  color: #d9534f;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuario || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password }),
      });

      if (!response.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const data = await response.json();

      // GUARDAR USUARIO COMPLETO
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: data.id,
          username: data.username,
          nombre: data.nombre,
          empleadoId: data.empleado?.id || null,
          roles: data.empleado?.roles?.map((r) => r.nombre) || [],
        })
      );

      navigate("/home");
    } catch (error) {
      console.error(error);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <Container>
      <LeftPanel>
        <Card>
          <Title>Inicio de Sesión</Title>

          <form onSubmit={handleLogin}>
            <Label>Usuario:</Label>
            <Input
              type="text"
              placeholder="Ingrese su usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <Label>Contraseña:</Label>
            <Input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit">Ingresar</Button>
            {error && <Message>{error}</Message>}
          </form>
        </Card>
      </LeftPanel>

      <RightPanel>
        <LogoContainer>
          <LogoImg src={logoColegio} alt="logo-colegio" />
          <LogoTitle>Grupo Zárate Verástegui</LogoTitle>
          <LogoSubtitle>Departamento de Sistemas</LogoSubtitle>
        </LogoContainer>
      </RightPanel>
    </Container>
  );
};

export default Login;
