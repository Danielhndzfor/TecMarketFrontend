import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Redirige a la página de login después de hacer logout
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
}

export default Logout;

