import { useState, useEffect } from "react";
import styled from "styled-components";
import { getRoles, registrarUsuario } from "../service/usuarioService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// --- ESTILOS (Diseño limpio y moderno) ---
const Container = styled.div`
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-in-out;
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

const FormCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border-top: 5px solid #7EC4DD;
`;

const Title = styled.h2`
  color: #2f4f5f;
  margin-bottom: 25px;
  text-align: center;
  font-size: 1.8rem;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f8f9fa;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #7EC4DD;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(126, 196, 221, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  background-color: #f8f9fa;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #7EC4DD;
    background-color: white;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #2f4f5f 0%, #1e3642 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(47, 79, 95, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CrearUsuario = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    password: "",
    rolId: "" 
  });

  // 1. Cargar roles al entrar a la página
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar la lista de roles", "error");
      }
    };
    cargarRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rolId) {
      Swal.fire("Atención", "Por favor selecciona un rol para el usuario", "warning");
      return;
    }

    setLoading(true);

    try {
      // Preparamos los datos EXACTOS como los espera el DTO de Java
      const datosParaEnviar = {
        nombre: formData.nombre,
        username: formData.username,
        password: formData.password,
        // Convertimos a número y lo metemos en un array porque Java espera List<Long>
        rolesIds: [parseInt(formData.rolId)] 
      };

      await registrarUsuario(datosParaEnviar);
      
      Swal.fire({
        title: "¡Usuario Creado!",
        text: `El usuario ${formData.username} ha sido registrado con éxito.`,
        icon: "success",
        confirmButtonColor: "#2f4f5f"
      }).then(() => {
        // Limpiamos el formulario
        setFormData({ nombre: "", username: "", password: "", rolId: "" });
        // Opcional: navigate("/lista-usuarios"); 
      });
      
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Registrar Nuevo Empleado</Title>
        <form onSubmit={handleSubmit}>
          
          <FormGroup>
            <Label>Nombre Completo</Label>
            <Input 
              name="nombre" 
              placeholder="Ej: Ana Torres"
              value={formData.nombre} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>

          <FormGroup>
            <Label>Usuario (Login)</Label>
            <Input 
              name="username" 
              placeholder="Ej: atorres"
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>

          <FormGroup>
            <Label>Contraseña Inicial</Label>
            <Input 
              type="password" 
              name="password" 
              placeholder="********"
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>

          <FormGroup>
            <Label>Rol / Área</Label>
            <Select 
              name="rolId" 
              value={formData.rolId} 
              onChange={handleChange} 
              required
            >
              <option value="">-- Selecciona el Rol --</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </Select>
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Guardar Usuario"}
          </Button>
        </form>
      </FormCard>
    </Container>
  );
};

export default CrearUsuario;