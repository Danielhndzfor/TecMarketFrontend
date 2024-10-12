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

// Función para crear un pedido
export const createOrder = async (orderData) => {
    const { userId, items, paymentMethod } = orderData;

    if (!userId || !items || !items.length || !paymentMethod) {
        throw new Error('Todos los campos son requeridos.');
    }

    try {
        const response = await axiosInstance.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error.response ? error.response.data : error.message);
        throw error;
    }
};


// Función para obtener todas las órdenes
export const getAllOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error.response ? error.response.data : error.message);
        throw error;
    }
};


// Función para obtener todas las órdenes de un vendedor
export const getOrdersBySeller = async (sellerId) => {
    try {
        const response = await axiosInstance.get(`/orders?sellerId=${sellerId}`);
        return response.data; // Asegúrate de que esto devuelva un array de órdenes
    } catch (error) {
        console.error('Error fetching seller orders:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Función para obtener una orden por ID
export const getOrderById = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/orders/${orderId}`);
        return response.data; // Retorna la orden
    } catch (error) {
        console.error('Error fetching order:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Función para actualizar el estado de un artículo en una orden
export const updateItemStatus = async (orderId, itemId, newStatus) => {
    try {
        const response = await axiosInstance.put(`/orders/${orderId}/items/${itemId}/status`, { status: newStatus });
        return response.data; // Retorna la orden actualizada
    } catch (error) {
        console.error('Error updating item status:', error.response ? error.response.data : error.message);
        throw error;
    }
};



// Función para actualizar una orden completa
export const updateOrder = async (orderId, updates) => {
    try {
        const response = await axiosInstance.put(`/orders/${orderId}`, updates);
        return response.data; // Retorna la orden actualizada
    } catch (error) {
        console.error('Error updating order:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Función para eliminar una orden
export const deleteOrder = async (orderId) => {
    try {
        const response = await axiosInstance.delete(`/orders/${orderId}`);
        return response.data; // Retorna el mensaje de éxito
    } catch (error) {
        console.error('Error deleting order:', error.response ? error.response.data : error.message);
        throw error;
    }
};
