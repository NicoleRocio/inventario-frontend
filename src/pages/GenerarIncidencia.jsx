import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useLocation } from "react-router-dom"; // 1. IMPORTANTE: Importar useLocation
import { crearIncidencia, getIncidenciasPorUsuario, } from "../service/incidenciaService";
import { getProductosAsignados } from "../service/pedidoService";

/* ---------------------------------------------------
   ANIMACIÓN
--------------------------------------------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ---------------------------------------------------
   ESTILOS GENERALES
--------------------------------------------------- */
const Contenedor = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  background: #e4f3fa;
  min-height: 100vh;
  animation: ${fadeIn} 0.4s ease;
`;

const Formulario = styled.div`
  background: white;
  width: 100%;
  max-width: 650px;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
`;

const Titulo = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #2f4f5f;
  font-size: 1.6rem;
  font-weight: 600;
`;

const Campo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`;

const Label = styled.label`
  color: #2f4f5f;
  font-weight: 600;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #a7d4e6;
  background: white;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #7ec4dd;
    box-shadow: 0 0 6px rgba(126, 196, 221, 0.35);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #a7d4e6;
  background: white;
  min-height: 130px;
  outline: none;
  resize: none;

  &:focus {
    border-color: #7ec4dd;
    box-shadow: 0 0 6px rgba(126, 196, 221, 0.35);
  }
`;

const Boton = styled.button`
  width: 100%;
  padding: 14px;
  background: #7ec4dd;
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
  color: #1c7c3e;
  font-weight: 600;
`;

/* ---------------------------------------------------
   SELECT PERSONALIZADO
--------------------------------------------------- */
const SelectBox = styled.div`
  position: relative;
`;

const SelectVisual = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #a7d4e6;
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
  border: 1.5px solid #a7d4e6;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

const Opcion = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  &:hover {
    background: #e4f3fa;
  }
`;

const ImgProducto = styled.img`
  width: 45px;
  height: 45px;
  object-fit: contain;
`;

/* ---------------------------------------------------
   HISTORIAL
--------------------------------------------------- */
const Historial = styled.div`
  background: white;
  padding: 30px;
  width: 100%;
  max-width: 900px;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
`;

const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

const Th = styled.th`
  background: #7ec4dd;
  color: white;
  padding: 12px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #f7fbfc;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e7eef1;
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
    estado === "Atendido"
      ? "rgba(40,167,69,0.12)"
      : "rgba(211,158,0,0.20)"};
  color: ${({ estado }) =>
    estado === "Atendido" ? "#1c7c3e" : "#8a6d00"};
`;

/* ---------------------------------------------------
   COMPONENTE PRINCIPAL
--------------------------------------------------- */
const GenerarIncidencia = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [productosAsignados, setProductosAsignados] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const location = useLocation();
  console.log("📍 Estado recibido:", location.state);
  const [formData, setFormData] = useState({
    usuario: "",
    area: "",
    descripcion: "",
    estado: "Pendiente",
  });
  const selectRef = useRef(null);

  /*scroll a seccion del historial si viene de Home */
  useEffect(() => {
    // 1. Verificamos la orden
    if (location.state?.irAlHistorial) {

      // 2. Esperamos a que los datos carguen
      setTimeout(() => {
        const seccion = document.getElementById("historial-incidencias");

        if (seccion) {
          // scrollIntoView busca el contenedor correcto automáticamente.
          // block: "start" pone el título de la tabla justo al inicio de la pantalla (arriba).
          // behavior: "smooth" hace que deslice suave.
          seccion.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [location, incidencias]);
  /* Cerrar select cuando se hace click afuera */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setMostrarOpciones(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* CARGAR USUARIO */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
      setUsuarioLogueado(user);
      setFormData((prev) => ({ ...prev, usuario: user.nombre }));
    }
  }, []);

  /* CARGAR PRODUCTOS ASIGNADOS */
  useEffect(() => {
    if (!usuarioLogueado) return;

    const cargar = async () => {
      try {
        const data = await getProductosAsignados(usuarioLogueado.id);

        const adaptados = data.map((p) => ({
          id: p.productoId,
          nombre: p.nombreProducto,
          imagen: `http://localhost:8080/uploads/imagenes/${p.imagen}`,
          cantidad: p.cantidad,
        }));

        setProductosAsignados(adaptados);
      } catch (err) {
        console.log("Error cargando productos asignados", err);
      }
    };

    cargar();
  }, [usuarioLogueado]);

  /* CARGAR HISTORIAL REAL */
  useEffect(() => {
    if (!usuarioLogueado) return;

    const cargarHistorial = async () => {
      try {
        const data = await getIncidenciasPorUsuario(usuarioLogueado.id);
        setIncidencias(data);
      } catch (e) {
        console.log("Error cargando historial de incidencias", e);
      }
    };

    cargarHistorial();
  }, [usuarioLogueado]);

  /* ENVIAR INCIDENCIA */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await crearIncidencia({
        usuarioId: usuarioLogueado.id,
        productoId: productoSeleccionado?.id,
        nombreProducto: productoSeleccionado?.nombre,
        imagenProducto: productoSeleccionado?.imagen.replace(
          "http://localhost:8080/uploads/imagenes/",
          ""
        ),
        area: formData.area,
        descripcion: formData.descripcion,
      });

      setMensaje("✅ Incidencia registrada correctamente.");
      setFormData((prev) => ({ ...prev, area: "", descripcion: "" }));
      setProductoSeleccionado(null);

      // Recargar historial real
      const data =
        await getIncidenciasPorUsuario(usuarioLogueado.id);
      setIncidencias(data);
    } catch (err) {
      console.log("Error registrando incidencia", err);
      setMensaje("❌ Error al registrar la incidencia.");
    }

    setTimeout(() => setMensaje(""), 3000);
  };

  /* ---------------------------------------------------
     RENDER
  --------------------------------------------------- */
  return (
    <Contenedor>
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
              value={formData.area}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  area: e.target.value,
                })
              }
              placeholder="Ejemplo: Administración"
              required
            />
          </Campo>

          {/* SELECT PRODUCTO */}
          <Campo>
            <Label>Producto afectado:</Label>

            <SelectBox ref={selectRef}>
              <SelectVisual
                onClick={() => setMostrarOpciones(!mostrarOpciones)}
              >
                {productoSeleccionado ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <ImgProducto
                      src={productoSeleccionado.imagen}
                      alt=""
                    />
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
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descripcion: e.target.value,
                })
              }
              placeholder="Describe el problema..."
              required
            />
          </Campo>

          <Boton type="submit">Registrar incidencia</Boton>
        </form>

        {mensaje && <MensajeExito>{mensaje}</MensajeExito>}
      </Formulario>

      {/* HISTORIAL */}
      <Historial id="historial-incidencias" style={{ marginTop: "5px", scrollMarginTop: "16px" }}>
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
                  <Td>{i.nombreProducto}</Td>
                  <Td>
                    <ImgMini
                      src={`http://localhost:8080/uploads/imagenes/${i.imagenProducto}`}
                      alt=""
                    />
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
