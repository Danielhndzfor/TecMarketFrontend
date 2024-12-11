import React, { useEffect, useState } from 'react';
import { getUser, updateUser } from '../api/auth';
import NavBar from '../Components/NavBar';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaStore, FaIdCard, FaCreditCard, FaList, FaEdit } from 'react-icons/fa';
import axios from 'axios';

function Profile() {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmingRevert, setConfirmingRevert] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUser();
                setUserData(userData);
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                setMessage('Error al cargar los datos del usuario.');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        try {
            const userId = userData.userId;
            const response = await axios.put(`https://tec-market-backend.vercel.app/api/auth/update-user/${userId}`, userData);
            setMessage(response.data.message);
            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar el perfil:', error.response?.data?.message || error.message);
            setMessage('Error al actualizar el perfil.');
        }
    };

    const handleRevertToBuyer = async () => {
        if (confirmingRevert) {
            try {
                // Aquí actualizamos el rol del usuario a 'comprador', pasando el _id correctamente
                const response = await updateUser(userData._id, { role: 'comprador' });
                // Actualizamos los datos del estado con el nuevo rol
                setUserData({ ...userData, role: 'comprador' });
                setMessage('Has vuelto a ser comprador. Todos los datos de vendedor han sido eliminados.');
                setTimeout(() => {
                    window.location.reload();
                }, 3000);

                setConfirmingRevert(false); // Restablecemos la confirmación después de la actualización
            } catch (error) {
                console.error('Error al revertir el rol:', error.response?.data?.message || error.message);
                setMessage('Error al revertir el rol.');
                setConfirmingRevert(false); // También restablecemos la confirmación en caso de error
            }
        } else {
            setConfirmingRevert(true); // Iniciamos la confirmación
        }
    };
    
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            <NavBar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-green-600 px-4 py-5 sm:px-6">
                        <h2 className="text-2xl font-bold text-white text-center">Mi Perfil</h2>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-center mb-8">
                            <div className="bg-green-500 text-white rounded-full p-3 w-24 h-24 flex items-center justify-center">
                                <FaUser className="w-12 h-12" />
                            </div>
                        </div>
                        {isEditing ? (
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={userData.name || ''}
                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Primer Apellido</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={userData.firstName || ''}
                                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Segundo Apellido</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={userData.lastName || ''}
                                            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            value={userData.dateOfBirth?.slice(0, 10) || ''}
                                            onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            value={userData.phoneNumber || ''}
                                            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={userData.email || ''}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                {userData.role === 'vendedor' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
                                            <input
                                                type="text"
                                                id="businessName"
                                                value={userData.businessName || ''}
                                                onChange={(e) => setUserData({ ...userData, businessName: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                                            <textarea
                                                id="description"
                                                value={userData.description || ''}
                                                onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                                                rows="3"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label htmlFor="clabe" className="block text-sm font-medium text-gray-700">CLABE</label>
                                            <input
                                                type="text"
                                                id="clabe"
                                                value={userData.clabe || ''}
                                                onChange={(e) => setUserData({ ...userData, clabe: e.target.value })}
                                                maxLength={18}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                                            <select
                                                id="category"
                                                value={userData.category || ''}
                                                onChange={(e) => setUserData({ ...userData, category: e.target.value })}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Selecciona una categoría</option>
                                                <option value="categoria1">Categoría 1</option>
                                                <option value="categoria2">Categoría 2</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleUpdate}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <FaUser className="mr-2 text-green-500" />
                                        Nombre
                                    </dt>
                                    <dd className="mt-1 text-lg text-gray-900">{userData.name} {userData.firstName} {userData.lastName}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <FaCalendar className="mr-2 text-green-500" />
                                        Fecha de Nacimiento
                                    </dt>
                                    <dd className="mt-1 text-lg text-gray-900">{userData.dateOfBirth?.slice(0, 10)}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <FaPhone className="mr-2 text-green-500" />
                                        Teléfono
                                    </dt>
                                    <dd className="mt-1 text-lg text-gray-900">{userData.phoneNumber}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <FaEnvelope className="mr-2 text-green-500" />
                                        Email
                                    </dt>
                                    <dd className="mt-1 text-lg text-gray-900">{userData.email}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <FaIdCard className="mr-2 text-green-500" />
                                        Rol
                                    </dt>
                                    <dd className="mt-1 text-lg text-gray-900">{userData.role}</dd>
                                </div>
                                {userData.role === 'vendedor' && (
                                    <>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaStore className="mr-2 text-green-500" />
                                                Nombre del Negocio
                                            </dt>
                                            <dd className="mt-1 text-lg text-gray-900">{userData.businessName}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaList className="mr-2 text-green-500" />
                                                Descripción
                                            </dt>
                                            <dd className="mt-1 text-lg text-gray-900">{userData.description}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaCreditCard className="mr-2 text-green-500" />
                                                CLABE
                                            </dt>
                                            <dd className="mt-1 text-lg text-gray-900">{userData.clabe}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaList className="mr-2 text-green-500" />
                                                Categoría
                                            </dt>
                                            <dd className="mt-1 text-lg text-gray-900">{userData.category}</dd>
                                        </div>
                                    </>
                                )}
                            </dl>
                        )}
                        <div className="mt-8 flex justify-center">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <FaEdit className="mr-2" />
                                    Editar Perfil
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {userData.role === 'vendedor' && (
                    <div className="mt-8 bg-white shadow-xl rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">¿Quieres volver a ser comprador?</h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Al volver a ser comprador, perderás todos tus datos de vendedor.</p>
                            </div>
                            <div className="mt-5">
                                <button
                                    onClick={handleRevertToBuyer}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    {confirmingRevert ? '¿Estás seguro?' : 'Volver a comprador'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {message && (
                    <div className="mt-8 bg-white shadow-xl rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:p-6">
                            <p className="text-center text-lg font-medium text-gray-900">{message}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;