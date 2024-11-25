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
        const response = await axios.get(`${API_URL}/api/categories`, getConfig());
        return response.data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw error;
    }
};

// Obtener una categoría por ID
export const getCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/categories/${id}`, getConfig());
        return response.data;
    } catch (error) {
        console.error('Error al obtener la categoría por ID:', error.response ? error.response.data : error.message);
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
export const updateCategory = async (categoryId, formData) => {
    try {
        // Verifica que ambos campos (name y description) estén presentes
        if (!formData.name || !formData.description) {
            alert('Todos los campos son requeridos.');
            return;
        }

        // Realiza la solicitud PUT para actualizar la categoría
        const response = await axios.put(`https://tec-market-backend.vercel.app/api/categories/${categoryId}`, formData);

        // Si la solicitud es exitosa, devuelve la categoría actualizada
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la categoría:', error.response ? error.response.data : error);
        alert('Error al actualizar la categoría');
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