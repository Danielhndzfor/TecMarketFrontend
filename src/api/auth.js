import axios from 'axios';
import { API_URL } from '../config'; // Asegúrate de usar la ruta correcta

export const getUser = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` } // Usa el token del localStorage
        });
        return response.data;  // Asegúrate de que `data` contenga todos los campos del usuario, incluido el rol

    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error(error.response?.data?.message || 'Error fetching user data');
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password,
        });

        // Guarda el token en localStorage
        localStorage.setItem('token', response.data.token);

        // Devuelve los datos del usuario (incluyendo email y role)
        return response.data; 
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
};



// Función para hacer registro
export const register = async (name, email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            name,
            email,
            password,
            role,  // El role se envía aquí
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error during registration');
    }
};

// Función para hacer logout
export const logout = async () => {
    const token = localStorage.getItem('token');
    try {
        await axios.post(`${API_URL}/api/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` } // Usa el token del localStorage
        });
        localStorage.removeItem('token'); // Elimina el token del localStorage
        // Redirige a una ruta protegida tras el logout
        window.location.href = '/'; // O la ruta protegida que desees
    } catch (error) {
        console.error('Error al hacer logout:', error.response?.data?.message || error.message);
    }
};

