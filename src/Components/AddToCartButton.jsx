import React, { useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const AddToCartButton = ({ productId, quantity }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = async () => {
        try {
            const response = await axios.post('/api/cart/add', {
                userId,  // Esto debe venir del contexto de usuario autenticado
                productId,
                quantity,
            });
            addToCart(response.data);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <button onClick={handleAddToCart}>
            Agregar al carrito
        </button>
    );
};

export default AddToCartButton;
