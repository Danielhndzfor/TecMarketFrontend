import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getProduct, getProductsByCategory } from '../../api/products';
import { getUser } from '../../api/auth'; // Importa la función getUser del archivo auth.js
import { CartContext } from '../../context/CartContext'; // Importa el contexto del carrito
import { API_URL } from '../../config'; // Configuración de la API
import ProductCard from '../../Components/ProductCard'; // Componente de productos relacionados
import '../../Css/ProductDetail.css';
import NavBar from '../../Components/NavBar'; // Barra de navegación
import { ToastContainer, toast } from 'react-toastify'; // Importa ToastContainer y toast
import { Button } from 'react-bootstrap'; // Importa Button de react-bootstrap

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext); // Obtén la función de añadir al carrito del contexto
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProduct(id);
                setProduct(productData);

                const productsInSameCategory = await getProductsByCategory(productData.category._id);
                const filteredProducts = productsInSameCategory.filter(p => p._id !== productData._id);
                setRelatedProducts(filteredProducts);
            } catch (err) {
                setError(err);
            }
        };

        const fetchUser = async () => {
            try {
                const user = await getUser();
                setUserId(user._id);
            } catch (err) {
                console.error('Error fetching user:', err.message);
            }
            setLoading(false);
        };

        fetchProduct();
        fetchUser();
    }, [id]);

    const handleAddToCart = async () => {
        if (loading) return;
        if (!userId) {
            toast.error('Usuario no autenticado. Por favor, inicia sesión.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/cart/add`, {
                userId,
                productId: product._id,
                quantity: 1,
            });
            addToCart(response.data);
            toast.success('Producto añadido al carrito correctamente.');
        } catch (err) {
            toast.error(`Error al añadir el producto: ${err.response ? err.response.data.message : err.message}`);
        }
    };

    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>Loading...</p>;

    return (
        <>
            <NavBar />
            <ToastContainer /> {/* Contenedor para mostrar los toasts */}
            <div className="product-detail">
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>

                <div className="product-content">
                    <div className="product-images">
                        <div className="main-image">
                            <img src={product.images[0]} alt={product.name} />
                        </div>
                        <div className="thumbnail-images">
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.name} ${index + 1}`}
                                    onClick={() =>
                                        document.querySelector('.main-image img').src = image
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    <div className="product-info">
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                        <p className="price">Price: <span>${product.price}</span></p>
                        <Button
                            variant="success" // Cambiado a verde
                            onClick={handleAddToCart}
                            className="add-to-cart-button"
                            disabled={product.stock <= 0} // Deshabilitar si no hay stock
                        >
                            {product.stock <= 0 ? (
                                <>
                                    Sin Stock
                                </>
                            ) : (
                                'Agregar al carrito'
                            )}
                        </Button>
                    </div>
                </div>

                <div className="related-products">
                    <h2>Related Products</h2>
                    {relatedProducts.length > 0 ? (
                        <div className="related-products-list">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct._id}
                                    product={relatedProduct}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>No related products found.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetail;


