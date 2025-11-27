import { useContext, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { CartContext } from "../context/CartContext";
import { FaTrash, FaCheckCircle } from "react-icons/fa";
import {
  crearPedido,
  getPedidosPorUsuario,
} from "../service/pedidoService.js";

/* Animación */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* --------------------------------------------------------
   ESTILOS (NO CAMBIA NADA)
-------------------------------------------------------- */

const Contenedor = styled.div`
  padding: 25px;
  background: #E4F3FA;
  min-height: 100vh;
`;

const Titulo = styled.h2`
  color: #2F4F5F;
  text-align: center;
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 1.6rem;
`;

const ListaPedidos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 700px;
  margin: 0 auto;
`;

const Tarjeta = styled.div`
  background-color: #FFFFFF;
  padding: 15px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 3px 8px rgba(0,0,0,0.08);
  color: #2F4F5F;
`;

const BotonEliminar = styled.button`
  background: none;
  border: none;
  color: #C03737;
  font-size: 1.3rem;
  cursor: pointer;

  &:hover {
    color: #e04747;
  }
`;

const BotonPrincipal = styled.button`
  background-color: #7EC4DD;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  cursor: pointer;
  margin: 25px auto 0;
  display: block;
  font-weight: 600;
  transition: 0.25s ease;

  &:hover {
    background-color: #68B1C9;
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 80px;
  right: 30px;
  background-color: #7EC4DD;
  color: white;
  padding: 12px 18px;
  border-radius: 10px;
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;

const TablaWrapper = styled.div`
  margin-top: 35px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
`;

const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  color: #2F4F5F;
`;

const Th = styled.th`
  background: #7EC4DD;
  color: white;
  padding: 12px;
  font-weight: 700;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e6eaee;
`;

const Fila = styled.tr`
  &:nth-child(even) {
    background: #F7FBFC;
  }
`;

const BadgeEstado = styled.span`
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  background-color: ${({ estado }) =>
    estado === "Atendido" ? "rgba(40,167,69,0.12)" : "rgba(211,158,0,0.15)"};
  color: ${({ estado }) =>
    estado === "Atendido" ? "#1C7C3E" : "#8A6D00"};
`;

const InputCliente = styled.input`
  display: block;
  margin: 0 auto 20px;
  padding: 10px;
  width: 60%;
  border-radius: 10px;
  background: white;
  border: 1px solid #A7D4E6;
  text-align: center;
  font-weight: 600;
  color: #2F4F5F;
`;

/* --------------------------------------------------------
   COMPONENTE PRINCIPAL — VERSIÓN POR ID DE USUARIO
-------------------------------------------------------- */

const MisPedidos = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // 🔵 Cargar usuario logueado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) setUsuario(user);
  }, []);

  // 🔵 Cargar historial del usuario
  useEffect(() => {
    if (!usuario) return;
    cargarPedidosUsuario();
  }, [usuario]);

  const cargarPedidosUsuario = async () => {
    try {
      const data = await getPedidosPorUsuario(usuario.id);
      setHistorial(data);
    } catch (e) {
      console.error("Error cargando pedidos del usuario:", e);
    }
  };

  // 🔵 Enviar pedido con usuario_id
  const handleEnviarPedido = async () => {
    if (cartItems.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    const nuevoPedido = {
      usuario: { id: usuario.id },
      estado: "En espera",
      detalles: cartItems.map((item) => ({
        producto: { id: item.id },
        cantidad: item.cantidad || 1,
      })),
    };

    try {
      await crearPedido(nuevoPedido);
      setMostrarToast(true);
      setTimeout(() => setMostrarToast(false), 2500);

      clearCart();
      cargarPedidosUsuario();
    } catch (e) {
      alert("Error enviando el pedido");
    }
  };

  return (
    <Contenedor>
      <Titulo>Mis Pedidos</Titulo>

      {usuario && (
        <InputCliente value={usuario.nombre} readOnly />
      )}

      {/* CARRITO */}
      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center", color: "#2F4F5F" }}>
          No tienes productos en el carrito.
        </p>
      ) : (
        <>
          <ListaPedidos>
            {cartItems.map((item) => (
              <Tarjeta key={item.id}>
                <div>
                  <strong>{item.nombre}</strong>
                  <p style={{ margin: 0, color: "#466572" }}>
                    Cantidad: {item.cantidad || 1}
                  </p>
                </div>
                <BotonEliminar onClick={() => removeFromCart(item.id)}>
                  <FaTrash />
                </BotonEliminar>
              </Tarjeta>
            ))}
          </ListaPedidos>

          <BotonPrincipal onClick={handleEnviarPedido}>
            Enviar pedido al servidor
          </BotonPrincipal>
        </>
      )}

      {/* HISTORIAL */}
      {historial.length > 0 && (
        <TablaWrapper>
          <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#2F4F5F" }}>
            Historial de pedidos
          </h3>

          <Tabla>
            <thead>
              <tr>
                <Th>Fecha</Th>
                <Th>Estado</Th>
                <Th>Detalles</Th>
              </tr>
            </thead>

            <tbody>
              {historial.map((pedido) => (
                <Fila key={pedido.id}>
                  <Td>{new Date(pedido.fecha).toLocaleString()}</Td>

                  <Td>
                    <BadgeEstado estado={pedido.estado}>
                      {pedido.estado}
                    </BadgeEstado>
                  </Td>

                  <Td>
                    {pedido.detalles
                      .map(
                        (d) =>
                          `${d.producto?.nombre || "Producto"} (${d.cantidad})`
                      )
                      .join(", ")}
                  </Td>
                </Fila>
              ))}
            </tbody>
          </Tabla>
        </TablaWrapper>
      )}

      {mostrarToast && (
        <Toast>
          <FaCheckCircle size={20} />
          <span>¡Pedido enviado correctamente!</span>
        </Toast>
      )}
    </Contenedor>
  );
};

export default MisPedidos;
