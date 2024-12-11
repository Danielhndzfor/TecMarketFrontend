import axios from 'axios';
import { API_URL } from '../config'; // Asegúrate de usar la ruta correcta

// Define la URL base de tu API
const BASE_URL = `${API_URL}/api`;

// Configura una instancia de axios con la URL base
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Exporta la instancia de axios
export default axiosInstance;

// Función para añadir un producto al carrito
export const addToCart = async (userId, cartId, productId, quantity) => {
    try {
        const response = await axiosInstance.post('/cart/add', {
            userId,      // Incluye userId
            cartId,      // Asegúrate de que cartId sea un número válido
            productId,
            quantity
        });
        return response.data;  // Devuelve el carrito actualizado
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        throw error;
    }
};



// Función para obtener el carrito del usuario
export const getCart = async (userId) => {
    try {
        const response = await axiosInstance.get(`/cart/${userId}`); // Cambia a usar userId
        return response.data;  // Devuelve los productos del carrito
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        throw error;
    }
};

// Función para eliminar un producto del carrito
export const removeFromCart = async (userId, productId, cartId) => { // Reordena los parámetros
    try {
        const response = await axiosInstance.post('/cart/remove', {
            userId,      // Incluye userId
            productId,   // Asegúrate de que productId sea un string válido
            cartId       // Asegúrate de que cartId sea un número válido
        });
        return response.data;  // Devuelve el carrito actualizado
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        throw error;
    }
};

// Función para aumentar la cantidad de un producto en el carrito
export const increaseQuantity = async (userId, cartId, productId) => {
    try {
        // Asegúrate de que cartId y productId sean cadenas
        const response = await axiosInstance.patch(`/cart/${cartId}/increase`, {
            userId,      // Incluye userId
            productId,   // Incluye productId
            cartId,      // Incluye cartId
        });

        return response.data;  // Devuelve el carrito actualizado
    } catch (error) {
        console.error('Error al aumentar la cantidad del producto:', error);
        throw error;
    }
};



// Función para disminuir la cantidad de un producto en el carrito
export const decreaseQuantity = async (userId, cartId, productId) => {
    try {
        // Asegúrate de que cartId y productId sean cadenas
        const response = await axiosInstance.patch(`/cart/${cartId}/decrease`, {
            userId,      // Incluye userId
            productId,   // Incluye productId
            cartId,      // Incluye cartId
        });

        return response.data;  // Devuelve el carrito actualizado
    } catch (error) {
        console.error('Error al aumentar la cantidad del producto:', error);
        throw error;
    }
};







// Función para vaciar el carrito (ejecutada tras confirmar la compra)
export const clearCart = async (userId) => { // No necesita cartId
    try {
        const response = await axiosInstance.delete(`/cart/clear/${userId}`); // Cambia a usar userId
        return response.data;  // Devuelve el carrito vacío
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        throw error;
    }
};
