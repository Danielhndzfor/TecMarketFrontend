import React, { useState, useEffect } from 'react';
import { createCategory } from '../../api/category';
import { getUser } from '../../api/auth';

function CreateCategory() {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const { name, description } = formData;

    const [message, setMessage] = useState('');  // Para mostrar mensajes de éxito o error
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No estás autorizado para acceder a esta página.');
                return;
            }

            try {
                const userData = await getUser(token);
                setIsAdmin(userData.role === 'admin');
            } catch (error) {
                setMessage('Error al obtener datos del usuario.');
                console.error('Error al obtener datos del usuario:', error);
            }
        }

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            setMessage('No tienes permiso para crear categorías.');
            return;
        }

        try {
            await createCategory(name, description);
            setMessage('Categoría creada exitosamente.');
            setFormData({ name: '', description: '' });  // Limpiar el formulario
        } catch (error) {
            setMessage('Error al crear la categoría.');
            console.error('Error al crear la categoría:', error);
        }
    };

    if (!isAdmin) {
        return <p>No tienes permiso para acceder a esta página.</p>;
    }

    return (
        <div>
            <h1>Crear Categoría</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre de la Categoría:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Crear Categoría</button>
            </form>
        </div>
    );
}

export default CreateCategory;