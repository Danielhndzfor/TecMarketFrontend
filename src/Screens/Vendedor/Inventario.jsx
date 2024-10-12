import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/category';
import '../../Css/Inventario.css';

function Inventario() {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [imagesToDelete, setImagesToDelete] = useState([]);

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
                        if (!product.seller) {
                            return false;
                        }
                        return String(product.seller._id || product.seller) === String(user._id);
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

        fetchProducts();
        fetchCategories();
    }, [user._id, user.role]);

    const handleEditProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editProduct.name);
            formData.append('price', editProduct.price);
            formData.append('stock', editProduct.stock);
            formData.append('description', editProduct.description);
            formData.append('category', editProduct.category); // Asegúrate de que el ID de categoría se esté enviando correctamente

            if (editProduct.images) {
                editProduct.images.forEach((image) => {
                    if (typeof image !== 'string') {
                        formData.append('images', image);
                    }
                });
            }

            if (imagesToDelete.length > 0) {
                formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
            }

            const updatedProduct = await updateProduct(editProduct._id, formData);
            setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
            setMessage('Producto actualizado correctamente');
            setEditProduct(null);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            setMessage('Error al actualizar el producto');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p._id !== id));
            setMessage('Producto eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            setMessage('Error al eliminar el producto');
        }
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = Array.from(files);
        setEditProduct({ ...editProduct, images: imagesArray });
    };

    const handleImageDelete = (imageToRemove) => {
        setImagesToDelete([...imagesToDelete, imageToRemove]);
        const updatedImages = editProduct.images.filter(image => image !== imageToRemove);
        setEditProduct({ ...editProduct, images: updatedImages });
        setMessage('Imagen eliminada correctamente');
    };

    const getStatus = (stock, initialStock) => {
        if (stock === 0) return 'SIN STOCK';
        if (stock < initialStock * 0.5) return 'SURTIR';
        return 'DISPONIBLE';
    };

    if (!user || (user.role !== 'admin' && user.role !== 'vendedor')) {
        return <div>No tienes permiso para ver esta página.</div>;
    }

    const totalProducts = products.length;

    return (
        <div className="inventory-container">
            <h1>Inventario</h1>
            {isLoading ? <p className="loading">Cargando productos...</p> : (
                <div className="inventory-content">
                    {message && <p className="message">{message}</p>}

                    {(user.role === 'admin' || user.role === 'vendedor') && (
                        <button className="add-product-btn" onClick={() => navigate('/create-product')}>Agregar Producto</button>
                    )}

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
                                    <th>Calificación</th>
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
                                        <td>{product.rating}</td>
                                        {user.role === 'admin' && (
                                            <>
                                                <td>{product.seller ? product.seller._id : 'N/A'}</td>
                                                <td>{product.seller ? product.seller.name : 'N/A'}</td>
                                                <td>{product.seller ? product.seller.firstName : 'N/A'}</td>
                                            </>
                                        )}
                                        <td>
                                            {(user.role === 'admin' || user.role === 'vendedor') && (
                                                <div className="action-buttons">
                                                    <button className="edit-btn" onClick={() => setEditProduct(product)}>Editar</button>
                                                    <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {editProduct && (
                        <div className="edit-product-modal">
                            <div className="modal-content">
                                <h2>Editar Producto</h2>
                                <input type="file" multiple onChange={handleImageChange} className="file-input" />
                                {editProduct.images && editProduct.images.length > 0 && (
                                    <div className="image-preview-container">
                                        {editProduct.images.map((image, index) => (
                                            <div key={index} className="image-preview">
                                                <img
                                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                                    alt={`Imagen ${index}`}
                                                    className="preview-image"
                                                />
                                                <button className="delete-image-btn" onClick={() => handleImageDelete(image)}>Eliminar</button>
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
                                <button className="update-btn" onClick={handleEditProduct}>Guardar Cambios</button>
                                <button className="cancel-btn" onClick={() => setEditProduct(null)}>Cancelar</button>
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
