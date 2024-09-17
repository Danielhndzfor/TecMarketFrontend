import React, { useState } from 'react';
import { register } from '../api/auth';  // Asegúrate de importar desde el archivo correcto
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'comprador'  // Valor por defecto
    });

    const { name, email, password, confirmPassword, role } = formData;
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        try {
            await register(name, email, password, role);  // Usa 'register' aquí
            // recargar y enviar a login
            
            navigate('/');  // Redirige al inicio de sesión después del registro
        } catch (error) {
            console.error('Error al registrar el usuario:', error.message);
            // Manejo de errores
        }
    };

    return (
        <div>
            <h1>Registro de Usuario</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre:</label>
                    <input type="text" id="name" name="name" value={name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" value={password} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="role">Rol:</label>
                    <select id="role" name="role" value={role} onChange={handleChange}>
                        <option value="comprador">Comprador</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <button type="submit">Registrar</button>
                <div>
                    <a href="/login">Iniciar Sesión</a>
                </div>
            </form>
        </div>
    );
}

export default Register;




