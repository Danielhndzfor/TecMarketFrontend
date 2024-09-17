import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://tecmarketback-372c5b6708b1.herokuapp.com/api/auth';

function ChangeRole() {
    const [role, setRole] = useState('comprador');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserId(response.data._id);  // Acceder a data
                setRole(response.data.role);   // Acceder a data
            } catch (error) {
                setMessage('Error al obtener datos del usuario');
                console.error('Error:', error);
            }
        };
        fetchUser();
    }, [token]);

    const handleRoleChange = async (newRole) => {
        try {
            const response = await axios.put(`${API_URL}/update-role/${userId}`, { role: newRole }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setRole(newRole);
            setMessage('Rol actualizado correctamente');
            // Actualizar el token solo si es necesario, de lo contrario, puedes eliminar esta línea
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            setMessage('Error al actualizar el rol');
            console.error('Error:', error);
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
