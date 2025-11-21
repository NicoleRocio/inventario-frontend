import React, { useEffect, useState } from "react";
import styled from "styled-components";

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

  // TEMPORAL: datos de prueba (incluimos imágenes)
  const [productos, setProductos] = useState([
    {
      nombre: "Laptop Lenovo ThinkPad",
      fecha: "2025-11-15",
      cantidad: 1,
      estado: "Asignado",
      imagen: "https://cdn-icons-png.flaticon.com/512/270/270798.png"
    },
    {
      nombre: "Monitor Samsung 24\"",
      fecha: "2025-11-08",
      cantidad: 1,
      estado: "Asignado",
      imagen: "https://cdn-icons-png.flaticon.com/512/1998/1998671.png"
    }
  ]);

  return (
    <Container>
      <Title>Mis productos asignados</Title>

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
                <ImgProducto src={p.imagen} alt={p.nombre} />
              </Td>
              <Td>{p.nombre}</Td>
              <Td>{p.fecha}</Td>
              <Td>{p.cantidad}</Td>
              <Td><Estado>{p.estado}</Estado></Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
