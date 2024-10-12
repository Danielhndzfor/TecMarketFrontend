import React, { useState } from 'react';
import { register } from '../api/auth';  // Asegúrate de importar desde el archivo correcto
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'comprador'  // Valor por defecto
    });

    const { name, firstName, lastName, dateOfBirth, phoneNumber, email, password, confirmPassword } = formData; // Excluimos role
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
            await register(name, firstName, lastName, dateOfBirth, phoneNumber, email, password, formData.role);  // Envía el rol predeterminado
            navigate('/');  // Redirige al inicio después del registro
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
                    <label htmlFor="firstName">Primer Nombre:</label>
                    <input type="text" id="firstName" name="firstName" value={firstName} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="lastName">Apellidos:</label>
                    <input type="text" id="lastName" name="lastName" value={lastName} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="dateOfBirth">Fecha de Nacimiento:</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={dateOfBirth} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Número de Teléfono:</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={handleChange} required />
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
                {/* El campo de rol ha sido eliminado */}
                <button type="submit">Registrar</button>
                <div>
                    <a href="/login">Iniciar Sesión</a>
                </div>
            </form>
        </div>
    );
}

export default Register;
