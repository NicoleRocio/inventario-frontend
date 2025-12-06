import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { getProductosAsignados } from "../service/pedidoService";

const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));

/* ================================
   🎨 ANIMACIÓN
================================ */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ================================
   🎨 ESTILOS
================================ */
const Container = styled.div`
  width: 100%;
  padding: 30px;
  animation: ${fadeIn} 0.4s ease;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2a4d69;
  text-align: center;
  margin-bottom: 25px;
`;

const SearchBar = styled.input`
  width: 280px;
  padding: 10px 14px;
  border: 1.5px solid #a7d4e6;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  display: block;
  margin: 0 auto 20px auto;

  &:focus {
    border-color: #7ec4dd;
    box-shadow: 0 0 6px rgba(126,196,221,0.35);
  }
`;

const TableWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  background: white;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #7ec4dd;
  color: white;
  padding: 14px;
  font-size: 15px;
  text-align: left;
`;

const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #eef3f5;
  font-size: 15px;
`;

const ImgProducto = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 10px;
  background: #f4f9fb;
  padding: 6px;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.08);
`;

const Estado = styled.span`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;

  background: ${({ estado }) =>
    estado === "Entregado" || estado === "Activo"
      ? "rgba(55, 197, 88, 0.18)"
      : "rgba(21, 153, 50, 0.2)"};

  color: ${({ estado }) =>
    estado === "Entregado" || estado === "Activo"
      ? "#1C7C3E"
      : "#1C7C3E"};
`;

const EmptyMessage = styled.p`
  text-align: center;
  font-size: 16px;
  padding: 20px;
  color: #506070;
`;

/* PAGINACIÓN */
const Pagination = styled.div`
  margin-top: 18px;
  text-align: center;
  font-weight: 600;
`;

const PageButton = styled.button`
  padding: 8px 14px;
  margin: 0 6px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${({ disabled }) => (disabled ? "#bfdce6" : "#7ec4dd")};
  color: #2f4f5f;
  font-weight: 600;
`;

/* ================================
   📌 COMPONENTE PRINCIPAL
================================ */
export default function MisProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 5;

  useEffect(() => {
    if (!usuarioLogueado) return;

    const cargar = async () => {
      try {
        const data = await getProductosAsignados(usuarioLogueado.id);
        setProductos(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) return <EmptyMessage>Cargando productos asignados...</EmptyMessage>;

  /* 🔎 Buscador */
  const filtrados = productos.filter((p) =>
    p.nombreProducto.toLowerCase().includes(buscar.toLowerCase())
  );

  /* Paginación */
  const inicio = (paginaActual - 1) * porPagina;
  const paginados = filtrados.slice(inicio, inicio + porPagina);
  const totalPaginas = Math.ceil(filtrados.length / porPagina);

  return (
    <Container>
      <Title>Mis productos asignados</Title>

      <SearchBar
        placeholder="Buscar por nombre..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />

      {paginados.length === 0 ? (
        <EmptyMessage>No se encontraron productos.</EmptyMessage>
      ) : (
        <>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Imagen</Th>
                  <Th>Producto</Th>
                  <Th>Fecha entrega</Th>
                  <Th>Cantidad</Th>
                  <Th>Estado</Th>
                </tr>
              </thead>

              <tbody>
                {paginados.map((p, i) => (
                  <tr key={i}>
                    <Td>
                      <ImgProducto
                        src={`http://localhost:8080/uploads/imagenes/${p.imagen}`}
                        alt={p.nombreProducto}
                      />
                    </Td>

                    <Td>{p.nombreProducto}</Td>
                    <Td>{p.fecha?.split("T")[0]}</Td>
                    <Td>{p.cantidad}</Td>

                    <Td>
                      <Estado estado={p.estado}>{p.estado}</Estado>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          <Pagination>
            <PageButton
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
            >
              ← Anterior
            </PageButton>

            Página {paginaActual} de {totalPaginas}

            <PageButton
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente →
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
}
