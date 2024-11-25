import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import '../../Css/SellerForm.css';

function SellerForm() {
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [clabe, setClabe] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // Para determinar el tipo de mensaje (éxito o error)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que la CLABE tenga 18 dígitos si está presente
        if (clabe && clabe.length !== 18) {
            setMessageType('danger');
            setMessage('La CLABE debe tener exactamente 18 dígitos.');
            return;
        }

        try {
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

            setMessageType('success');
            setMessage('Tu cuenta ha sido actualizada a vendedor.');
            navigate('/profile'); // Redirigir después de la actualización exitosa
        } catch (error) {
            console.error('Error al actualizar el rol a vendedor:', error.response?.data?.message || error.message);
            setMessageType('danger');
            setMessage('Hubo un problema al enviar el formulario.');
        }
    };

    return (
        <>
            {/* Navbar */}
            <NavBar />

            {/* Formulario */}
            <Container>
                <Row className="justify-content-center seller-container">
                    <Col md={15}>
                        <h1 className="text-center mb-4">Convertirse en Vendedor</h1>

                        {message && (
                            <Alert variant={messageType} className="mt-3">
                                {message}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit} className="mt-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre del Negocio</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="Ingresa el nombre de tu negocio"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Descripción del Negocio</Form.Label>
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
                                <Form.Label>Categoría</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Categoría de tu negocio"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>CLABE Interbancaria (opcional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={clabe}
                                    onChange={(e) => setClabe(e.target.value)}
                                    placeholder="18 dígitos"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Enviar
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SellerForm;
