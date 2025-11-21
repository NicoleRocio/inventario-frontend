import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { CartContext } from "../context/CartContext";
import { getProductos } from "../service/productoService";

/* --------------------------------------------------------
   CONTENEDOR PRINCIPAL
-------------------------------------------------------- */

const InventarioContainer = styled.div`
  padding: 20px 30px;
  background-color: #E4F3FA; 
  min-height: 100vh;
`;

/* --------------------------------------------------------
   TÍTULO
-------------------------------------------------------- */

const Titulo = styled.h1`
  font-size: 1.6rem;
  font-weight: 600;
  color: #2F4F5F;
  margin-bottom: 20px;
`;

/* --------------------------------------------------------
   FILTROS
-------------------------------------------------------- */

const FiltroContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  background: #F0FAFD;
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 4px solid #A7D4E6;
  box-shadow: 0px 3px 8px rgba(0,0,0,0.05);
`;

const Label = styled.label`
  font-weight: 600;
  color: #2F4F5F;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #A7D4E6;
  background: white;
  font-size: 0.95rem;
  outline: none;
  color: #2F4F5F;
  transition: 0.25s;

  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 4px rgba(126,196,221,0.5);
  }
`;

/* --------------------------------------------------------
   GRID DE PRODUCTOS
-------------------------------------------------------- */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
`;

/* --------------------------------------------------------
   TARJETA
-------------------------------------------------------- */

const Tarjeta = styled.div`
  background: #FFFFFF;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.06);
  transition: 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 14px rgba(0,0,0,0.08);
  }
`;

const Imagen = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const Nombre = styled.h3`
  font-size: 1.1rem;
  font-weight: 00;
  color: #2F4F5F;
  margin: 6px 0;
`;

const Descripcion = styled.p`
  font-size: 0.9rem;
  color: #466572;
  margin: 3px 0 12px;
  text-align: center;
  height: 45px;
`;

/* --------------------------------------------------------
   STOCK (estilo corporativo)
-------------------------------------------------------- */

const Stock = styled.span`
  background-color: ${({ stock }) =>
    stock > 0 ? "rgba(40,167,69,0.12)" : "rgba(220,53,69,0.15)"};
  color: ${({ stock }) => (stock > 0 ? "#1C7C3E" : "#C03737")};
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

/* --------------------------------------------------------
   BOTÓN
-------------------------------------------------------- */

const Boton = styled.button`
  margin-top: auto;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background-color: #7EC4DD;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;
  width: 100%;

  &:hover {
    background-color: #68B1C9;
  }
`;

/* --------------------------------------------------------
   COMPONENTE PRINCIPAL
-------------------------------------------------------- */

export default function Inventario() {
  const [sedeSeleccionada, setSedeSeleccionada] = useState("todas");
  const [productos, setProductos] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (e) {
        console.error("Error cargando productos:", e);
      }
    };

    fetchProductos();
  }, []);

  // Filtrar productos
  const productosFiltrados =
    sedeSeleccionada === "todas"
      ? productos
      : productos.filter((p) => p.sede === sedeSeleccionada);

  return (
    <InventarioContainer>
      <Titulo>Inventario de Equipos Tecnológicos</Titulo>

      <FiltroContainer>
        <Label>Filtrar por sede:</Label>
        <Select
          value={sedeSeleccionada}
          onChange={(e) => setSedeSeleccionada(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="COLEGIO_ZARATE">Colegio Zárate</option>
          <option value="ACADEMIA_ZARATE">Academia Zárate</option>
        </Select>
      </FiltroContainer>

      <Grid>
        {productosFiltrados.map((item) => (
          <Tarjeta key={item.id}>
            <Imagen
              src={
                item.imagen
                  ? `http://localhost:8080/uploads/imagenes/${item.imagen}`
                  : "https://cdn-icons-png.flaticon.com/512/2920/2920322.png"
              }
            />

            <Nombre>{item.nombre}</Nombre>
            <Descripcion>{item.descripcion}</Descripcion>

            <Stock stock={item.stock}>
              {item.stock > 0
                ? `Stock: ${item.stock} unidades`
                : "Sin stock disponible"}
            </Stock>

            {item.stock > 0 && (
              <Boton
                onClick={async () => {
                  const actualizado = await addToCart(item);

                  if (actualizado) {
                    setProductos((prev) =>
                      prev.map((p) =>
                        p.id === item.id
                          ? { ...p, stock: actualizado.stock }
                          : p
                      )
                    );
                  }
                }}
              >
                Agregar al carrito
              </Boton>
            )}
          </Tarjeta>
        ))}
      </Grid>
    </InventarioContainer>
  );
}
