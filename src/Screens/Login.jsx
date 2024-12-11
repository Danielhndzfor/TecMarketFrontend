import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Usa tu AuthContext
import { ChefHat, Coffee } from 'lucide-react';
import { toast } from 'react-toastify';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/home');
        }
    }, [user, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }

        try {
            await login(email, password);
            setError('');
            if (user) {
                const destination = user.role === 'admin' ? '/admin' : '/home';
                navigate(destination);
            }
        } catch (err) {
            // Manejando errores sin imprimirlos en la consola
            toast.error('Credenciales incorrectas o error al conectarse.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-center mb-6">
                    <ChefHat className="h-12 w-12 text-green-600 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                {/* <div className="mt-6 text-center">
                    <a href="/forgot-password" className="text-green-600 hover:text-green-700 text-sm">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div> */}
                <div className="mt-8 border-t pt-6">
                    <p className="text-sm text-gray-600 text-center">¿No tienes una cuenta?</p>
                    <a
                        href="/register"
                        className="w-full mt-2 block text-center border border-green-600 text-green-600 py-2 rounded-md hover:bg-green-50"
                    >
                        Regístrate
                    </a>
                </div>
                <div className="mt-6 flex items-center justify-center text-green-700">
                    <Coffee className="h-5 w-5 mr-2" />
                    <span className="text-sm">Disfruta de la mejor experiencia</span>
                </div>
            </div>
        </div>
    );
}

export default Login;

