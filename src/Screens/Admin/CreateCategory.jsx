import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar el hook de navegación
import { createCategory } from '../../api/category';
import { getUser } from '../../api/auth';
import NavBar from '@/Components/NavBar';
import '../../Css/createCategory.css';

function CreateCategory() {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const { name, description } = formData;

    const [message, setMessage] = useState('');  // Para mostrar mensajes de éxito o error
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); // Inicializar el hook useNavigate

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
            setTimeout(() => navigate('/categories'), 2000); // Redirigir después de 2 segundos
        } catch (error) {
            setMessage('Error al crear la categoría.');
            console.error('Error al crear la categoría:', error);
        }
    };

    if (!isAdmin) {
        return <p>No tienes permiso para acceder a esta página.</p>;
    }

    return (
        <>
            <NavBar />
            <div className="containerC">
                <h1 className="titleC">Crear Categoría</h1>
                {message && <p className="messageC">{message}</p>}
                <form onSubmit={handleSubmit} className="formC">
                    <div className="form-groupC">
                        <label htmlFor="name">Nombre de la Categoría:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleChange}
                            required
                            className="inputC"
                        />
                    </div>
                    <div className="form-groupC">
                        <label htmlFor="description">Descripción:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={handleChange}
                            className="textareaC"
                        />
                    </div>
                    <div className="form-actionsC">
                        <button type="submit" className="btn-submitC">Crear Categoría</button>
                        <button type="button" onClick={() => navigate('/categories')} className="btn-cancelC">Cancelar</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateCategory;
