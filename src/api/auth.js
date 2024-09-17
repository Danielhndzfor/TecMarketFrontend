import axios from 'axios';

// Define la URL base de tu API
const API_URL = 'https://tecmarketback-372c5b6708b1.herokuapp.com/api/auth';


export const getUser = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/me`, {
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

// Función para hacer login
export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Error al iniciar sesión');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Guarda el token en localStorage
    return data; // Suponiendo que data contiene { email, role, token, etc. }
};


// Función para hacer registro
export const register = async (name, email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
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
        await axios.post(`${API_URL}/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` } // Usa el token del localStorage
        });
        localStorage.removeItem('token'); // Elimina el token del localStorage
    } catch (error) {
        console.error('Error al hacer logout:', error.response?.data?.message || error.message);
    }
};

