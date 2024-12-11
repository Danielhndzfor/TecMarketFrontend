import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, UserPlus } from "lucide-react";
import { register } from "../api/auth";
import { toast } from "react-toastify";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "comprador", // Valor por defecto
    });

    const { name, firstName, lastName, dateOfBirth, phoneNumber, email, password, confirmPassword } = formData;
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!name || !firstName || !dateOfBirth || !phoneNumber || !email || !password || !confirmPassword) {
            toast.error("Por favor, completa todos los campos obligatorios.");
            return;
        }
    
        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }
    
        try {
            // Llamar a la función de registro que hemos importado
            const response = await register(
                name, 
                firstName, 
                lastName, 
                dateOfBirth, 
                phoneNumber, 
                email, 
                password, 
                formData.role
            );
    
            toast.success("¡Registro exitoso! Redirigiendo...");
            
            setTimeout(() => {
                navigate("/"); // Redirigir a la página de inicio de sesión
            }, 5000);  // Espera 2 segundos antes de redirigir
        } catch (error) {
            
            // Verificar si el error tiene la respuesta del backend
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                toast.error(errorMessage);  // Mostrar el mensaje de error desde el backend
            } else {
                toast.error("El usuario ya existe.");  // Mostrar un mensaje genérico
            }
        }
    };
    
    
    
    
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <div className="flex items-center justify-center mb-6">
                    <UserPlus className="h-12 w-12 text-green-600 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-800">Registro de Usuario</h1>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            *Nombre(s)
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleChange}
                            placeholder="Nombre"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            *Primer Apellido
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleChange}
                            placeholder="Primer Nombre"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Segundo Apellido
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleChange}
                            placeholder="Apellidos"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                            *Fecha de Nacimiento
                        </label>
                        <input
                            id="dateOfBirth"
                            type="date"
                            name="dateOfBirth"
                            value={dateOfBirth}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            *Número de Teléfono
                        </label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={handleChange}
                            placeholder="123-456-7890"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            *Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            *Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            *Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
                <div className="mt-8 border-t pt-6">
                    <p className="text-sm text-gray-600 text-center">¿Ya tienes una cuenta?</p>
                    <a
                        href="/"
                        className="w-full mt-2 block text-center border border-green-600 text-green-600 py-2 rounded-md hover:bg-green-50"
                    >
                        Inicia Sesión
                    </a>
                </div>
                <div className="mt-6 flex items-center justify-center text-green-700">
                    <Coffee className="h-5 w-5 mr-2" />
                    <span className="text-sm">Disfruta de una experiencia completa</span>
                </div>
            </div>
        </div>
    );
}

export default Register;

