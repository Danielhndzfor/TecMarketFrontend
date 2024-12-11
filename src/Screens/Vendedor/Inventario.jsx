import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/category';
import '../../Css/Inventario.css';
import { toast } from 'react-toastify';

function Inventario() {
    const [products, setProducts] = useState([]);
    const [productToDelete, setProductToDelete] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // Nueva variable para el loading de actualización
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de productos por página



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

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            setMessage('Error al obtener categorías');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [user._id, user.role]);

    const handleEditProduct = async () => {
        setIsUpdating(true); // Activar loading al actualizar
        try {
            const formData = new FormData();
            formData.append('name', editProduct.name);
            formData.append('price', editProduct.price);
            formData.append('stock', editProduct.stock);
            formData.append('description', editProduct.description);
            formData.append('category', editProduct.category._id);

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

            const updatedProduct = await updateProduct(editProduct._id, formData);
            console.log('Producto actualizado:', updatedProduct);

            // Muestra el mensaje de éxito y cierra el modal de edición
            toast.success('Producto actualizado correctamente');
            setEditProduct(null); // Cierra el modal de edición

            // Vuelve a obtener la lista de productos para asegurarse de que la tabla esté actualizada
            fetchProducts();

        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            toast.error('Error al actualizar el producto');
        } finally {
            setIsUpdating(false); // Desactivar loading después de la actualización
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(productToDelete._id);
            setProducts(products.filter(p => p._id !== productToDelete._id));
            toast.success('Producto eliminado correctamente');
            setProductToDelete(null); // Cerrar modal
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            toast.error('Error al eliminar el producto');
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

    const totalProducts = products.length;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const totalPages = Math.ceil(products.length / itemsPerPage);



    return (
        <div className="inventory-container">
            {(isLoading || isUpdating) && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                        <div className="loading-dot"></div>
                    </div>
                </div>
            )}

            <h1>Inventario</h1>
            {!isLoading && !isUpdating && (
                <div className="inventory-content">
                    {message && <p className="message">{message}</p>}
                    <button className="add-product-btn" onClick={() => navigate('/create-product')}>Agregar Producto</button>
                    <h2>Productos en Inventario</h2>
                    <h2>Total de Productos: {totalProducts}</h2>
                    <div className="table-container">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estatus</th>
                                    <th>Categoría</th>
                                    {user.role === 'admin' && (
                                        <>
                                            <th>ID Vendedor</th>
                                            <th>Nombre Vendedor</th>
                                            <th>Apellido Vendedor</th>
                                        </>
                                    )}
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0]} alt={product.name} className="product-image1" />
                                            ) : (
                                                <p>No Imagen</p>
                                            )}
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>${product.price}</td>
                                        <td>{product.stock}</td>
                                        <td className={getStatus(product.stock, product.initialStock) === 'DISPONIBLE' ? 'status-disponible' :
                                            getStatus(product.stock, product.initialStock) === 'SURTIR' ? 'status-surtir' :
                                                'status-sin-stock'}>
                                            {getStatus(product.stock, product.initialStock)}
                                        </td>
                                        <td>{product.category.name}</td>
                                        {user.role === 'admin' && (
                                            <>
                                                <td>{product.seller ? product.seller._id : 'N/A'}</td>
                                                <td>{product.seller ? product.seller.name : 'N/A'}</td>
                                                <td>{product.seller ? product.seller.firstName : 'N/A'}</td>
                                            </>
                                        )}
                                        <td>
                                            {(user.role === 'admin' || user.role === 'vendedor') && (
                                                <div className="action-buttons1">
                                                    <button className="edit-btn" onClick={() => setEditProduct(product)}>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="delete-btn" onClick={() => setProductToDelete(product)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={currentPage === index + 1 ? 'active' : ''}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                    </div>

                    {editProduct && (
                        <div className="edit-product-modal">
                            <div className="modal-content1">
                                <h2>Editar Producto</h2>
                                {/* Botón personalizado para el input de archivos */}
                                <label htmlFor="file-input" className="custom-file-label">
                                    Elegir archivos
                                </label>
                                <input
                                    id="file-input"
                                    type="file"
                                    multiple
                                    onChange={handleImageChange}
                                    className="file-input-hidden"
                                />
                                {editProduct.images && (
                                    <div className="image-preview-container">
                                        {editProduct.images.map((image, index) => (
                                            <div key={index} className="image-preview">
                                                <img
                                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                                    alt={`Imagen ${index}`}
                                                    className="preview-image"
                                                />
                                                <button className="delete-image-btn" onClick={() => handleImageDelete(image)}><i className="fas fa-trash"></i></button>
                                            </div>
                                        ))}

                                        {/* Espacios vacíos si hay menos de 5 imágenes */}
                                        {Array.from({ length: 5 - editProduct.images.length }).map((_, index) => (
                                            <div key={index} className="image-preview empty-slot">
                                                <p>Espacio vacío</p>
                                            </div>
                                        ))}
                                    </div>
                                )}


                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={editProduct.name}
                                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                    className="edit-input"
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={editProduct.description}
                                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                                    className="edit-input"
                                />
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    value={editProduct.price}
                                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                                    className="edit-input"
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={editProduct.stock}
                                    onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                                    className="edit-input"
                                />
                                <select
                                    value={editProduct.category ? editProduct.category._id : ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, category: categories.find(c => c._id === e.target.value) })}
                                    className="edit-input"
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>{category.name}</option>
                                    ))}
                                </select>

                                <div className="modal-actions">
                                    <button className="update-btn" onClick={handleEditProduct} disabled={isUpdating}>{isUpdating ? 'Actualizando...' : 'Actualizar Producto'}</button>
                                    <button className="cancel-btn" onClick={() => setEditProduct(null)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal de Confirmación de Eliminación */}
                    {productToDelete && (
                        <div className="delete-modal">
                            <div className="delete-modal-content">
                                <h3>¿Estás seguro de que deseas eliminar este producto?</h3>
                                <p>Nombre: {productToDelete.name}</p>
                                <div className="delete-modal-actions">
                                    <button className="confirm-btn" onClick={handleDeleteProduct}>Eliminar</button>
                                    <button className="cancel-btn" onClick={() => setProductToDelete(null)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Inventario;