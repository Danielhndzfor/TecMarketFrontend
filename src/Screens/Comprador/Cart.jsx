import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { getCart, addToCart, removeFromCart, clearCart } from '../../api/cart'; // Importamos clearCart
import { getUser } from '../../api/auth';
import { getProduct } from '../../api/products';
import { createOrder } from '../../api/order'; // Importamos createOrder

const Cart = () => {
    const { cart, setCart } = useContext(CartContext);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState({});
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderNumber, setOrderNumber] = useState(null);

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
                    setCart({ items: [] });
                } else {
                    setCart(data);
                    const productPromises = data.items.map(async (item) => {
                        const product = await getProduct(item.product);
                        return { ...item, product };
                    });
                    const productsDetails = await Promise.all(productPromises);
                    setProducts(productsDetails.reduce((acc, item) => {
                        acc[item.product._id] = item.product;
                        return acc;
                    }, {}));
                }
            } catch (error) {
                console.error('Error fetching cart:', error.message);
                setError('Failed to fetch cart. Please try again later.');
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

    const handleOrderConfirmation = async () => {
        const orderData = {
            userId,
            items: cart.items.map(item => {
                const product = products[item.product];
                const sellerId = product?.seller;

                if (!sellerId) {
                    console.error(`Invalid seller for product: ${item.product}`);
                    throw new Error(`Seller for product ${item.product} is required and must be valid.`);
                }

                return {
                    productId: item.product, // Cambia 'product' a 'productId'
                    quantity: item.quantity,
                    unit_price: product.price || 0,
                    title: product.name || 'Unknown Product',
                    sellerId: sellerId,
                };
            }),
            total: calculateTotal(),
            paymentMethod: paymentMethod.toLowerCase(),
        };

        try {
            const order = await createOrder(orderData);
            console.log('Order created successfully:', order);
            setOrderNumber(order._id); // Guardamos el número de orden

            // Vaciamos el carrito
            await clearCart(userId);
            setCart({ items: [] });

            // Pasamos al step 4
            setStep(4);
        } catch (error) {
            console.error('Error confirming order:', error.message);
            alert('Error confirming order: ' + error.message);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {step === 1 && (
                <>
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
                        <p>Your cart is empty.</p>
                    )}
                    <h2>Total: ${calculateTotal().toFixed(2)}</h2>
                    <button onClick={() => setStep(2)}>Siguiente</button>
                </>
            )}

            {step === 2 && (
                <>
                    <h2>Selecciona tu método de pago</h2>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Efectivo"
                            checked={paymentMethod === 'Efectivo'}
                            onChange={() => setPaymentMethod('Efectivo')}
                        />
                        Pago en Efectivo
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Transferencia"
                            checked={paymentMethod === 'Transferencia'}
                            onChange={() => setPaymentMethod('Transferencia')}
                        />
                        Pago con Transferencia
                    </label>
                    <button onClick={() => handleOrderConfirmation()}>Confirmar Pedido</button>
                    <button onClick={() => setStep(1)}>Volver</button>
                </>
            )}

            {step === 3 && paymentMethod === 'Transferencia' && (
                <>
                    <h2>Detalles para Transferencia</h2>
                    <p>Número de Orden: {orderNumber}</p>
                    {cart.items.map(item => {
                        const product = products[item.product];
                        const sellerId = product?.seller;

                        return (
                            <div key={item.product}>
                                <h3>{product?.name || 'Unknown Product'}</h3>
                                <p>Vendedor: {sellerId?.name || 'Desconocido'}</p>
                                <p>CLABE Interbancaria: {sellerId?.clabe || 'No disponible'}</p>
                                <p>Concepto de Pago: {`Pago por ${item.quantity} x ${product?.name}`}</p>
                                <p>Total a Transferir: ${(item.quantity * product.price).toFixed(2)}</p>
                            </div>
                        );
                    })}
                    <button onClick={() => setStep(4)}>Continuar</button>
                </>
            )}

            {step === 4 && (
                <>
                    <h2>Pedido Confirmado</h2>
                    <p>¡Gracias por tu compra! Tu pedido ha sido confirmado con éxito.</p>
                </>
            )}
        </div>
    );
};

export default Cart;
