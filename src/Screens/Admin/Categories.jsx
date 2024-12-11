import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Navbar from '../../Components/NavBar';
import { getCategories, deleteCategory, updateCategory } from '../../api/category';
import { Edit, Trash } from 'lucide-react';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar el modal de edición
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error al obtener categorías:', error);
                setMessage('Error al obtener categorías');
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = categories.filter((category) =>
        category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async () => {
    try {
        // Primero, llamamos a la función para eliminar la categoría en la API
        await deleteCategory(selectedCategory._id); // Cambiar a _id si es necesario
        // Luego de eliminarla, actualizamos la lista de categorías
        setCategories(categories.filter(category => category._id !== selectedCategory._id)); 
        setShowDeleteModal(false);  // Cerrar el modal de eliminación
        setMessage('Categoría eliminada exitosamente');  // Mostrar mensaje de éxito
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        setMessage('Error al eliminar la categoría');
    }
};

    
    const handleEdit = async () => {
        if (selectedCategory && selectedCategory._id) {
            try {
                // Enviar los datos del formulario para actualizar la categoría
                const updatedCategory = await updateCategory(selectedCategory._id, formData);
                if (updatedCategory) {
                    // Actualiza el listado de categorías en el estado
                    const updatedCategories = categories.map(category =>
                        category._id === selectedCategory._id
                            ? { ...category, name: formData.name, description: formData.description }
                            : category
                    );
                    setCategories(updatedCategories);
                    setShowEditModal(false);
                    setMessage('Categoría actualizada exitosamente');
                }
            } catch (error) {
                console.error('Error al actualizar la categoría:', error);
                setMessage('Error al actualizar la categoría');
            }
        } else {
            alert('No se ha seleccionado una categoría para editar.');
        }
    };
    
    const handleEditClick = async (category) => {
        setSelectedCategory(category);
        setFormData({ name: category.name, description: category.description });
        setShowEditModal(true); // Mostrar el modal de edición
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col h-1 mb-10">
                <div className="flex-grow container mx-auto mt-10">
                    <div className="mb-4">
                        <h1 className="text-3xl font-light text-black-500 mb-2 text-center">Lista de Categorías</h1>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full mt-3">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <input
                                        type="text"
                                        placeholder="Buscar categorías..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-emerald-800 text-emerald-50 focus:outline-none focus:border-emerald-600"
                                    />
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => (window.location.href = '/create-category')}
                                >
                                    Agregar Categoría
                                </Button>
                            </div>
                        </div>
                    </div>

                    {filteredCategories.length === 0 ? (
                        <p>No se encontraron categorías.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-emerald-800">
                                <thead>
                                    <tr className="bg-gray-950 text-emerald-300">
                                        <th className="px-6 py-4 text-left">ID</th>
                                        <th className="px-6 py-4 text-left">Nombre</th>
                                        <th className="px-6 py-4 text-left">Descripción</th>
                                        <th className="px-6 py-4 text-left">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-800">
                                    {filteredCategories.map((category, index) => (
                                        <tr key={category._id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{category.name}</td>
                                            <td className="px-6 py-4">{category.description}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(category)}
                                                        className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCategory(category);
                                                            setShowDeleteModal(true);
                                                        }}
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

                    {/* Modal de Eliminación */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Eliminar Categoría</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>¿Estás seguro de que deseas eliminar esta categoría?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Eliminar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal de Edición */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Categoría</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formCategoryName">
                                    <Form.Label>Nombre de la Categoría</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formCategoryDescription" className="mt-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleEdit}>
                                Guardar Cambios
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </>
    );
}

export default Categories;
