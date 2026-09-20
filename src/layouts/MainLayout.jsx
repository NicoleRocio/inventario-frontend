import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaBars, FaUserCircle, FaShoppingCart, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import logoColegio from "../assets/logo-colegio.png";
import { CartContext } from "../context/CartContext";

/* --------------------------------------------------------
   Animaciones
-------------------------------------------------------- */
const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* --------------------------------------------------------
   CONTENEDORES PRINCIPALES
-------------------------------------------------------- */
const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #E4F3FA;
  overflow: hidden;
`;

const TopBar = styled.div`
  background-color: #7EC4DD;
  color: white;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
`;

const MainContent = styled.div`
  flex: 1;
  padding: 25px;
  margin-left: ${({ isOpen }) => (isOpen ? "250px" : "0")};
  margin-top: 65px;
  height: calc(100vh - 65px);
  overflow-y: auto;
  transition: margin-left 0.3s ease;
`;

/* --------------------------------------------------------
   SECCIONES TOPBAR
-------------------------------------------------------- */
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Logo = styled.img`
  height: 45px;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover { transform: scale(1.05); }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
`;

/* --------------------------------------------------------
   USUARIO (DERECHA)
-------------------------------------------------------- */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 25px;
`;

const CartContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  background: #FF5F7E;
  color: white;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const UserBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.35);
  backdrop-filter: blur(10px);
  padding: 4px 18px;
  border-radius: 40px;
  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    background: rgba(255,255,255,0.50);
  }

  span {
    color: #3A6A7E;
    font-weight: 600;
    line-height: 1.2;
  }
`;

const UserIcon = styled.div`
  background: white;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7EC4DD;
  font-size: 1.3rem;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  width: 180px;
  padding: 8px 0;
  display: ${({ open }) => (open ? "block" : "none")};
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  animation: ${slideDown} 0.25s ease;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
`;

const DropdownItem = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  color: #3A6A7E;
  font-weight: 500;
  transition: 0.25s;

  &:hover {
    background-color: #D0EDF6;
  }
`;

/* --------------------------------------------------------
   MODAL CARRITO
-------------------------------------------------------- */
const Overlay = styled.div`
  position: fixed;
  top: 65px; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.15);
  z-index: 900;
`;

const ModalCarrito = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 360px;
  background: rgba(255,255,255,0.80);
  backdrop-filter: blur(12px);
  color: #3A6A7E;
  border-radius: 20px;
  padding: 22px;
  animation: ${slideDown} 0.3s ease;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
  max-height: 450px;
  overflow-y: auto;
  z-index: 9999;
`;

const ItemCarrito = styled.div`
  background: #E8F7FB;
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BotonAccion = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  margin-top: 10px;
  background: #7EC4DD;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: #68B1C9;
  }
`;

/* --------------------------------------------------------
   COMPONENTE PRINCIPAL
-------------------------------------------------------- */
const MainLayout = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  // ✅ Sidebar persistente (siempre visible por defecto)
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const userRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUsuario(JSON.parse(storedUser));
  }, [navigate]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleCarrito = (e) => {
    e.stopPropagation();
    setCarritoVisible(!carritoVisible);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (carritoVisible) setCarritoVisible(false);
      if (userRef.current && !userRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [carritoVisible]);

  return (
    <LayoutContainer>
      <TopBar>
        <LeftSection>
          <Logo src={logoColegio} onClick={() => navigate("/home")} />
          <MenuButton onClick={toggleMenu}>
            <FaBars />
          </MenuButton>
        </LeftSection>

        <RightSection ref={userRef}>
          <CartContainer onClick={toggleCarrito}>
            <FaShoppingCart size={26} />
            {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>}
          </CartContainer>

          <UserBox onClick={toggleDropdown}>
            <div>
              <span>{usuario?.nombre}</span><br />
              <span style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                {usuario?.roles?.[0] || "Sin rol"}
              </span>
            </div>
            <UserIcon>
              <FaUserCircle />
            </UserIcon>
          </UserBox>


          <UserDropdown open={dropdownOpen}>
            <DropdownItem onClick={() => navigate("/perfil")}>Perfil</DropdownItem>
            <DropdownItem onClick={()=>navigate("/cambiar-password") }>Cambiar contraseña</DropdownItem>
            <DropdownItem
              onClick={() => {
                localStorage.removeItem("usuario");
                navigate("/login");
              }}
            >
              Cerrar sesión
            </DropdownItem>
          </UserDropdown>
        </RightSection>
      </TopBar>

      <Sidebar isOpen={isOpen} usuario={usuario} />

      <MainContent isOpen={isOpen}>
        <Outlet />
      </MainContent>

      {carritoVisible && (
        <>
          <Overlay onClick={() => setCarritoVisible(false)} />
          <ModalCarrito onClick={(e) => e.stopPropagation()}>
            <h3 style={{ textAlign: "center", marginBottom: 12 }}>Carrito</h3>

            {cartItems.length === 0 ? (
              <p style={{ textAlign: "center" }}>No hay productos en el carrito.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <ItemCarrito key={item.id}>
                    <span>{item.nombre}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#FF5F7E",
                        cursor: "pointer",
                      }}
                    >
                      <FaTrash />
                    </button>
                  </ItemCarrito>
                ))}

                <BotonAccion onClick={clearCart}>Vaciar carrito</BotonAccion>
                <BotonAccion onClick={() => navigate("/pedidos")}>
                  Hacer pedido
                </BotonAccion>
              </>
            )}
          </ModalCarrito>
        </>
      )}
    </LayoutContainer>
  );
};

export default MainLayout;
