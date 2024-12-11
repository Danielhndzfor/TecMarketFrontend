import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { getCart, addToCart, removeFromCart, clearCart, decreaseQuantity, increaseQuantity } from '../../api/cart';
import { getUser } from '../../api/auth';
import { getProduct } from '../../api/products';
import { createOrder } from '../../api/order';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Cart = () => {
    const { cart, setCart } = useContext(CartContext);
    const [cartId, setCartId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState({});
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderNumber, setOrderNumber] = useState(null);
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para controlar el modal
    const [productToDelete, setProductToDelete] = useState(null); // Producto que se va a eliminar

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
                if (data) {
                    setCart(data);
                    setCartId(data._id); // Guarda el cartId del carrito obtenido

                    const productPromises = data.items.map(async (item) => {
                        const product = await getProduct(item.product);
                        return { ...item, product: { ...product, sellerId: item.seller } };
                    });

                    const productsDetails = await Promise.all(productPromises);
                    setProducts(productsDetails.reduce((acc, item) => {
                        acc[item.product._id] = item.product;
                        return acc;
                    }, {}));
                } else {
                    console.log('Carrito no encontrado, creando uno nuevo...');
                    const newCart = await createCart(userId); // Crear un carrito si no existe
                    setCartId(newCart._id); // Guarda el cartId del nuevo carrito
                }
            } catch (error) {
                console.error('Error fetching cart:', error.message);
                setError('Failed to fetch cart. Please try again later.');
                setCart({ items: [] });
            }
        };

        fetchCart();
    }, [userId, setCart]);

    const handleIncrease = async (productId) => {
        try {
            const formattedCartId = cartId.toString();  // Convertir a string
            const formattedProductId = productId.toString(); // Convertir a string
            const updatedCart = await increaseQuantity(userId, formattedCartId, formattedProductId);
            console.log('Cantidad aumentada:', updatedCart);
            setCart(updatedCart); // Actualiza el estado del carrito
        } catch (error) {
            console.error('Error al aumentar la cantidad:', error);
        }
    };

    const handleDecrease = async (productId) => {
        try {
            const formattedCartId = cartId.toString();  // Convertir a string
            const formattedProductId = productId.toString(); // Convertir a string
            const updatedCart = await decreaseQuantity(userId, formattedCartId, formattedProductId);
            console.log('Cantidad disminuida:', updatedCart);
            setCart(updatedCart); // Actualiza el estado del carrito
        } catch (error) {
            console.error('Error al disminuir la cantidad:', error);
        }
    };

    // Confirmación de eliminación
    const confirmDelete = (productId) => {
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };

    // Manejo de la eliminación de un producto
    const handleRemove = async () => {
        const productId = productToDelete;
        const cartId = cart.cartId; // Asegúrate de obtener el cartId del objeto del carrito

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
            setShowDeleteModal(false); // Cierra el modal después de la eliminación
        } catch (error) {
            console.error('Error removing item from cart:', error.message);
        }
    };

    const handleQuantityChange = (product, newQuantity) => {
        // Si la cantidad es 0, abrir el modal
        if (newQuantity === 0) {
            showDeleteModal(product.productId); // Abre el modal
            return; // Detener la ejecución
        }

        // Asegurarse de que la cantidad no sea menor a 1
        if (newQuantity < 1) {
            toast.error('La cantidad no puede ser menor a 1', {
                position: toast.POSITION.BOTTOM_CENTER,
                autoClose: 3000,
            });
            return; // Bloquear la disminución
        }

        // Si la cantidad es válida, actualizarla
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.productId === product.productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            return updatedCart;
        });
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

            await clearCart(userId);
            setCart({ items: [] });
            if (paymentMethod === 'Transferencia') {
                setStep(3);
            } else {
                setStep(3);
            }
        } catch (error) {
            console.error('Error confirming order:', error.message);
            alert('Error confirming order: ' + error.message);
        }
    };



    const handleNextStep = async () => {
        if (step === 1) {
            setStep(2);
            return;
        }

        if (step === 2) {
            // Ir al paso 3 si el método de pago es transferencia
            setStep(3);
            return;
        }

        // Pasar al siguiente paso por defecto
        setStep(prevStep => prevStep + 1);
    };


    const handleBack = () => {
        window.history.back();
    };

    if (loading) return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold flex items-center">
                        <ShoppingCart className="mr-2" /> Tu Carrito
                    </h1>
                    <div className="flex space-x-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-green-500' : 'bg-gray-600'
                                    }`}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <>
                            {cart.items && cart.items.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {cart.items.map(item => (
                                        <li key={item.product} className="py-4 flex items-center">
                                            <img
                                                src={products[item.product]?.images?.[0] || "/api/placeholder/80/80"}
                                                alt={products[item.product]?.name}
                                                className="h-16 w-16 rounded object-cover mr-4"
                                                onError={(e) => { e.target.src = "/api/placeholder/80/80"; }}
                                            />
                                            <div className="flex-1">
                                                <h2 className="text-lg font-semibold">{products[item.product]?.name || 'Cargando...'}</h2>
                                                <div className="flex items-center mt-2">
                                                    {item.quantity > 1 && (
                                                        <button
                                                            onClick={() => handleDecrease(item.product)}
                                                            className="text-gray-500 focus:outline-none focus:text-gray-600"
                                                        >
                                                            <Minus size={18} />
                                                        </button>
                                                    )}
                                                    <input
                                                        type="number"

                                                        readOnly
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.product, Number(e.target.value))}
                                                        className="mx-2 border text-center w-12" style={{ pointerEvents: 'none' }}
                                                    />
                                                    {item.quantity < products[item.product]?.stock && (
                                                        <button
                                                            onClick={() => handleIncrease(item.product)}
                                                            className="text-gray-500 focus:outline-none focus:text-gray-600"
                                                        >
                                                            <Plus size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold">${(products[item.product]?.price * item.quantity || 0).toFixed(2)}</p>
                                                <button
                                                    onClick={() => confirmDelete(item.product)}
                                                    className="text-red-500 hover:text-red-700 mt-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500 py-4">Tu carrito está vacío.</p>
                            )}
                            <div className="mt-8 flex justify-between items-center">
                                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
                                    <ArrowLeft className="inline mr-2" /> Regresar
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</h2>
                                    <button
                                        onClick={handleNextStep}
                                        className={`mt-4 px-4 py-2 rounded transition duration-300 ${cart.items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                        disabled={cart.items.length === 0}
                                    >
                                        Siguiente
                                    </button>

                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="payment-selection">
                            <h2 className="text-2xl font-bold mb-6">Selecciona Tu Método de Pago</h2>
                            <div className="space-y-4">
                                <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Efectivo"
                                        checked={paymentMethod === 'Efectivo'}
                                        onChange={() => setPaymentMethod('Efectivo')}
                                        className="mr-2"
                                    />
                                    <DollarSign className="mr-2" />
                                    <span>Pago en Efectivo</span>
                                </label>
                                <label className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Transferencia"
                                        checked={paymentMethod === 'Transferencia'}
                                        onChange={() => setPaymentMethod('Transferencia')}
                                        className="mr-2"
                                    />
                                    <CreditCard className="mr-2" />
                                    <span>Pago por Transferencia</span>
                                </label>
                            </div>
                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <ArrowLeft className="inline mr-2" /> Atrás
                                </button>
                                <button
                                    onClick={handleOrderConfirmation}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                                >
                                    Verificar Orden
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="order-complete text-center">
                            <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
                            <h2 className="text-2xl font-bold">¡Orden Completada!</h2>
                            <p className="mt-4">Gracias por tu compra. Tu orden ha sido registrada exitosamente.</p>
                            <button
                                onClick={() => (window.location.href = '/home')}
                                className="mt-6 mx-5 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                            >
                                Regresar a Inicio
                            </button>
                            <button
                                onClick={() => (window.location.href = '/historial')}
                                className="mt-6 mx-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Revisar Ordenes
                            </button>

                        </div>
                    )}

                    {/* Modal de confirmación de eliminación */}
                    {showDeleteModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white rounded p-6 w-96">
                                <h2 className="text-lg font-semibold mb-4">¿Estás seguro de eliminar este producto?</h2>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleRemove}
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
