import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser  } from '../../api/auth'; // Asegúrate de importar updateUser 
import { Plus, Edit, Trash } from 'lucide-react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import NavBar from '../../Components/NavBar';
import '../../Css/Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredBuyers, setFilteredBuyers] = useState([]);
    const [filteredSellers, setFilteredSellers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [selectedUser , setSelectedUser ] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [convertToSeller, setConvertToSeller] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllUsers();
                if (Array.isArray(data)) {
                    setUsers(data);
                    setFilteredBuyers(data.filter(user => user.role === 'comprador'));
                    setFilteredSellers(data.filter(user => user.role === 'vendedor'));
                } else {
                    throw new Error('Los datos no son un arreglo');
                }
            } catch (err) {
                setError(err.message);
            }
        }
        fetchData();
    }, []);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filterUsers = (user) =>
            `${user.name} ${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.phoneNumber.includes(term) ||
            (user.businessName && user.businessName.toLowerCase().includes(term));

        setFilteredBuyers(users.filter(user => user.role === 'comprador' && filterUsers(user)));
        setFilteredSellers(users.filter(user => user.role === 'vendedor' && filterUsers(user)));
    };

    const handleDelete = (userId) => {
        console.log(`Eliminar usuario con ID: ${userId}`);
        setFilteredBuyers(prev => prev.filter(user => user.userId !== userId));
        setFilteredSellers(prev => prev.filter(user => user.userId !== userId));
        setShowDeleteModal(false);
    };

    const handleEdit = (user) => {
        setSelectedUser (user);
        setConvertToSeller(user.role === 'vendedor'); // Establece el estado basado en el rol actual
        setShowEditModal(true);
    };

    const handleSaveChanges = async () => {
        if (selectedUser ) {
            const updatedData = {
                name: selectedUser .name,
                firstName: selectedUser .firstName,
                lastName: selectedUser .lastName,
                email: selectedUser .email,
                phoneNumber: selectedUser .phoneNumber,
                role: convertToSeller ? 'vendedor' : 'comprador',
                businessName: convertToSeller ? selectedUser .businessName : undefined,
                description: convertToSeller ? selectedUser .description : undefined,
                clabe: convertToSeller ? selectedUser .clabe : undefined,
                category: convertToSeller ? selectedUser .category : undefined,
            };
    
            try {
                // Asegúrate de que el userId sea numérico
                const userId = Number(selectedUser .userId);
                if (isNaN(userId)) {
                    throw new Error('ID de usuario no válido');
                }
    
                await updateUser (userId, updatedData);
                setShowEditModal(false);
    
                // Actualiza la lista de usuarios después de la edición
                const updatedUsers = users.map(user =>
                    user.userId === userId ? { ...user, ...updatedData } : user
                );
                setUsers(updatedUsers);
                setFilteredBuyers(updatedUsers.filter(user => user.role === 'comprador'));
                setFilteredSellers(updatedUsers.filter(user => user.role === 'vendedor'));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <>
            <NavBar />
            <div className="flex flex-col h-1 mt-10">
                <div className="flex-grow container mx-auto mt-10">
                    {/* Header Section */}
                    <div className="mb-4">
                        <h1 className="text-3xl font-light text-black-500 mb-2 text-center">Lista de Usuarios</h1>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
                            {/* Buscar usuarios */}
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <input
                                        type="text"
                                        placeholder="Buscar usuarios..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-emerald-800 text-emerald-50 focus:outline-none focus:border-emerald-600"
                                    />
                                </div>
                                <div className="text-black-500 whitespace-nowrap">
                                    Total: {filteredBuyers.length + filteredSellers.length}
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    {/* Compradores */}
                    <h2 className="mt-5 text-xl font-semibold">Compradores</h2>
                    {filteredBuyers.length === 0 ? (
                        <p>No se encontraron compradores.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-emerald-800">
                                <thead>
                                    <tr className="bg-gray-950 text-emerald-300">
                                        <th className="px-6 py-4 text-left">Nombre</th>
                                        <th className="px-6 py-4 text-left">Email</th>
                                        <th className="px-6 py-4 text-left">Teléfono</th>
                                        <th className="px-6 py-4 text-left">Rol</th>
                                        <th className="px-6 py-4 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-800">
                                    {filteredBuyers.map((user) => (
                                        <tr key={user.userId} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">{`${user.name} ${user.firstName} ${user.lastName}`}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{user.phoneNumber}</td>
                                            <td className="px-6 py-4">{user.role}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedUser (user); setShowDeleteModal(true); }}
                                                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Vendedores */}
                    <h2 className="mt-5 text-xl font-semibold">Vendedores</h2>
                    {filteredSellers.length === 0 ? (
                        <p>No se encontraron vendedores.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-emerald-800">
                                <thead>
                                    <tr className="bg-gray-950 text-emerald-300">
                                        <th className="px-6 py-4 text-left">Nombre</th>
                                        <th className="px-6 py-4 text-left">Email</th>
                                        <th className="px-6 py-4 text-left">Teléfono</th>
                                        <th className="px-6 py-4 text-left">Rol</th>
                                        <th className="px-6 py-4 text-left">Nombre del Negocio</th>
                                        <th className="px-6 py-4 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-800">
                                    {filteredSellers.map((user) => (
                                        <tr key={user.userId} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">{`${user.name} ${user.firstName} ${user.lastName}`}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{user.phoneNumber}</td>
                                            <td className="px-6 py-4">{user.role}</td>
                                            <td className="px-6 py-4">{user.businessName}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedUser (user); setShowDeleteModal(true); }}
                                                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Modal de Edición */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Usuario</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        defaultValue={selectedUser ?.name} 
                                        onChange={(e) => setSelectedUser ({ ...selectedUser , name: e.target.value })} 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Paterno</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        defaultValue={selectedUser ?.firstName} 
                                        onChange={(e) => setSelectedUser ({ ...selectedUser , firstName: e.target.value })} 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Materno</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        defaultValue={selectedUser ?.lastName} 
                                        onChange={(e) => setSelectedUser ({ ...selectedUser , lastName: e.target.value })} 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        defaultValue={selectedUser ?.email} 
                                        onChange={(e) => setSelectedUser ({ ...selectedUser , email: e.target.value })} 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        defaultValue={selectedUser ?.phoneNumber} 
                                        onChange={(e) => setSelectedUser ({ ...selectedUser , phoneNumber: e.target.value })} 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Convertir a Vendedor"
                                        checked={convertToSeller}
                                        onChange={(e) => setConvertToSeller(e.target.checked)}
                                    />
                                </Form.Group>

                                {convertToSeller && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre del Negocio</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                defaultValue={selectedUser ?.businessName} 
                                                onChange={(e) => setSelectedUser ({ ...selectedUser , businessName: e.target.value })} 
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Descripción</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                defaultValue={selectedUser  ?.description} 
                                                onChange={(e) => setSelectedUser  ({ ...selectedUser  , description: e.target.value })} 
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Categoría</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                defaultValue={selectedUser  ?.category} 
                                                onChange={(e) => setSelectedUser  ({ ...selectedUser  , category: e.target.value })} 
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CLABE</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                defaultValue={selectedUser  ?.clabe} 
                                                onChange={(e) => setSelectedUser  ({ ...selectedUser  , clabe: e.target.value })} 
                                            />
                                        </Form.Group>
                                    </>
                                )}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleSaveChanges}>
                                Guardar Cambios
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal de Eliminación */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Eliminar Usuario</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>¿Estás seguro de que deseas eliminar a {selectedUser  ?.name}?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(selectedUser  ?.userId)}>
                                Eliminar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default Users;