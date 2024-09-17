import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { getCart, addToCart, removeFromCart } from '../../api/cart';
import { getUser } from '../../api/auth';
import { getProduct } from '../../api/products';

const Cart = () => {
    const { cart, setCart } = useContext(CartContext);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState({}); // Para almacenar detalles del producto

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser();
                setUserId(user._id);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch user.');
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) return;

            try {
                const data = await getCart(userId);
                if (!data || !data.items) {
                    // Si el carrito no tiene items, lo consideramos vacío
                    setCart({ items: [] });
                } else {
                    setCart(data);

                    // Fetch detalles de productos si hay items
                    const productPromises = data.items.map(async (item) => {
                        const product = await getProduct(item.product);
                        return { ...item, product };
                    });
                    const productsDetails = await Promise.all(productPromises);
                    setProducts(
                        productsDetails.reduce((acc, item) => {
                            acc[item.product._id] = item.product;
                            return acc;
                        }, {})
                    );
                }
            } catch (error) {
                console.error('Error fetching cart:', error.message);
                setError('Failed to fetch cart. Please try again later.');
                // Si hay error (por ejemplo, carrito no existe), mostramos carrito vacío
                setCart({ items: [] });
            }
        };

        fetchCart();
    }, [userId, setCart]);

    const handleRemove = async (productId) => {
        try {
            await removeFromCart(userId, productId);
            setCart((prevCart) => ({
                ...prevCart,
                items: prevCart.items.filter(item => item.product !== productId),
            }));
        } catch (error) {
            console.error('Error removing item from cart:', error.message);
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        if (quantity <= 0) {
            handleRemove(productId);
            return;
        }

        try {
            await removeFromCart(userId, productId);
            await addToCart(userId, productId, quantity);

            setCart((prevCart) => {
                const updatedItems = prevCart.items.map(item =>
                    item.product === productId ? { ...item, quantity } : item
                );

                if (!updatedItems.some(item => item.product === productId)) {
                    updatedItems.push({ product: productId, quantity });
                }

                return {
                    ...prevCart,
                    items: updatedItems,
                };
            });
        } catch (error) {
            console.error('Error updating item quantity:', error.message);
        }
    };

    const calculateTotal = () => {
        if (!cart.items || cart.items.length === 0) return 0;
        return cart.items.reduce(
            (total, item) => total + (products[item.product]?.price || 0) * item.quantity,
            0
        );
    };

    useEffect(() => {
        calculateTotal();
    }, [cart.items, products]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Your Cart</h1>
            {cart.items && cart.items.length > 0 ? (
                <ul>
                    {cart.items.map(item => (
                        <li key={item.product}>
                            {products[item.product]?.name || 'Loading...'} - 
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.product, Number(e.target.value))}
                            />
                            x ${products[item.product]?.price || 0}
                            <button onClick={() => handleRemove(item.product)}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p> // Mostramos carrito vacío si no tiene productos
            )}
            <h2>Total: ${calculateTotal().toFixed(2)}</h2> {/* Mostrando el total con 2 decimales */}
        </div>
    );
};

export default Cart;
