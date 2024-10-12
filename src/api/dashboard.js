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

// Función para obtener el resumen de ventas
export const getSalesSummary = async () => {
    try {
        const response = await axiosInstance.get('/dashboard/sales-summary'); // Ajusta la ruta según tu API
        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error('Error fetching sales summary:', error);
        throw error; // Lanza el error para manejarlo donde se llame la función
    }
};

// Función para actualizar el estado de una orden
export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error; // Lanza el error para manejarlo donde se llame la función
    }
};
