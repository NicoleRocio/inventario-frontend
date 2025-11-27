import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { crearProducto } from "../service/productoService.js";

/* --------------------------------------------------------
   ANIMACIÓN
-------------------------------------------------------- */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* --------------------------------------------------------
   CONTENEDOR PRINCIPAL
-------------------------------------------------------- */

const PageContainer = styled.div`
  padding: 35px;
  display: flex;
  justify-content: center;
  animation: ${fadeIn} 0.4s ease;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 35px 45px;
  border-radius: 18px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* --------------------------------------------------------
   ESTILOS DE TÍTULO
-------------------------------------------------------- */

const Titulo = styled.h2`
  margin: 0 0 10px 0;
  color: #2F4F5F;
  font-weight: 600;
  font-size: 1.6rem;
`;

/* --------------------------------------------------------
   FORMULARIO
-------------------------------------------------------- */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #2F4F5F;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  outline: none;
  font-size: 1rem;
  color: #2F4F5F;
  transition: 0.25s;

  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.4);
  }
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  outline: none;
  font-size: 1rem;
  color: #2F4F5F;
  transition: 0.25s;

  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.4);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  outline: none;
  height: 140px;
  resize: none;
  color: #2F4F5F;
  transition: 0.25s;

  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.4);
  }
`;

/* --------------------------------------------------------
   BOTÓN
-------------------------------------------------------- */

const Button = styled.button`
  padding: 14px;
  background-color: #7EC4DD;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background-color: #68B1C9;
  }
`;

/* --------------------------------------------------------
   PREVIEW IMAGEN
-------------------------------------------------------- */

const ImagenPreview = styled.img`
  width: 160px;
  height: 160px;
  object-fit: contain;
  background: white;
  border-radius: 12px;
  margin-top: 10px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

/* --------------------------------------------------------
   COMPONENTE PRINCIPAL
-------------------------------------------------------- */

export default function CrearProducto() {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    sede: "",
    stock: "",
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.nombre || !producto.descripcion || !producto.sede || !producto.stock) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      await crearProducto(
        {
          ...producto,
          stock: parseInt(producto.stock),
        },
        imagen
      );

      alert("✅ Producto creado correctamente");

      setProducto({ nombre: "", descripcion: "", sede: "", stock: "" });
      setImagen(null);
      setPreview(null);

      window.location.href = "/inventario";

    } catch (error) {
      console.error(error);
      alert("❌ Ocurrió un error al guardar el producto");
    }

    setLoading(false);
  };

  return (
    <PageContainer>
      <Card>
        <Titulo>Crear nuevo producto</Titulo>

        <Form onSubmit={handleSubmit}>

          <Label>Nombre del producto</Label>
          <Input
            name="nombre"
            placeholder="Ej. Impresora HP 2320"
            value={producto.nombre}
            onChange={handleChange}
            required
          />

          <Label>Descripción</Label>
          <TextArea
            name="descripcion"
            placeholder="Describe el producto aquí..."
            value={producto.descripcion}
            onChange={handleChange}
            required
          />

          <Label>Sede</Label>
          <Select
            name="sede"
            value={producto.sede}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar sede</option>
            <option value="COLEGIO_ZARATE">Colegio Zárate</option>
            <option value="ACADEMIA_ZARATE">Academia Zárate</option>
            <option value="Cusco">Cusco</option>
          </Select>

          <Label>Stock disponible</Label>
          <Input
            name="stock"
            type="number"
            value={producto.stock}
            placeholder="Ej. 10"
            onChange={handleChange}
            required
          />

          <Label>Imagen del producto</Label>
          <Input type="file" accept="image/*" onChange={handleImagen} />

          {preview && <ImagenPreview src={preview} alt="Vista previa" />}

          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar producto"}
          </Button>

        </Form>
      </Card>
    </PageContainer>
  );
}
