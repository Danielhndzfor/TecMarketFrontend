import React, { useState, useContext, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { getUser } from '../api/auth';
import { API_URL } from '../config';
import { Modal, Button, Form } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import '../Css/ProductCard.css';

const ProductCard = ({ product }) => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [claim, setClaim] = useState('');
    const [notification, setNotification] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser();
                setUserId(user._id);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleClick = () => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (loading) return;
        if (!userId) {
            alert('Usuario no autenticado');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/api/cart/add`, {
                userId,
                productId: product._id,
                quantity: 1,
            });
            addToCart(response.data);
            setNotification(true);
            setTimeout(() => setNotification(false), 3000); // Ocultar después de 3 segundos
        } catch (error) {
            console.error('Error al añadir el producto al carrito:', error.response ? error.response.data : error.message);
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleClaimSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/claims`, {
                userId,
                productId: product._id,
                claim,
            });
            alert('Reclamación enviada con éxito.');
            setClaim('');
            handleCloseModal();
        } catch (error) {
            console.error('Error al enviar la reclamación:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="product-card" style={{ cursor: 'pointer' }}>
            <div className="image-container">
                <Carousel className="carousel">
                    {product.images && product.images.length > 0 ? (
                        product.images.map((image, index) => (
                            <Carousel.Item key={index} className="carousel-item">
                                <div className="image-container">
                                    <img
                                        src={image}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                </div>
                            </Carousel.Item>
                        ))
                    ) : (
                        <Carousel.Item className="carousel-item">
                            <div className="image-container">
                                <img
                                    src="https://via.placeholder.com/200"
                                    alt="Imagen no disponible"
                                    className="product-image"
                                />
                            </div>
                        </Carousel.Item>
                    )}
                </Carousel>

                {notification && (
                    <div className="notification">Producto Añadido</div>
                )}
            </div>
            <div className="product-details" onClick={handleClick}>
                <h5 className="product-name">{product.name}</h5>
                <div className="product-footer">
                    <p className="product-price">Precio: ${product.price}</p>
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
        </div>
    );
};

export default ProductCard;
