import React, { useState, useContext, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import StarRating from './StarRating'; // Importamos el componente de calificación
import '../Css/ProductCard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';  // Asegúrate de tener el CartContext disponible
import { getUser } from '../api/auth'; // Importa la función para obtener el usuario

const ProductCard = ({ product }) => {
    const [rating, setRating] = useState(5); // Estado para manejar la calificación
    const [userId, setUserId] = useState(null); // Estado para manejar el userId
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const { addToCart } = useContext(CartContext);  // Accedemos al contexto del carrito
    const navigate = useNavigate();

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

    // Manejar la acción de hacer clic en el producto
    const handleClick = () => {
        navigate(`/product/${product._id}`);
    };

    // Manejar la acción de agregar al carrito
    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Para evitar que el click en el botón redirija a la página del producto
        if (loading) return; // Espera a que el usuario esté cargado
        if (!userId) {
            alert('User not authenticated');
            return;
        }
        try {
            const response = await axios.post('https://tecmarketback-372c5b6708b1.herokuapp.com/api/cart/add', {
                userId,
                productId: product._id,
                quantity: 1,  // Puedes dejar que el usuario elija la cantidad más adelante
            });
            addToCart(response.data);  // Actualiza el estado del carrito global
            console.log('Producto añadido al carrito');
        } catch (error) {
            console.error('Error al añadir el producto al carrito:', error.response ? error.response.data : error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="product-card" onClick={handleClick}>
            {/* Icono de advertencia en la esquina superior derecha */}
            <div className="warning-icon">
                <FaExclamationTriangle color="red" size={20} />
            </div>

            {/* Imagen del producto */}
            <div className="image-container">
                {product.images[0] && (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-image"
                    />
                )}
            </div>

            {/* Información del producto */}
            <div className="product-info">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-price">Precio: ${product.price}</p>

                {/* Componente de calificación modificable */}
                <div className="product-rating">
                    <StarRating rating={rating} setRating={setRating} />
                    <span>({rating}/5)</span>
                </div>

                {/* Botón de agregar al carrito */}
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
};

export default ProductCard;

