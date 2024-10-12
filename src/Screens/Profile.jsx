import React, { useEffect, useState } from 'react';
import { getUser } from '../api/auth'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';
import { API_URL } from '../config'; // Asegúrate de usar la ruta correcta

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
        <div>
            <h1>Mi Perfil</h1>
            {message && <p>{message}</p>}
            <div>
                <h2>Información del Usuario</h2>
                {isEditing ? (
                    <div>
                        <input
                            type="text"
                            value={userData.name || ''}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            placeholder="Nombre"
                            required
                        />
                        <input
                            type="text"
                            value={userData.firstName || ''}
                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                            placeholder="Primer Apellido"
                            required
                        />
                        <input
                            type="text"
                            value={userData.lastName || ''}
                            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                            placeholder="Segundo Apellido (opcional)"
                        />
                        <input
                            type="date"
                            value={userData.dateOfBirth?.slice(0, 10) || ''}
                            onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
                            placeholder="Fecha de Nacimiento"
                            required
                        />
                        <input
                            type="text"
                            value={userData.phoneNumber || ''}
                            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                            placeholder="Número de Teléfono"
                            required
                        />
                        <input
                            type="email"
                            value={userData.email || ''}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            placeholder="Correo Electrónico"
                            required
                        />
                        {/* Campos adicionales solo para vendedores */}
                        {userData.role === 'vendedor' && (
                            <>
                                <input
                                    type="text"
                                    value={userData.businessName || ''}
                                    onChange={(e) => setUserData({ ...userData, businessName: e.target.value })}
                                    placeholder="Nombre del Negocio"
                                    required
                                />
                                <textarea
                                    value={userData.description || ''}
                                    onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                                    placeholder="Descripción"
                                />
                                <input
                                    type="text"
                                    value={userData.clabe || ''}
                                    onChange={(e) => setUserData({ ...userData, clabe: e.target.value })}
                                    placeholder="CLABE (18 dígitos)"
                                    maxLength={18}
                                />
                                <select
                                    value={userData.category || ''}
                                    onChange={(e) => setUserData({ ...userData, category: e.target.value })}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    <option value="categoria1">Categoría 1</option>
                                    <option value="categoria2">Categoría 2</option>
                                    {/* Agrega más categorías según sea necesario */}
                                </select>
                            </>
                        )}

                        <button onClick={handleUpdate}>Guardar Cambios</button>
                        <button onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                ) : (
                    <div>
                        <p>Nombre: {userData.name}</p>
                        <p>Primer Apellido: {userData.firstName}</p>
                        <p>Segundo Apellido: {userData.lastName}</p>
                        <p>Fecha de Nacimiento: {userData.dateOfBirth?.slice(0, 10)}</p>
                        <p>Número de Teléfono: {userData.phoneNumber}</p>
                        <p>Correo: {userData.email}</p>
                        <p>Rol: {userData.role}</p>
                        {/* Mostrar información específica de vendedor si corresponde */}
                        {userData.role === 'vendedor' && (
                            <>
                                <p>Nombre del Negocio: {userData.businessName}</p>
                                <p>Descripción: {userData.description}</p>
                                <p>CLABE: {userData.clabe}</p>
                            </>
                        )}
                        <button onClick={() => setIsEditing(true)}>Editar Datos</button>
                    </div>
                )}
            </div>
            {userData.role === 'vendedor' && (
                <div>
                    <h3>Eliminar Rol de Vendedor</h3>
                    <p>Al hacer esto, se eliminarán tus datos de venta, inventario y acceso como vendedor.</p>
                    <button onClick={handleRevertToBuyer}>
                        {confirmingRevert ? 'Confirmar' : 'Ya no quiero vender'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Profile;
