import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
    
            try {
                const response = await axios.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                setUser(null);
                console.error('Error al obtener el usuario:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUser(); // Llamada a la función para cargar el usuario al montar el componente
    }, []);
    
    

    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', { email, password });
    
            const { token, user } = response.data;
    
            // Guarda el token en localStorage
            localStorage.setItem('token', token);
    
            // Actualiza el estado de autenticación
            setUser(user);
    
            // Redirige a una ruta protegida tras el login
            window.location.href = '/home'; // O la ruta protegida que desees
        } catch (error) {
            console.error('Error durante el login:', error.response?.data?.message || error.message);
            throw error;
        }
    };
    
    

    const logout = async () => {
        // Implementación de logout...
        localStorage.removeItem('token');
        setUser(null);
        // Redirige a una ruta protegida tras el login
        window.location.href = '/'; // O la ruta protegida que desees
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
