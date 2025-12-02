import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getProductosAsignados } from "../service/pedidoService";

const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));

const Container = styled.div`
  width: 100%;
  padding: 30px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2a4d69;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 85%;
  margin: 0 auto;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const Th = styled.th`
  background: #79c2d0;
  color: white;
  padding: 14px;
  text-align: left;
`;

const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
`;

const Estado = styled.span`
  background: #a7d8a0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #2f6b32;
`;

const ImgProducto = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 8px;
  background: #f9f9f9;
  padding: 5px;
`;

export default function MisProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!usuarioLogueado) return;

    const cargarProductosAsignados = async () => {
      try {
        const data = await getProductosAsignados(usuarioLogueado.id);
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos asignados", error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductosAsignados();

  }, []);

  if (loading) return <p style={{ padding: "30px" }}>Cargando productos asignados...</p>;

  return (
    <Container>
      <Title>Mis productos asignados</Title>

      {productos.length === 0 ? (
        <p style={{ padding: "20px" }}>No tienes productos asignados todavía.</p>
      ) : (
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
            {productos.map((p, index) => (
              <tr key={index}>
                <Td>
                  <ImgProducto 
                    src={`http://localhost:8080/uploads/imagenes/${p.imagen}`} 
                    alt={p.nombreProducto} 
                  />
                </Td>
                <Td>{p.nombreProducto}</Td>
                <Td>{p.fecha?.split("T")[0]}</Td>
                <Td>{p.cantidad}</Td>
                <Td><Estado>{p.estado}</Estado></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
