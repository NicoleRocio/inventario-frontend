import { createContext, useState, useEffect } from "react";
import { reducirStock } from "../service/productoService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Cargar carrito de localStorage
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("cartItems");
      if (guardado) setCartItems(JSON.parse(guardado));
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  }, []);

  // ✅ Guardar carrito
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  }, [cartItems]);

  // ✅ Agregar producto con reducción de stock
  const addToCart = async (producto) => {
    try {
      if (producto.stock <= 0) {
        alert("Stock insuficiente.");
        return;
      }

      // ✅ Reducir stock REAL en backend
      const actualizado = await reducirStock(producto.id, 1);

      // ✅ Actualizar carrito
      setCartItems((prev) => {
        const existe = prev.find((item) => item.id === producto.id);

        if (!existe) {
          return [...prev, { ...producto, cantidad: 1, stock: actualizado.stock }];
        }

        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1, stock: actualizado.stock }
            : item
        );
      });

    } catch (error) {
      alert("Error al agregar: " + error.message);
      console.error(error);
    }
  };

  const removeFromCart = (productoId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productoId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
