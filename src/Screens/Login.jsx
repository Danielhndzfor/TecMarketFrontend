import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Usa tu AuthContext en lugar de manejar manualmente el token

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login, user } = useAuth();  // Extraemos login y el usuario desde el AuthContext
    const navigate = useNavigate();

    const { email, password } = formData;

    // Efecto para redirigir si el usuario ya está autenticado
    useEffect(() => {
        if (user) {
            navigate('/home');  // Si el usuario ya está autenticado, redirigir inmediatamente
        }
    }, [user, navigate]);  // Dependencia del estado del usuario

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);  // Llamada al login del contexto
            // Redirigir tras el login exitoso (esto ya está cubierto en el useEffect si el usuario cambia)
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div>
            <h1>Inicio de Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
                <div>
                    <p>¿No tienes una cuenta? <a href="/register">Regístrate</a></p>
                </div>
            </form>
        </div>
    );
}

export default Login;
