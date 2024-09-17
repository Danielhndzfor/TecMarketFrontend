import React, { createContext, useState } from 'react';

// Crear el contexto
export const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
    // Estado inicial del carrito
    const [cart, setCart] = useState({ items: [] });

    // Función para agregar un producto al carrito
    const addToCart = (product) => {
        setCart((prevCart) => {
            // Verificar si el producto ya está en el carrito
            const existingProduct = prevCart.items.find(item => item.product === product.productId);

            if (existingProduct) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                return {
                    ...prevCart,
                    items: prevCart.items.map(item =>
                        item.product === product.productId
                            ? { ...item, quantity: item.quantity + product.quantity }
                            : item
                    )
                };
            } else {
                // Si el producto no está en el carrito, agregarlo
                return {
                    ...prevCart,
                    items: [...prevCart.items, product]
                };
            }
        });
    };

    // Función para eliminar un producto del carrito
    const removeFromCart = (productId) => {
        setCart((prevCart) => ({
            ...prevCart,
            items: prevCart.items.filter(item => item.product !== productId)
        }));
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};


