import axios from 'axios';
import { API_URL } from '../config'; // Importa el valor de API_URL desde config.js

// Obtener el token del localStorage
const getAuthToken = () => localStorage.getItem('token');

// Configurar los encabezados para incluir el token
const getConfig = (isMultipart = false) => ({
    headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}),
    },
});

// Obtener todos los productos
export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        throw error;
    }
};

// Obtener un producto por ID
export const getProduct = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error.message);
        throw error;
    }
};

// Crear un nuevo producto
export const createProduct = async (formData) => {
    try {
        // Asegúrate de que formData contenga todos los datos del producto y las imágenes
        const response = await axios.post(`${API_URL}/api/products/`, formData, getConfig(true));
        return response.data;
    } catch (error) {
        console.error('Error al crear el producto:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Actualizar un producto
export const updateProduct = async (id, formData) => {
    try {
        // Realiza la solicitud PUT usando axios
        const response = await axios.put(`${API_URL}/api/products/${id}`, formData, getConfig(true));
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        // Maneja errores de la solicitud
        console.error(`Error updating product ${id}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};


// Eliminar un producto
export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/products/${id}`, getConfig());
        return response.data;
    } catch (error) {
        console.error(`Error deleting product ${id}:`, error.message);
        throw error;
    }
};
