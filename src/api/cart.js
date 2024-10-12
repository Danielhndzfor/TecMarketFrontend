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
export const addToCart = async (userId, productId, quantity) => {
    try {
        const response = await axiosInstance.post('/cart/add', {
            userId,
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
        const response = await axiosInstance.get(`/cart/${userId}`); // Corregido
        return response.data;  // Devuelve los productos del carrito
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        throw error;
    }
};

// Función para eliminar un producto del carrito
export const removeFromCart = async (userId, productId) => {
    try {
        const response = await axiosInstance.post('/cart/remove', {
            userId,
            productId
        });
        return response.data;  // Devuelve el carrito actualizado
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        throw error;
    }
};

// Función para vaciar el carrito (ejecutada tras confirmar la compra)
export const clearCart = async (userId) => {
    try {
        const response = await axiosInstance.delete(`/cart/clear/${userId}`);
        return response.data;  // Devuelve el carrito vacío
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        throw error;
    }
};
