import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/category';
import NavBar from '../../Components/NavBar';
import { Plus, Edit2, Trash2, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

function Products() {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // Nueva variable para el loading de actualización
    const [imagesToDelete, setImagesToDelete] = useState([]);

    // Nuevo estado para búsqueda y paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const data = await getProducts();
                const filteredProducts = user.role === 'admin'
                    ? data
                    : data.filter(product => {
                        return product.seller && String(product.seller._id || product.seller) === String(user._id);
                    });
                setProducts(filteredProducts);
            } catch (error) {
                console.error('Error al obtener productos:', error);
                setMessage('Error al obtener productos');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
        fetchCategories();
    }, [user._id, user.role]);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            setMessage('Error al obtener categorías');
        }
    };

    const handleEditProduct = async () => {
        if (!editProduct) return; // Asegúrate de que editProduct no sea null

        setIsUpdating(true);
        setEditProduct(null); // Cerrar el modal después de actualizar

        try {
            const formData = new FormData();
            formData.append('name', editProduct.name);
            formData.append('description', editProduct.description);
            formData.append('price', editProduct.price);
            formData.append('stock', editProduct.stock);
            formData.append('category', editProduct.category?._id || ''); // Asegúrate de que esto esté presente

            // Agregar imágenes
            if (editProduct.images) {
                editProduct.images.forEach((image) => {
                    if (typeof image !== 'string') {
                        formData.append('images', image);
                    }
                });
            }

            // Imágenes a eliminar
            if (imagesToDelete.length > 0) {
                formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
            }

            const updatedResponse = await updateProduct(editProduct._id, formData);
            const updatedProduct = updatedResponse.product;

            console.log("Producto actualizado:", updatedProduct);
            console.log("Categorías disponibles:", categories);


            // Actualiza las categorías
            await fetchCategories();
            console.log("Categorías disponibles:", categories); // Verifica que las categorías se hayan actualizado


            // Actualiza el estado de products
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p._id === updatedProduct._id
                        ? {
                            ...updatedProduct,
                            // Asegúrate de usar el ID de la categoría para buscar la categoría correcta
                            category: categories.find(c => c._id === updatedProduct.category._id) || { name: 'Categoría no disponible' }
                        }
                        : p
                )
            );


            setMessage('Producto actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            setMessage('Error al actualizar el producto');
        } finally {
            setIsUpdating(false);
        }
    };



    // Modifica handleDeleteProduct para usar el diálogo de confirmación
    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p._id !== id));
            setMessage('Producto eliminado correctamente');
            setDeleteConfirmation(null);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            setMessage('Error al eliminar el producto');
        }
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = Array.from(files);

        // Si el número total de imágenes es mayor a 5, mostrar una alerta
        const totalImages = (editProduct.images || []).length + imagesArray.length;
        if (totalImages > 5) {
            alert('Solo puedes subir un máximo de 5 imágenes.');
            return;
        }

        // Agregar las nuevas imágenes sin reemplazar las existentes
        setEditProduct({
            ...editProduct,
            images: [...(editProduct.images || []), ...imagesArray]
        });
    };


    const handleImageDelete = (imageToRemove) => {
        setImagesToDelete([...imagesToDelete, imageToRemove]);
        const updatedImages = editProduct.images.filter(image => image !== imageToRemove);
        setEditProduct({ ...editProduct, images: updatedImages });
        setMessage('Imagen eliminada correctamente');
    };


    const getStatus = (stock) => {
        if (stock === 0) return 'SIN STOCK';
        if (stock <= 3) return 'SURTIR';
        return 'DISPONIBLE';
    };

    // Función de búsqueda y filtrado
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cálculos para paginación
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Función para cambiar de página
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    const sortedProducts = useMemo(() => {
        let sortableProducts = [...currentProducts]; // Clonar currentProducts

        if (sortConfig !== null) {
            sortableProducts.sort((a, b) => {
                if (sortConfig.key === 'price' || sortConfig.key === 'stock') {
                    // Para precio y stock, convertimos a número
                    return sortConfig.direction === 'ascending'
                        ? a[sortConfig.key] - b[sortConfig.key]
                        : b[sortConfig.key] - a[sortConfig.key];
                } else {
                    // Para nombre, comparamos como cadenas
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }

        return sortableProducts;
    }, [currentProducts, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };


    if (!user || (user.role !== 'admin' && user.role !== 'vendedor')) {
        return <div>No tienes permiso para ver esta página.</div>;
    }

    return (
        <>
            <NavBar />
            <div className="flex flex-col h-screen">
                <div className="flex-grow container mx-auto mt-20">
                    {/* Header Section */}
                    <div className="mb-4">
                        <h1 className="text-3xl font-light text-black-500 mb-2 text-center">Inventario General</h1>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-20 w-100">
                            {/* Buscar productos */}
                            <div className="flex items-center gap-20 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-emerald-800 text-emerald-50 focus:outline-none focus:border-emerald-600"
                                    />
                                    <Search className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                                </div>
                                <div className="text-black-500 whitespace-nowrap">
                                    Total: {filteredProducts.length}
                                </div>
                                <button
                                    onClick={() => navigate('/create-product')}
                                    className="flex items-center gap-10 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
                                >
                                    <Plus size={20} />
                                    Agregar Producto
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading States */}
                    {(isLoading || isUpdating) && (
                        <div className="flex justify-center items-center h-64">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce delay-75" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce delay-150" />
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-grow w-100">
                        {isLoading || isUpdating ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-bounce flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 delay-75"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 delay-150"></div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Card className=" border-emerald-800">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-emerald-800 bg-gray-950">
                                                        <th className="px-6 py-4 text-left text-sm text-emerald-300">Imagen</th>
                                                        <th
                                                            className="px-6 py-4 text-center text-sm text-emerald-300 cursor-pointer"
                                                            onClick={() => requestSort('name')}
                                                        >
                                                            Nombre
                                                            {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ' ↓'}
                                                        </th>
                                                        <th
                                                            className="px-6 py-4 text-center text-sm text-emerald-300 cursor-pointer"
                                                            onClick={() => requestSort('description')} 
                                                        >
                                                            Descripción
                                                            {sortConfig.key === 'description' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ' ↓'}
                                                        </th>
                                                        <th
                                                            className="px-6 py-4 text-center text-sm text-emerald-300 cursor-pointer"
                                                            onClick={() => requestSort('price')}
                                                        >
                                                            Precio
                                                            {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ' ↓'}
                                                        </th>
                                                        <th
                                                            className="px-6 py-4 text-center text-sm text-emerald-300 cursor-pointer"
                                                            onClick={() => requestSort('stock')}
                                                        >
                                                            Stock
                                                            {sortConfig.key === 'stock' ? (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓') : ' ↓'}
                                                        </th>
                                                        <th className="px-6 py-4 text-center text-sm text-emerald-300">Estado</th>
                                                        <th className="px-6 py-4 text-center text-sm text-emerald-300">Categoría</th>
                                                        <th className="px-6 py-4 text-left text-sm text-emerald-300">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-emerald-800">
                                                    {sortedProducts.map(product => (
                                                        <tr key={product._id} className="hover:bg-gray-800/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                {product.images?.[0] ? (
                                                                    <img
                                                                        src={product.images[0]}
                                                                        alt={product.name}
                                                                        className="w-16 h-16 object-cover rounded-lg"
                                                                    />
                                                                ) : (
                                                                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">
                                                                        No imagen
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4 text-black-500">{product.name}</td>
                                                            <td className="px-6 py-4 text-black-500">{product.description}</td>
                                                            <td className="px-6 py-4 text-black-500">${product.price}</td>
                                                            <td className="px-6 py-4 text-black-500">{product.stock}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatus(product.stock) === 'DISPONIBLE' ? 'bg-emerald-900 text-emerald-200' :
                                                                    getStatus(product.stock) === 'SURTIR' ? 'bg-yellow-400 text-yellow-900' :
                                                                        'bg-red-900 text-red-200'}`}>
                                                                    {getStatus(product.stock)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-black-500">
                                                                {product.category ? product.category.name : 'Categoría no disponible'}
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => setEditProduct(product)}
                                                                        className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                                                                    >
                                                                        <Edit2 size={18} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setDeleteConfirmation(product)}
                                                                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Pagination */}
                                <div className="flex justify-center items-center gap-4 mt-6">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 text-emerald-400 hover:text-emerald-300 disabled:text-emerald-900 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`px-4 py-2 rounded-lg transition-colors ${currentPage === number
                                                ? 'bg-emerald-600 text-white'
                                                : 'text-emerald-400 hover:text-emerald-300'
                                                }`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 text-emerald-400 hover:text-emerald-300 disabled:text-emerald-900 transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>


                    {/* Delete Confirmation Dialog */}
                    <AlertDialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
                        <AlertDialogContent className="bg-gray-900 border-emerald-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-emerald-50">¿Confirmar eliminación?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                    ¿Estás seguro de que deseas eliminar el producto "{deleteConfirmation?.name}"?
                                    Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-none">
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={() => handleDeleteProduct(deleteConfirmation._id)}
                                >
                                    Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Edit Modal */}
                    {editProduct && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                            <Card className="w-full max-w-2xl bg-gray-900 border-emerald-800">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-emerald-50">Editar Producto</CardTitle>
                                        <button
                                            onClick={() => setEditProduct(null)}
                                            className="text-gray-400 hover:text-gray-300"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Image Preview */}
                                    <div className="grid grid-cols-5 gap-4">
                                        {editProduct.images?.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                                    alt={`Preview ${index}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => handleImageDelete(image)}
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-lg"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}
                                        {Array.from({ length: 5 - (editProduct.images?.length || 0) }).map((_, index) => (
                                            <div key={`empty-${index}`} className="w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">
                                                Vacío
                                            </div>
                                        ))}
                                    </div>

                                    {/* Form Fields */}
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageChange}
                                        className="block w-full text-emerald-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:cursor-pointer"
                                    />

                                    <div className="grid gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            value={editProduct.name}
                                            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-emerald-800 text-emerald-50 focus:outline-none focus:border-emerald-600"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Precio"
                                            value={editProduct.price}
                                            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-emerald-800 text-emerald-50 focus:outline-none focus:border-emerald-600"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={editProduct.stock}
                                            onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-emerald-800 text-emerald-50 focus:outline-none focus:border-emerald-600"
                                        />
                                        <select
                                            value={editProduct.category?._id || ''}
                                            onChange={(e) => setEditProduct({ ...editProduct, category: categories.find(c => c._id === e.target.value) })}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-emerald-800 text-emerald-50 focus:outline-none focus:border-emerald-600"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categories.map(category => (
                                                <option key={category._id} value={category._id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-4 mt-6">
                                        <button
                                            onClick={() => setEditProduct(null)}
                                            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleEditProduct}
                                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Products;