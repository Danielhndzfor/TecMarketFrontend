import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { getCart, addToCart, removeFromCart, clearCart } from '../../api/cart';
import { getUser } from '../../api/auth';
import { getProduct } from '../../api/products';
import { createOrder } from '../../api/order';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
import '../../Css/Cart.css';

const Cart = () => {
    const { cart, setCart } = useContext(CartContext);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState({});
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderNumber, setOrderNumber] = useState(null);
    const [debounceTimer, setDebounceTimer] = useState(null);

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
                setCart(data || { items: [] });

                if (data && data.items) {
                    const productPromises = data.items.map(async (item) => {
                        const product = await getProduct(item.product);
                        // Asegúrate de que el vendedor esté incluido en el producto
                        return { ...item, product: { ...product, sellerId: item.seller } };
                    });

                    const productsDetails = await Promise.all(productPromises);
                    setProducts(productsDetails.reduce((acc, item) => {
                        acc[item.product._id] = item.product; // Asegúrate de que el id del producto sea correcto
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



    // Remove item from cart
    const handleRemove = async (productId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
            const cartId = cart.cartId; // Asegúrate de obtener el cartId del objeto del carrito
            console.log('Valor de cartId:', cartId); // Para verificar el valor
    
            // Verifica que cartId sea un número y no undefined o null
            if (typeof cartId !== 'number' || isNaN(cartId)) {
                console.error('El cartId no es un valor válido');
                return; // Maneja el error adecuadamente
            }
    
            try {
                // Llama a removeFromCart enviando userId, cartId y productId en el body
                await removeFromCart(userId, productId, cartId); 
                setCart((prevCart) => ({
                    ...prevCart,
                    items: prevCart.items.filter(item => item.product !== productId),
                }));
            } catch (error) {
                console.error('Error removing item from cart:', error.message);
            }
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const stock = products[productId]?.stock || 0; // Obtener stock del producto
        if (newQuantity < 1) {
            handleRemove(productId);
            return;
        }

        // Limitar la cantidad a la cantidad en stock
        if (newQuantity > stock) {
            alert(`La cantidad máxima disponible es ${stock}.`);
            newQuantity = stock; // Establecer la cantidad máxima
        }

        // Update quantity locally
        setCart((prevCart) => {
            const updatedItems = prevCart.items.map(item =>
                item.product === productId ? { ...item, quantity: newQuantity } : item
            );
            return {
                ...prevCart,
                items: updatedItems,
            };
        });

        // Clear any existing debounce timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set a new debounce timer to update the server after a delay
        const newTimer = setTimeout(async () => {
            try {
                await removeFromCart(userId, productId);
                await addToCart(userId, productId, newQuantity);
            } catch (error) {
                console.error('Error updating item quantity:', error.message);
            }
        }, 500); // Debounce time: waits 500ms after the last change before sending the request

        setDebounceTimer(newTimer);
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

    // Handle order confirmation
    const handleOrderConfirmation = async () => {
        const orderData = {
            userId,
            items: cart.items.map(item => {
                const product = products[item.product];
                const sellerId = product?.seller; // Asegúrate de que esto incluya todos los detalles del vendedor

                if (!sellerId) {
                    console.error(`Invalid seller for product: ${item.product}`);
                    throw new Error(`Seller for product ${item.product} is required and must be valid.`);
                }

                return {
                    productId: item.product,
                    quantity: item.quantity,
                    unit_price: product.price || 0,
                    title: product.name || 'Unknown Product',
                    sellerId,
                };
            }),
            total: calculateTotal(),
            paymentMethod: paymentMethod.toLowerCase(),
        };


        try {
            const order = await createOrder(orderData);
            setOrderNumber(order._id);

            // Limpiar carrito y avanzar al paso 3 si es transferencia
            await clearCart(userId);
            setCart({ items: [] });
            if (paymentMethod === 'Transferencia') {
                setStep(3);
            } else {
                setStep(4);
            }
        } catch (error) {
            console.error('Error confirming order:', error.message);
            alert('Error confirming order: ' + error.message);
        }
    };

    // Función para verificar el stock disponible antes de continuar
    const checkStockAvailability = async () => {
        try {
            const stockIssues = [];

            for (const item of cart.items) {
                const product = await getProduct(item.product); // Obtener los detalles del producto actualizados
                if (item.quantity > product.stock) {
                    stockIssues.push({
                        productId: item.product,
                        productName: product.name,
                        availableStock: product.stock,
                        requestedQuantity: item.quantity
                    });
                }
            }

            return stockIssues;
        } catch (error) {
            console.error('Error checking stock availability:', error);
            return [];
        }
    };

    const handleNextStep = async () => {
        if (step === 1) {
            const stockIssues = await checkStockAvailability();
            if (stockIssues.length > 0) {
                const issueMessages = stockIssues.map(issue =>
                    `El producto ${issue.productName} tiene solo ${issue.availableStock} unidades disponibles, pero solicitaste ${issue.requestedQuantity}.`
                ).join('\n');
                alert(`No se puede continuar debido a problemas de stock:\n${issueMessages}`);
            } else {
                setStep(2); // Si todo está bien, pasar al paso 2
            }
        } else if (step === 2 && paymentMethod === 'Transferencia') {
            setStep(3); // Ir al paso de detalles de transferencia
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        // Regresar a la vista anterior
        window.history.back();
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1 className="cart-title">
                    <ShoppingCart className="icon" /> Tu Carrito
                </h1>

                {loading ? (
                    <p className="loading">Cargando...</p>
                ) : error ? (
                    <p className="error">Error: {error}</p>
                ) : (
                    <>
                        {step === 1 && (
                            <>
                                {cart.items && cart.items.length > 0 ? (
                                    <ul className="cart-items">
                                        {cart.items.map(item => (
                                            <li key={item.product} className="cart-item">
                                                <img
                                                    src={products[item.product]?.images?.[0] || "/api/placeholder/80/80"}
                                                    alt={products[item.product]?.name}
                                                    className="item-image"
                                                    onError={(e) => { e.target.src = "/api/placeholder/80/80"; }}
                                                />

                                                <div className="item-details">
                                                    <h2 className="item-name">{products[item.product]?.name || 'Cargando...'}</h2>
                                                    <div className="quantity-controls">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                                                            className="quantity-btn"
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => handleQuantityChange(item.product, Number(e.target.value))}
                                                            className="quantity-input"
                                                        />
                                                        <button
                                                            onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                                                            className="quantity-btn"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="item-price">
                                                    <p className="price">${(products[item.product]?.price * item.quantity || 0).toFixed(2)}</p>
                                                    <button
                                                        onClick={() => handleRemove(item.product)}
                                                        className="remove-btn"
                                                    >
                                                        <Trash2 size={16} className="icon" /> Eliminar
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="empty-cart">Tu carrito está vacío.</p>
                                )}
                                <div className="cart-summary">
                                    <h2 className="total">Total: ${calculateTotal().toFixed(2)}</h2>
                                    <button
                                        onClick={handleNextStep}
                                        className="next-btn"
                                        disabled={cart.items.length === 0} // Deshabilitar si el carrito está vacío
                                    >
                                        Siguiente
                                    </button>
                                    <button onClick={handleBack} className='back-btn1'>
                                        Regresar
                                    </button>


                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div className="payment-selection">
                                <h2 className="section-title">Selecciona Tu Método de Pago</h2>
                                <div className="payment-options">
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Efectivo"
                                            checked={paymentMethod === 'Efectivo'}
                                            onChange={() => setPaymentMethod('Efectivo')}
                                        />
                                        <DollarSign className="icon" />
                                        <span>Pago en Efectivo</span>
                                    </label>
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Transferencia"
                                            checked={paymentMethod === 'Transferencia'}
                                            onChange={() => setPaymentMethod('Transferencia')}
                                        />
                                        <CreditCard className="icon" />
                                        <span>Pago por Transferencia</span>
                                    </label>
                                </div>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="back-btn"
                                    >
                                        <ArrowLeft size={16} className="icon" /> Atrás
                                    </button>
                                    <button
                                        onClick={handleOrderConfirmation}
                                        className="confirm-btn"
                                    >
                                        Confirmar Pedido
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="order-details">
                                <h2 className="order-title">Detalles de la Orden</h2>

                                <h3>Información del Vendedor</h3>
                                {cart.items.map(item => {
                                    const product = products[item.product];
                                    return (
                                        <div key={item.product} className="seller-info">
                                            {/* Verifica que el producto existe y tiene la información del vendedor */}
                                            {product && (
                                                <>
                                                    <h4>{product.sellerName} {product.sellerFirstName} {product.sellerLastName}</h4>
                                                    <p>Email: {product.sellerEmail}</p>
                                                    <p>CLABE: {product.sellerClabe}</p>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}

                                <h3>Resumen de la Orden</h3>
                                <ul className="order-summary">
                                    {cart.items.map(item => {
                                        const product = products[item.product];
                                        return (
                                            <li key={item.product} className="order-item">
                                                {product && (
                                                    <>
                                                        <span>{product.name} x {item.quantity}</span>
                                                        <span>${(product.price * item.quantity).toFixed(2)}</span>
                                                    </>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>

                                <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="order-confirmation">
                                <CheckCircle size={64} className="icon" />
                                <h2 className="confirmation-title">Pedido Confirmado</h2>
                                <p className="confirmation-message">¡Gracias por tu compra! Tu pedido ha sido confirmado exitosamente.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
