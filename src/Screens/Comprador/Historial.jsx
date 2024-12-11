import React, { useEffect, useState, useRef } from 'react';
import { getOrdersByBuyer } from '../../api/order';
import { getUser } from '../../api/auth';
import '../../Css/Historial.css';
import Navbar from '../../Components/NavBar';

const Historial = () => {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Control del estado de la modal

    const fetchOrdersByBuyer = async () => {
        setError(''); // Limpiar cualquier error previo
        setLoading(true); // Activar estado de carga
    
        try {
            const user = await getUser();
            setUserId(user._id);
    
            const fetchedOrders = await getOrdersByBuyer(user._id);
            if (fetchedOrders.length === 0) {
                setError('No has realizado ninguna compra.');
                setOrders([]); // Si no hay órdenes, establecer un arreglo vacío
            } else {
                // Ordenar las órdenes de la más reciente a la más antigua
                const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders); // Establecer las órdenes ordenadas
            }
        } catch (error) {
            console.error('Error al obtener las órdenes:', error);
            setError('Hubo un problema al obtener las órdenes.');
        } finally {
            setLoading(false); // Desactivar estado de carga
        }
    };
    

    useEffect(() => {
        fetchOrdersByBuyer();
    }, []);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true); // Abre el modal
    };

    const handleCloseOrderDetails = () => {
        setIsModalOpen(false); // Cierra el modal
        setSelectedOrder(null);
    };

    const calcularTotalOrden = (items) => {
        return items.reduce((total, item) => {
            const price = item.unit_price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
    };

    const renderOrderItems = (items) => {
        return items.map((item) => (
            <tr key={item._id}>
                <td>{item.title}</td>
                <td>${item.unit_price}</td>
                <td>{item.quantity}</td>
                <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
            </tr>
        ));
    };

    return (
        <>
            <Navbar />
            <div className="historial-container">
                <h1>Historial de Compras</h1>

                {loading ? (
                    <div className="loading-container text-center">
                        <div className="spinner"></div>
                        <p>Cargando tus compras...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="no-orders-message text-center">
                                <span role="img" aria-label="sad face" style={{ fontSize: '50px' }}>😔</span>
                                <p>{error}</p>
                            </div>
                        )}

                        {orders.length === 0 && !error ? (
                            <div className="no-orders-message text-center">
                                <span role="img" aria-label="sad face" style={{ fontSize: '50px' }}>😔</span>
                                <p>No has realizado ninguna compra.</p>
                            </div>
                        ) : (
                            <div>
                                <table className="historial-table">
                                    <thead>
                                        <tr>
                                            <th>Fecha de Orden</th>
                                            <th>Método de Pago</th>
                                            <th>Total</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>{order.paymentMethod}</td>
                                                <td>${calcularTotalOrden(order.items).toFixed(2)}</td>
                                                <td>
                                                    <button className="btn-view-order" onClick={() => handleViewOrder(order)}>
                                                        Ver Orden
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Modal de detalles de la orden */}
                                <div className={`modal2 ${isModalOpen ? 'open' : ''}`}>
                                    <div className="modal-content2">
                                        <h2>Detalles de la Orden</h2>
                                        {selectedOrder ? (
                                            <>
                                                <table className="order-items-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Artículo</th>
                                                            <th>Precio Unitario</th>
                                                            <th>Cantidad</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {renderOrderItems(selectedOrder.items)}
                                                    </tbody>
                                                </table>
                                                <div className="order-total">
                                                    <p>Total de la Orden: ${calcularTotalOrden(selectedOrder.items).toFixed(2)}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <p>Cargando detalles de la orden...</p>
                                        )}
                                        <button className="close-btn" onClick={handleCloseOrderDetails}>
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};


export default Historial;
