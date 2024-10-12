import React, { useEffect, useState } from 'react';
import { getOrdersByUser, submitReview, submitRating } from '../../api/order'; // Asegúrate de tener las funciones adecuadas en tu API
import { getUser } from '../../api/auth';

const Historial = () => {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState({}); // Para guardar calificaciones y comentarios
    const [ratings, setRatings] = useState({}); // Para guardar solo calificaciones

    const fetchOrdersByUser = async () => {
        try {
            const user = await getUser();
            setUserId(user._id);
            
            const fetchedOrders = await getOrdersByUser(user._id); // Obtiene las órdenes del usuario
            setOrders(fetchedOrders);
            initializeReviews(fetchedOrders); // Inicializa el estado de las revisiones
            initializeRatings(fetchedOrders); // Inicializa el estado de las calificaciones
        } catch (error) {
            console.error('Error fetching user orders:', error);
            setError(error.message);
        }
    };

    const initializeReviews = (fetchedOrders) => {
        const initialReviews = {};
        fetchedOrders.forEach(order => {
            order.items.forEach(item => {
                initialReviews[item._id] = { rating: '', comment: '' }; // Inicializa el estado de las revisiones
            });
        });
        setReviews(initialReviews);
    };

    const initializeRatings = (fetchedOrders) => {
        const initialRatings = {};
        fetchedOrders.forEach(order => {
            order.items.forEach(item => {
                initialRatings[item._id] = ''; // Inicializa el estado de las calificaciones
            });
        });
        setRatings(initialRatings);
    };

    const handleReviewSubmit = async (orderId, itemId) => {
        const { rating, comment } = reviews[itemId] || {};

        if (!rating || !comment) {
            alert('Por favor, completa ambos campos antes de enviar la revisión.');
            return;
        }

        try {
            await submitReview(orderId, itemId, { rating, comment });
            alert('Revisión enviada con éxito.');
            // Resetea la revisión para el producto
            setReviews(prevReviews => ({
                ...prevReviews,
                [itemId]: { rating: '', comment: '' },
            }));
            fetchOrdersByUser(); // Recarga las órdenes para mostrar la nueva revisión
        } catch (error) {
            console.error('Error submitting review:', error);
            setError(error.message);
        }
    };

    const handleRatingSubmit = async (orderId, itemId) => {
        const rating = ratings[itemId];

        if (!rating) {
            alert('Por favor, selecciona una calificación antes de enviar.');
            return;
        }

        try {
            await submitRating(orderId, itemId, { rating });
            alert('Calificación enviada con éxito.');
            // Resetea la calificación para el producto
            setRatings(prevRatings => ({
                ...prevRatings,
                [itemId]: '',
            }));
            fetchOrdersByUser(); // Recarga las órdenes para mostrar la nueva calificación
        } catch (error) {
            console.error('Error submitting rating:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchOrdersByUser();
    }, []);

    return (
        <div>
            <h1>Historial de Compras</h1>
            {error && <p>{error}</p>}
            {orders.length === 0 ? (
                <p>No has realizado ninguna compra.</p>
            ) : (
                <div>
                    <table className="historial-table">
                        <thead>
                            <tr>
                                <th>Fecha de Orden</th>
                                <th>Artículo</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Calificación</th>
                                <th>Comentario</th>
                                <th>Enviar Revisión</th>
                                <th>Enviar Calificación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                order.items.map(item => (
                                    <tr key={item._id}>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{item.title}</td>
                                        <td>${item.unit_price.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <select
                                                value={ratings[item._id] || ''}
                                                onChange={(e) => setRatings(prev => ({
                                                    ...prev,
                                                    [item._id]: e.target.value,
                                                }))}
                                            >
                                                <option value="">Selecciona una calificación</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Comentario"
                                                value={reviews[item._id]?.comment || ''}
                                                onChange={(e) => setReviews(prev => ({
                                                    ...prev,
                                                    [item._id]: {
                                                        ...prev[item._id],
                                                        comment: e.target.value,
                                                    },
                                                }))}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleReviewSubmit(order._id, item._id)}>
                                                Enviar Revisión
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleRatingSubmit(order._id, item._id)}>
                                                Enviar Calificación
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Historial;
