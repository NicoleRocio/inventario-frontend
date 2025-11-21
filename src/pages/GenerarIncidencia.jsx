import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

/* Animación */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* CONTENEDOR */
const Contenedor = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  background: #E4F3FA;
  min-height: 100vh;
  animation: ${fadeIn} 0.4s ease;
`;

/* FORMULARIO */
const Formulario = styled.div`
  background: white;
  width: 100%;
  max-width: 650px;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.1);
`;

const Titulo = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #2F4F5F;
  font-size: 1.6rem;
  font-weight: 600;
`;

const Campo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`;

const Label = styled.label`
  color: #2F4F5F;
  font-weight: 600;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  background: white;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.35);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  background: white;
  min-height: 130px;
  outline: none;
  resize: none;

  &:focus {
    border-color: #7EC4DD;
    box-shadow: 0 0 6px rgba(126,196,221,0.35);
  }
`;

const Boton = styled.button`
  width: 100%;
  padding: 14px;
  background: #7EC4DD;
  color: white;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;

  &:hover {
    background: #063c4eff;
    transform: translateY(-2px);
  }
`;

const MensajeExito = styled.p`
  margin-top: 15px;
  text-align: center;
  color: #1C7C3E;
  font-weight: 600;
`;

/* ---- SELECT PERSONALIZADO ---- */

const SelectBox = styled.div`
  position: relative;
`;

const SelectVisual = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #A7D4E6;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const OpcionLista = styled.div`
  position: absolute;
  top: 58px;
  left: 0;
  width: 100%;
  background: white;
  border: 1.5px solid #A7D4E6;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10;
`;

const Opcion = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  &:hover {
    background: #E4F3FA;
  }
`;

const ImgProducto = styled.img`
  width: 45px;
  height: 45px;
  object-fit: contain;
`;

/* ---- HISTORIAL ---- */
const Historial = styled.div`
  background: white;
  padding: 30px;
  width: 100%;
  max-width: 900px;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.1);
`;

const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

const Th = styled.th`
  background: #7EC4DD;
  color: white;
  padding: 12px;
`;

const Tr = styled.tr`
  &:nth-child(even) { background: #F7FBFC; }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #E7EEF1;
`;

const ImgMini = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  background: #f3f9fb;
  padding: 4px;
  border-radius: 6px;
`;

const Estado = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  background-color: ${({ estado }) =>
    estado === "Atendido" ? "rgba(40,167,69,0.12)" : "rgba(211,158,0,0.20)"};
  color: ${({ estado }) =>
    estado === "Atendido" ? "#1C7C3E" : "#8A6D00"};
`;





/* ----------------------------------
   COMPONENTE PRINCIPAL
---------------------------------- */

const GenerarIncidencia = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [incidencias, setIncidencias] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  /* Productos asignados de ejemplo */
  const productosAsignados = [
    {
      id: 1,
      nombre: "Laptop Lenovo ThinkPad",
      imagen: "https://cdn-icons-png.flaticon.com/512/270/270798.png"
    },
    {
      id: 2,
      nombre: "Monitor Samsung 24\"",
      imagen: "https://cdn-icons-png.flaticon.com/512/1998/1998671.png"
    }
  ];

  const [formData, setFormData] = useState({
    usuario: "",
    area: "",
    descripcion: "",
    estado: "Pendiente",
  });

  /* Cargar usuario */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
      setUsuarioLogueado(user);
      setFormData((prev) => ({ ...prev, usuario: user.nombre }));
    }
  }, []);

  /* Cargar historial */
  useEffect(() => {
    if (!usuarioLogueado) return;

    const todas = JSON.parse(localStorage.getItem("incidencias")) || [];
    const filtradas = todas.filter((i) => i.usuario === usuarioLogueado.nombre);
    setIncidencias(filtradas);
  }, [usuarioLogueado]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nueva = {
      id: Date.now(),
      ...formData,
      producto: productoSeleccionado?.nombre || "",
      imagenProducto: productoSeleccionado?.imagen || "",
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nuevas = [...incidencias, nueva];
    setIncidencias(nuevas);

    const todas = JSON.parse(localStorage.getItem("incidencias")) || [];
    todas.push(nueva);
    localStorage.setItem("incidencias", JSON.stringify(todas));

    setMensaje("✅ Incidencia registrada correctamente.");
    setFormData({ ...formData, area: "", descripcion: "" });
    setProductoSeleccionado(null);

    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <Contenedor>

      {/* FORMULARIO */}
      <Formulario>
        <Titulo>Registrar Incidencia</Titulo>

        <form onSubmit={handleSubmit}>
          
          <Campo>
            <Label>Usuario:</Label>
            <Input type="text" value={formData.usuario} disabled />
          </Campo>

          <Campo>
            <Label>Área:</Label>
            <Input
              type="text"
              name="area"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="Ejemplo: Administración"
              required
            />
          </Campo>

          {/* SELECT PERSONALIZADO */}
          <Campo>
            <Label>Producto afectado:</Label>

            <SelectBox>
              <SelectVisual onClick={() => setMostrarOpciones(!mostrarOpciones)}>
                {productoSeleccionado ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <ImgProducto src={productoSeleccionado.imagen} alt="" />
                    {productoSeleccionado.nombre}
                  </div>
                ) : (
                  "Seleccione un producto"
                )}
              </SelectVisual>

              {mostrarOpciones && (
                <OpcionLista>
                  {productosAsignados.map((p) => (
                    <Opcion
                      key={p.id}
                      onClick={() => {
                        setProductoSeleccionado(p);
                        setMostrarOpciones(false);
                      }}
                    >
                      <ImgProducto src={p.imagen} alt="" />
                      {p.nombre}
                    </Opcion>
                  ))}
                </OpcionLista>
              )}
            </SelectBox>
          </Campo>

          <Campo>
            <Label>Descripción:</Label>
            <TextArea
              name="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe el problema..."
              required
            />
          </Campo>

          <Boton type="submit">Registrar incidencia</Boton>
        </form>

        {mensaje && <MensajeExito>{mensaje}</MensajeExito>}
      </Formulario>

      {/* HISTORIAL */}
      <Historial>
        <Titulo>Historial de Incidencias</Titulo>

        {incidencias.length === 0 ? (
          <p>No tienes incidencias registradas.</p>
        ) : (
          <Tabla>
            <thead>
              <tr>
                <Th>Producto</Th>
                <Th>Imagen</Th>
                <Th>Área</Th>
                <Th>Descripción</Th>
                <Th>Fecha</Th>
                <Th>Hora</Th>
                <Th>Estado</Th>
              </tr>
            </thead>

            <tbody>
              {incidencias.map((i) => (
                <Tr key={i.id}>
                  <Td>{i.producto}</Td>
                  <Td>
                    <ImgMini src={i.imagenProducto} alt="" />
                  </Td>
                  <Td>{i.area}</Td>
                  <Td>{i.descripcion}</Td>
                  <Td>{i.fecha}</Td>
                  <Td>{i.hora}</Td>
                  <Td>
                    <Estado estado={i.estado}>{i.estado}</Estado>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Tabla>
        )}
      </Historial>

    </Contenedor>
  );
};

export default GenerarIncidencia;
