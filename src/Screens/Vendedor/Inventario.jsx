import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/category';

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
            try {
                const data = await getProducts();
                const filteredProducts = user.role === 'admin'
                    ? data
                    : data.filter(product => product.seller._id === user._id);
                setProducts(filteredProducts);
            } catch (error) {
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
            formData.append('category', editProduct.category);

            // Agregar imágenes nuevas al FormData
            if (editProduct.images) {
                editProduct.images.forEach((image) => {
                    if (typeof image !== 'string') { // Asegurarse de que solo se agreguen imágenes nuevas
                        formData.append('images', image);
                    }
                });
            }

            // Enviar imágenes a eliminar
            if (imagesToDelete.length > 0) {
                formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
            }

            const updatedProduct = await updateProduct(editProduct._id, formData);
            setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
            setMessage('Producto actualizado correctamente');
            setEditProduct(null);
            window.location.reload();
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
            setMessage('Error al eliminar el producto');
        }
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = Array.from(files);
        setEditProduct({ ...editProduct, images: imagesArray });
    };

    const handleImageDelete = (imageToRemove) => {
        // Añadir la imagen a la lista de imágenes a eliminar
        setImagesToDelete([...imagesToDelete, imageToRemove]);
        // Actualizar las imágenes en el estado
        const updatedImages = editProduct.images.filter(image => image !== imageToRemove);
        setEditProduct({ ...editProduct, images: updatedImages });
        setMessage('Imagen eliminada correctamente');
    };

    if (!user || (user.role !== 'admin' && user.role !== 'vendedor')) {
        return <div>No tienes permiso para ver esta página.</div>;
    }

    return (
        <div>
            <h1>Inventario</h1>
            {isLoading ? <p>Cargando productos...</p> : (
                <div>
                    {message && <p>{message}</p>}

                    {(user.role === 'admin' || user.role === 'vendedor') && (
                        <button onClick={() => navigate('/create-product')}>Agregar Producto</button>
                    )}

                    <h2>Productos en Inventario</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                                <th>Vendedor</th>
                                <th>Calificación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        {product.images && product.images.length > 0 ? (
                                            <img src={product.images[0]} alt={product.name} style={{ width: '100px', height: '100px' }} />
                                        ) : (
                                            <p>No Imagen</p>
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>${product.price}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.category.name}</td>
                                    <td>{product.seller.name}</td>
                                    <td>{product.rating}</td>
                                    <td>
                                        {(user.role === 'admin' || user.role === 'vendedor') && (
                                            <>
                                                <button onClick={() => setEditProduct(product)}>Editar</button>
                                                <button onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {editProduct && (
                        <div>
                            <h2>Editar Producto</h2>
                            <input type="file" multiple onChange={handleImageChange} />
                            {editProduct.images && editProduct.images.length > 0 && (
                                <div>
                                    {editProduct.images.map((image, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                                alt={`Imagen ${index}`}
                                                style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                            />
                                            <button onClick={() => handleImageDelete(image)}>Eliminar</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <input
                                type="text"
                                placeholder="Nombre"
                                value={editProduct.name}
                                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={editProduct.description}
                                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Precio"
                                value={editProduct.price}
                                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={editProduct.stock}
                                onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                            />
                            <select
                                value={editProduct.category || ''}
                                onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <button onClick={handleEditProduct}>Actualizar</button>
                            <button onClick={() => setEditProduct(null)}>Cancelar</button>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default Inventario;
