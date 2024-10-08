import axios from 'axios';
import { API_URL } from '../config'; // Importa el valor de API_URL desde config.js

// Obtener el token del localStorage
const getAuthToken = () => localStorage.getItem('token');

// Configurar los encabezados para incluir el token
const getConfig = () => ({
    headers: {
        Authorization: `Bearer ${getAuthToken()}`,
    },
});

// Obtener todas las categorías
export const getCategories = async () => {
    try {
        // Concatenar la ruta específica '/categories' a la URL base
        const response = await axios.get(`${API_URL}/api/categories`, getConfig());
        return response.data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw error;
    }
};

// Crear una nueva categoría
export const createCategory = async (name, description) => {
    try {
        const response = await axios.post(`${API_URL}/api/categories`, { name, description }, getConfig());
        return response.data;
    } catch (error) {
        console.error('Error al crear la categoría:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Actualizar una categoría
export const updateCategory = async (id, name, description) => {
    try {
        const response = await axios.put(`${API_URL}/api/categories/${id}`, { name, description }, getConfig());
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la categoría:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Eliminar una categoría
export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/categories/${id}`, getConfig());
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la categoría:', error.response ? error.response.data : error.message);
        throw error;
    }
};
