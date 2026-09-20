import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { cambiarPassword } from "../service/usuarioService";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; //se importa el incono de ojo
import Swal from "sweetalert2"; 

const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const Container = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Card = styled.div`
  background: white;
  width: 100%;
  max-width: 450px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
`;

const Title = styled.h2`
  color: #2f4f5f;
  text-align: center;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  label { display: block; margin-bottom: 8px; color: #666; font-weight: 500; }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: 12px;
    padding-right: 40px; 
    border: 1.5px solid #eee;
    border-radius: 8px;
    font-size: 1rem;
    &:focus { border-color: #7EC4DD; outline: none; }
  }
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  transition: color 0.3s;

  &:hover {
    color: #7EC4DD;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #7EC4DD;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
  &:hover { background: #6bb0c9; }
`;

const CambiarPassword = () => {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  
  // Estado para los ojitos
  const [ver, setVer] = useState({ current: false, newPass: false, confirm: false });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleVer = (campo) => {
    setVer({ ...ver, [campo]: !ver[campo] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Validación con Alerta de Error
    if (form.newPass !== form.confirm) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las nuevas contraseñas no coinciden.',
        confirmButtonColor: '#7EC4DD'
      });
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("usuario"));
      
      // Llamamos al servicio
      await cambiarPassword(user.id, form.current, form.newPass);

      // 3. Alerta de Éxito
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña Actualizada!',
        text: 'Tu contraseña se cambió correctamente.',
        confirmButtonColor: '#7EC4DD',
        timer: 3000 // Se cierra sola en 3 segundos
      });

      // Limpiamos el formulario
      setForm({ current: "", newPass: "", confirm: "" });
      
    } catch (error) {
      // 4. Alerta de Error (Backend)
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema',
        text: error.message || 'No se pudo cambiar la contraseña',
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  return (
    <Container>
      <Card>
        <Title><FaLock style={{marginRight: 10}}/> Seguridad</Title>
        <form onSubmit={handleSubmit}>
          
          {/* Contraseña Actual */}
          <InputGroup>
            <label>Contraseña Actual</label>
            <InputWrapper>
              <input 
                type={ver.current ? "text" : "password"} 
                name="current" 
                value={form.current} 
                onChange={handleChange} 
                required 
              />
              <EyeIcon onClick={() => toggleVer("current")}>
                {ver.current ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </InputWrapper>
          </InputGroup>

          {/* Nueva Contraseña */}
          <InputGroup>
            <label>Nueva Contraseña</label>
            <InputWrapper>
              <input 
                type={ver.newPass ? "text" : "password"} 
                name="newPass" 
                value={form.newPass} 
                onChange={handleChange} 
                required 
              />
              <EyeIcon onClick={() => toggleVer("newPass")}>
                {ver.newPass ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </InputWrapper>
          </InputGroup>

          {/* Confirmar Contraseña */}
          <InputGroup>
            <label>Confirmar Nueva Contraseña</label>
            <InputWrapper>
              <input 
                type={ver.confirm ? "text" : "password"} 
                name="confirm" 
                value={form.confirm} 
                onChange={handleChange} 
                required 
              />
              <EyeIcon onClick={() => toggleVer("confirm")}>
                {ver.confirm ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </InputWrapper>
          </InputGroup>

          <Button type="submit">Actualizar Contraseña</Button>
        </form>
      </Card>
    </Container>
  );
};

export default CambiarPassword;