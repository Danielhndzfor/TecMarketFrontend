import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../../Css/SellerForm.css';

function SellerForm() {
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [clabe, setClabe] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (clabe && clabe.length !== 18) {
            setMessageType('danger');
            setMessage('La CLABE debe tener exactamente 18 dígitos.');
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/soy-vendedor`,
                { businessName, description, category, clabe },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            setMessageType('success');
            setMessage('Tu cuenta ha sido actualizada a vendedor.');
            navigate('/profile');
        } catch (error) {
            console.error('Error al actualizar el rol a vendedor:', error.response?.data?.message || error.message);
            setMessageType('danger');
            setMessage('Hubo un problema al enviar el formulario.');
        }
    };

    return (
        <>
            <NavBar />
            <div className="seller-form-container">
                <div className="seller-form-content">
                    <h1 className="text-center text-green mb-4">Convertirse en Vendedor</h1>

                    {message && (
                        <Alert variant={messageType} className="mt-3">
                            {message}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
                        <Form.Group className="mb-3">
                            <Form.Label className="text-green">Nombre del Negocio</Form.Label>
                            <Form.Control
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Ingresa el nombre de tu negocio"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-green">Descripción del Negocio</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe tu negocio"
                                rows={4}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-green">Categoría</Form.Label>
                            <Form.Control
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Categoría de tu negocio"
                                required
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-green">CLABE Interbancaria (opcional)</Form.Label>
                            <Form.Control
                                type="text"
                                value={clabe}
                                onChange={(e) => {
                                    // Limita la longitud a 18 caracteres y solo permite números
                                    const newClabe = e.target.value.replace(/\D/g, '').slice(0, 18);
                                    setClabe(newClabe);
                                }}
                                placeholder="18 dígitos"
                                maxLength={18}  // Opcional, asegura que el campo no acepte más de 18 caracteres
                            />
                        </Form.Group>


                        <Button variant="success" type="submit" className="w-100 btn-green">
                            Enviar
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default SellerForm;
