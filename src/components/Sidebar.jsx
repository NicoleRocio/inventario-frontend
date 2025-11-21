import { useState } from "react";
import styled from "styled-components";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* --------------------------------------------------------
   CONTENEDOR PRINCIPAL
-------------------------------------------------------- */

const SidebarContainer = styled.div`
  width: ${({ isOpen }) => (isOpen ? "250px" : "0")};
  height: calc(100vh - 65px);
  background-color: #F0FAFD;
  color: #3A6A7E;
  display: flex;
  flex-direction: column;
  padding: ${({ isOpen }) => (isOpen ? "20px" : "0")};
  position: fixed;
  top: 65px;
  left: 0;
  transition: all 0.3s ease;
  overflow-y: auto;
  z-index: 900;
  box-shadow: ${({ isOpen }) =>
    isOpen ? "4px 0px 12px rgba(0,0,0,0.05)" : "none"};
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

/* --------------------------------------------------------
   USUARIO
-------------------------------------------------------- */

const UserInfo = styled.div`
  text-align: center;
  padding-bottom: 12px;
  margin-bottom: 18px;
  border-bottom: 2px solid rgba(122, 181, 201, 0.25);
`;

const UserName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #2F4F5F;
`;

const UserRole = styled.p`
  font-size: 0.85rem;
  color: #597E8E;
  margin: 4px 0 0;
`;

/* --------------------------------------------------------
   ITEMS DEL MENÚ
-------------------------------------------------------- */

const MenuItem = styled.div`
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.25s, color 0.25s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #2F4F5F;
  margin-bottom: 6px;

  &:hover {
    background-color: #D8EEF5;
    color: #1C4151;
  }
`;

const SubMenu = styled.div`
  padding-left: 22px;
  background-color: #E8F4FA;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  border-left: 3px solid #A7D4E6;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const SubMenuItem = styled.div`
  padding: 8px 0;
  cursor: pointer;
  font-size: 0.95rem;
  color: #2F4F5F;
  transition: 0.2s;

  &:hover {
    color: #1A3F4F;
    font-weight: 600;
  }
`;

/* --------------------------------------------------------
   COMPONENTE PRINCIPAL
-------------------------------------------------------- */

const Sidebar = ({ isOpen, usuario }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  if (!usuario) {
    return (
      <SidebarContainer isOpen={isOpen}>
        <UserInfo>
          <UserName>Cargando...</UserName>
        </UserInfo>
      </SidebarContainer>
    );
  }

  const nombreUsuario = usuario?.nombre || "Usuario";
  const rolUsuario = usuario?.empleado?.roles?.[0]?.nombre || "Sin rol";

  return (
    <SidebarContainer isOpen={isOpen}>
      {/* INFO USUARIO */}
      <UserInfo>
        <UserName>{nombreUsuario}</UserName>
        <UserRole>{rolUsuario}</UserRole>
      </UserInfo>

      {/* INICIO */}
      <MenuItem onClick={() => navigate("/home")}>
        Inicio
      </MenuItem>

      {/* INVENTARIO */}
      <MenuItem onClick={() => toggleMenu("inventario")}>
        Inventario
        {openMenu === "inventario" ? <FaChevronUp /> : <FaChevronDown />}
      </MenuItem>

      <SubMenu isOpen={openMenu === "inventario"}>
        <SubMenuItem onClick={() => navigate("/inventario")}>
          Ver inventario
        </SubMenuItem>

        <SubMenuItem onClick={() => navigate("/crear-producto")}>
          Crear producto
        </SubMenuItem>
      </SubMenu>

      <MenuItem onClick={() => toggleMenu("pedidos")}>
        Pedidos
        {openMenu === "inventario" ? <FaChevronUp /> : <FaChevronDown />}
      </MenuItem>

      <SubMenu isOpen={openMenu === "pedidos"}>
        <SubMenuItem onClick={() => navigate("/pedidos")}>
          Mis pedidos
        </SubMenuItem>
        <SubMenuItem onClick={() => navigate("/mis-productos")}>
          Mis Productos Asignados
        </SubMenuItem>

      </SubMenu>

        {/* ASISTENCIA */}
        <MenuItem onClick={() => toggleMenu("asistencia")}>
          Asistencia
          {openMenu === "asistencia" ? <FaChevronUp /> : <FaChevronDown />}
        </MenuItem>

        <SubMenu isOpen={openMenu === "asistencia"}>
          <SubMenuItem onClick={() => navigate("/asistencia")}>
            Ver asistencia
          </SubMenuItem>

          <SubMenuItem onClick={() => navigate("/justificaciones")}>
            Justificaciones
          </SubMenuItem>
        </SubMenu>

        {/* SOPORTE */}
        <MenuItem onClick={() => toggleMenu("soporte")}>
          Mantenimiento y Soporte
          {openMenu === "soporte" ? <FaChevronUp /> : <FaChevronDown />}
        </MenuItem>

        <SubMenu isOpen={openMenu === "soporte"}>
          <SubMenuItem onClick={() => navigate("/generar-incidencia")}>
            Generar incidencias
          </SubMenuItem>

          <SubMenuItem onClick={() => navigate("/lista-incidencias")}>
            Lista de incidencias
          </SubMenuItem>
        </SubMenu>
    </SidebarContainer>
  );
};

export default Sidebar;
