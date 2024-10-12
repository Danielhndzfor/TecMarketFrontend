import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom'; // Para redirigir después de enviar el formulario

function SellerForm() {
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [clabe, setClabe] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que la CLABE tenga 18 dígitos si está presente
        if (clabe && clabe.length !== 18) {
            setMessage('La CLABE debe tener exactamente 18 dígitos.');
            return;
        }

        try {
            // Llamada a la API con el método POST para cambiar a vendedor
            const response = await axios.post(`${API_URL}/api/auth/soy-vendedor`, {
                businessName,
                description,
                category,
                clabe,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setMessage('Tu cuenta ha sido actualizada a vendedor.');
            // Redirigir después de una actualización exitosa
            navigate('/profile');
        } catch (error) {
            console.error('Error al actualizar el rol a vendedor:', error.response?.data?.message || error.message);
            setMessage('Hubo un problema al enviar el formulario.');
        }
    };

    return (
        <div>
            <h1>Convertirse en Vendedor</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre del Negocio:</label>
                    <input 
                        type="text" 
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Descripción del Negocio:</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Categoría:</label>
                    <input 
                        type="text" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>CLABE Interbancaria (opcional):</label>
                    <input 
                        type="text" 
                        value={clabe}
                        onChange={(e) => setClabe(e.target.value)}
                        placeholder="18 dígitos"
                    />
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default SellerForm;
