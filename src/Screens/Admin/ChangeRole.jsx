import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUser } from '../../api/auth'; // Asegúrate de que la ruta sea correcta
import { API_URL } from '../../config'; // Asegúrate de usar la ruta correcta


function ChangeRole() {
    const [role, setRole] = useState('comprador');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(); // Llama a la función getUser
                setUserId(userData._id);
                setRole(userData.role);
            } catch (error) {
                setMessage('Error al obtener datos del usuario');
                console.error('Error:', error);
            }
        };
        fetchUser();
    }, []);

    const handleRoleChange = async (newRole) => {
        try {
            const response = await axios.put(`${API_URL}/api/auth/update-role/${userId}`, { role: newRole }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            setRole(newRole);
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
            setMessage('Error al actualizar el rol');
        }
    };
    
    
    

    return (
        <div>
            <h1>Cambiar Rol de Usuario</h1>
            {message && <p>{message}</p>}
            <div>
                <button onClick={() => handleRoleChange('comprador')}>Cambiar a Comprador</button>
                <button onClick={() => handleRoleChange('vendedor')}>Cambiar a Vendedor</button>
                <button onClick={() => handleRoleChange('admin')}>Cambiar a Admin</button>
            </div>
            <p>Rol actual: {role}</p>
        </div>
    );
}

export default ChangeRole;
