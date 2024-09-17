import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data); // Suponiendo que la respuesta contiene el usuario
            } catch (error) {
                console.error('Error al obtener el usuario:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            const userResponse = await axios.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userResponse.data);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw new Error('Error al iniciar sesión');
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/auth/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);
