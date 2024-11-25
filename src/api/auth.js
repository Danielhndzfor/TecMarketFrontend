import axios from 'axios';
import { API_URL } from '../config'; // Asegúrate de usar la ruta correcta

export const getUser = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Asegúrate de que `data` contenga todos los campos del usuario, incluido el rol
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
export const register = async (name, firstName, lastName, dateOfBirth, phoneNumber, email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            name,
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            email,
            password,
            role, // El role se envía aquí (opcional)
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error durante el registro');
    }
};

// 1. Actualizar rol de un usuario específico
export const updateUserRole = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.patch(`${API_URL}/api/auth/${userId}/role`, { role: newRole }, {
            headers: { Authorization: `Bearer ${token}` } // Asegúrate de incluir el token aquí
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el rol del usuario');
    }
};

// 4. Obtener todos los usuarios
export const getAllUsers = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.users; // Asegúrate de que este campo exista en la respuesta
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener la lista de usuarios');
    }
};


// 5. Actualizar datos de un usuario
export const updateUser = async (userId, updatedData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.put(`${API_URL}/api/auth/update-user/${userId}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` } // Incluye el token aquí
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
    }
};

// Función para obtener el total de usuarios
export const getTotalUsersCount = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/total`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.totalUsers; // Asegúrate de que este campo exista en la respuesta
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el total de usuarios');
    }
};

// Función para obtener el conteo de usuarios con rol de "vendedor"
export const getSellersCount = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/sellers`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.sellers; // Asegúrate de que este campo exista en la respuesta
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el conteo de vendedores');
    }
};

// Función para obtener el conteo de usuarios con rol de "comprador"
export const getBuyersCount = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/buyers`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.buyers; // Asegúrate de que este campo exista en la respuesta
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el conteo de compradores');
    }
};

// Función para obtener el conteo de usuarios registrados hoy
export const getUsersTodayCount = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/today`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.count; // Asegúrate de que este campo exista en la respuesta
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el conteo de usuarios de hoy');
    }
};

// Función para obtener el conteo de usuarios registrados esta semana
export const getUsersThisWeekCount = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/this-week`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.count; // Asegúrate de que este campo exista en la respuesta
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el conteo de usuarios de esta semana');
    }
};

// Función para obtener el conteo de usuarios registrados este mes
export const getUsersThisMonthCount = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/auth/this-month`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.count; // Asegúrate de que este campo exista en la respuesta
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener el conteo de usuarios de este mes');
    }
};

// Función para hacer logout
export const logout = async () => {
    const token = localStorage.getItem('token');
    try {
        await axios.post(`${API_URL}/api/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token'); // Elimina el token del localStorage
        // Redirige a una ruta protegida tras el logout
        window.location.href = '/'; // O la ruta protegida que desees
    } catch (error) {
        console.error('Error al hacer logout:', error.response?.data?.message || error.message);
    }
};
