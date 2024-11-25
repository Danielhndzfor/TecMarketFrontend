import React, { useEffect, useState } from 'react';
import { getUser } from '../api/auth'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';
import { API_URL } from '../config'; // Asegúrate de usar la ruta correcta
import { Container, Row, Col, Card, Button, Form, ListGroup } from 'react-bootstrap';
import NavBar from '../Components/NavBar';
import '../Css/Profile.css';

function Profile() {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmingRevert, setConfirmingRevert] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser(); // Obtener datos del usuario
                setUserData(userData); // Guardar los datos en el estado
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                setMessage('Error al cargar los datos del usuario.');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${API_URL}/api/auth/update-user/${userData._id}`, userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage(response.data.message);
            setIsEditing(false); // Salir del modo de edición
        } catch (error) {
            console.error('Error al actualizar el perfil:', error.response?.data?.message || error.message);
            setMessage('Error al actualizar el perfil.');
        }
    };

    const handleRevertToBuyer = async () => {
        if (confirmingRevert) {
            try {
                const response = await axios.post(`${API_URL}/api/auth/soy-comprador/${userData._id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserData({ ...userData, role: 'comprador' }); // Actualizar el rol en el estado
                setMessage('Has vuelto a ser comprador. Todos los datos de vendedor han sido eliminados.');
            } catch (error) {
                console.error('Error al revertir el rol:', error.response?.data?.message || error.message);
                setMessage('Error al revertir el rol.');
            }
        } else {
            setConfirmingRevert(true);
        }
    };

    return (
        <>
            <NavBar />
            <Container className="py-5 profile-container">
                <Row>
                    <Col md={4}>
                        <Card>
                            <Card.Body className="text-center">
                                <Card.Title className="mb-3">{userData.name} <span></span> {userData.firstName}</Card.Title>
                                <Button variant="primary" onClick={() => setIsEditing(true)} className="w-100">
                                    Editar Perfil
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={8} className='edit-profile'>
                        <Card >
                            <Card.Body>
                                <Card.Title>Información del Usuario</Card.Title>
                                {isEditing ? (
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.name || ''}
                                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                placeholder="Nombre"
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Primer Apellido</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.firstName || ''}
                                                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                                                placeholder="Primer Apellido"
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Segundo Apellido</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.lastName || ''}
                                                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                                                placeholder="Segundo Apellido (opcional)"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fecha de Nacimiento</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={userData.dateOfBirth?.slice(0, 10) || ''}
                                                onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Número de Teléfono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.phoneNumber || ''}
                                                onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                                                placeholder="Número de Teléfono"
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Correo Electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={userData.email || ''}
                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                placeholder="Correo Electrónico"
                                                required
                                            />
                                        </Form.Group>

                                        {/* Campos adicionales solo para vendedores */}
                                        {userData.role === 'vendedor' && (
                                            <>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nombre del Negocio</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={userData.businessName || ''}
                                                        onChange={(e) => setUserData({ ...userData, businessName: e.target.value })}
                                                        placeholder="Nombre del Negocio"
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Descripción</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        value={userData.description || ''}
                                                        onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                                                        placeholder="Descripción"
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>CLABE</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={userData.clabe || ''}
                                                        onChange={(e) => setUserData({ ...userData, clabe: e.target.value })}
                                                        placeholder="CLABE (18 dígitos)"
                                                        maxLength={18}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Categoría</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={userData.category || ''}
                                                        onChange={(e) => setUserData({ ...userData, category: e.target.value })}
                                                    >
                                                        <option value="">Selecciona una categoría</option>
                                                        <option value="categoria1">Categoría 1</option>
                                                        <option value="categoria2">Categoría 2</option>
                                                        {/* Agrega más categorías según sea necesario */}
                                                    </Form.Control>
                                                </Form.Group>
                                            </>
                                        )}

                                        <Button variant="success" onClick={handleUpdate}>Guardar Cambios</Button>
                                        <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                    </Form>
                                ) : (
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <strong>Nombre:</strong> {userData.name}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Primer Apellido:</strong> {userData.firstName}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Segundo Apellido:</strong> {userData.lastName}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Fecha de Nacimiento:</strong> {userData.dateOfBirth?.slice(0, 10)}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Número de Teléfono:</strong> {userData.phoneNumber}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Correo Electrónico:</strong> {userData.email}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Rol:</strong> {userData.role}
                                        </ListGroup.Item>
                                        {/* Mostrar información específica de vendedor si corresponde */}
                                        {userData.role === 'vendedor' && (
                                            <>
                                                <ListGroup.Item>
                                                    <strong>Nombre del Negocio:</strong> {userData.businessName}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>Descripción:</strong> {userData.description}
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <strong>CLABE:</strong> {userData.clabe}
                                                </ListGroup.Item>
                                            </>
                                        )}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {userData.role === 'vendedor' && (
                    <Row>
                        <Col>
                            <Card className="mt-3">
                                <Card.Body>
                                    <Card.Title>Eliminar Rol de Vendedor</Card.Title>
                                    <Card.Text>
                                        Al hacer esto, se eliminarán tus datos de venta, inventario y acceso como vendedor.
                                    </Card.Text>
                                    <Button variant="danger" onClick={handleRevertToBuyer}>
                                        {confirmingRevert ? 'Confirmar' : 'Ya no quiero vender'}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </Container>
        </>
    );
}

export default Profile;

