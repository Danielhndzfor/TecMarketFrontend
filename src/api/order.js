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
        const response = await axiosInstance.post('/orders/', orderData);
        return response.data; // Retorna la orden creada
    } catch (error) {
        console.error('Error creating order:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Función para obtener todas las órdenes
export const getAllOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders/all');
        return response.data; // Retorna la lista de órdenes
    } catch (error) {
        console.error('Error fetching orders:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Función para obtener todas las órdenes de un vendedor
export const getOrdersBySeller = async (sellerId) => {
    try {
        const response = await axiosInstance.get(`/orders/seller/${sellerId}`);
        
        // Validación de datos (opcional)
        if (!Array.isArray(response.data)) {
            throw new Error('La respuesta no es un array de órdenes');
        }
        
        return response.data; // Asegúrate de que esto devuelva un array de órdenes
    } catch (error) {
        console.error('Error fetching seller orders:', error.response ? error.response.data : error.message);
        throw error; // Puedes lanzar el error para manejarlo en el componente que llama a esta función
    }
};

// Función para obtener todas las órdenes de un comprador específico
export const getOrdersByBuyer = async (buyerId) => {
    try {
        const response = await axiosInstance.get(`/orders/buyer/${buyerId}`);
        
        // Verificar que la respuesta contiene la propiedad `data` como array
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            console.error('Formato inesperado de respuesta:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        throw error; // Re-lanzar el error para manejo global
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

