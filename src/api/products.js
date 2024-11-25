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
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error fetching products:', error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};

// Obtener productos por el vendedor autenticado
export const getProductsBySeller = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products/seller`);
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error fetching products by seller:', error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};

// Obtener productos por categoría
export const getProductsByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/api/products/category/${categoryId}`, getConfig());
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error(`Error fetching products for category ${categoryId}:`, error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};


// Obtener un producto por ID
export const getProduct = async (productId) => { // Cambié 'id' a 'productId'
    try {
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};

// Crear un nuevo producto
export const createProduct = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/products/`, formData, getConfig(true));
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error al crear el producto:', error.response ? error.response.data : error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};

// Actualizar un producto
export const updateProduct = async (productId, formData) => { // Cambié 'id' a 'productId'
    try {
        const response = await axios.put(`${API_URL}/api/products/${productId}`, formData, getConfig(true));
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error.response ? error.response.data : error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};

// Actualizar el stock de un producto
export const updateProductStock = async (productId, newStatus, quantity) => {
    try {
        // Verificar que los parámetros sean válidos
        if (!newStatus || !quantity || isNaN(quantity) || quantity <= 0) {
            throw new Error("Los parámetros no son válidos.");
        }

        // Enviar la solicitud PUT con los datos necesarios
        const response = await axios.put(`${API_URL}/api/products/${productId}/stock`, { newStatus, quantity });

        // Devolver la respuesta
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        // Manejar errores de manera más específica
        console.error(`Error actualizando el stock del producto ${productId}:`, error.response ? error.response.data : error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};



// Eliminar un producto
export const deleteProduct = async (productId) => { // Cambié 'id' a 'productId'
    try {
        const response = await axios.delete(`${API_URL}/api/products/${productId}`, getConfig());
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error(`Error deleting product ${productId}:`, error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};

// Obtener el total de productos
export const getTotalProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products/total`, getConfig());
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error al obtener el total de productos:', error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};

// Obtener los 5 productos más vendidos
export const getTopSoldProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products/top-sold`, getConfig());
        return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
        console.error('Error al obtener los productos más vendidos:', error.message);
        throw error; // Lanza el error para manejarlo en la llamada
    }
};
