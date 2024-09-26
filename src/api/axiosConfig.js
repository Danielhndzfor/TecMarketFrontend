// axiosConfig.js
import axios from 'axios';
import { logout } from './auth'; 
import { API_URL } from '../config'; // Asegúrate de usar la ruta correcta

// URL base de la API
axios.defaults.baseURL = `${API_URL}/api`;


// Configura un interceptor para añadir el token en cada solicitud
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Configura un interceptor para detectar errores 401
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Si recibimos un error 401, cerramos sesión
            logout();  // Esta función eliminará el token y redirigirá al login
        }
        return Promise.reject(error);
    }
);
