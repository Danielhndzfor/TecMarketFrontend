import React, { useEffect, useState } from 'react';
import { getUser } from '../api/auth'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom'; // Para redirigir al formulario

function NavBar() {
    const [role, setRole] = useState('comprador');
    const [userId, setUserId] = useState('');
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(); // Obtener datos del usuario
                setUserId(userData._id);          // Guardar el ID del usuario
                setRole(userData.role);           // Guardar el rol actual del usuario
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        };

        fetchUser();
    }, []);

    const handleBecomeSeller = () => {
        // Redirige al formulario de vendedor
        navigate('/convertirse-vendedor');
    };

    return (
        <nav>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/productos">Productos</a></li>

                {/* Solo mostrar el botón "Quiero vender" si el rol es "comprador" */}
                {role === 'comprador' && (
                    <li>
                        <button onClick={handleBecomeSeller}>Quiero vender</button>
                    </li>
                )}

                {/* Resto de los enlaces del navbar */}
                <li><a href="/profile">Mi perfil</a></li>
                <li><button>Logout</button></li>
            </ul>
        </nav>
    );
}

export default NavBar;

