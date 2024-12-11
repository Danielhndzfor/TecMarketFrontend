import React, { useEffect, useState, useRef } from 'react';
import { getAllOrders } from '../../api/order';
import '../../Css/Historial.css';
import Navbar from '../../Components/NavBar';
import { Modal, Button, Alert } from 'react-bootstrap';
import { FaFileAlt, FaTrophy } from 'react-icons/fa';

const Historial = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(8);
    const [productSales, setProductSales] = useState({});
    const orderDetailsRef = useRef(null);

    const fetchOrders = async () => {
        try {
            const orders = await getAllOrders();
            setOrders(orders);
            countProductSales(orders);
        } catch (error) {
            setError('Error al cargar las órdenes.');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const countProductSales = (orders) => {
        const salesCount = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (salesCount[item.title]) {
                    salesCount[item.title] += item.quantity;
                } else {
                    salesCount[item.title] = item.quantity;
                }
            });
        });
        setProductSales(salesCount);
    };

    const getTopProducts = () => {
        return Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setTimeout(() => {
            orderDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleCloseOrderDetails = () => {
        setSelectedOrder(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calcularTotalOrden = (items) => {
        return items.reduce((total, item) => total + item.unit_price * item.quantity, 0);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Navbar />
            <div className="h-100 mb-10">
                <div className="mx-20 mt-20">
                    <h1 className="text-3xl font-light text-black-500 mb-4 text-center">Historial de Compras</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {orders.length === 0 ? (
                        <p>No se encontraron órdenes.</p>
                    ) : (
                        <div className="mt-8 flex flex-row">
                            {/* Tabla de historial de compras */}
                            <div className="w-full lg:w-3/4">
                                <table className="min-w-full border border-emerald-800 mb-4">
                                    <thead>
                                        <tr className="bg-gray-950 text-emerald-300">
                                            <th className="px-6 py-4 text-left">Fecha de Orden</th>
                                            <th className="px-6 py-4 text-left">Nombre de Comprador</th>
                                            <th className="px-6 py-4 text-left">Método de Pago</th>
                                            <th className="px-6 py-4 text-left">Total</th>
                                            <th className="px-6 py-4 text-left">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-emerald-800">
                                        {currentOrders.map(order => (
                                            <tr key={order._id} className={selectedOrder && selectedOrder._id === order._id ? 'bg-gray-800/50' : ''}>
                                                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">{order.buyer?.name || 'N/A'}</td>
                                                <td className="px-6 py-4">{order.paymentMethod}</td>
                                                <td className="px-6 py-4">${calcularTotalOrden(order.items).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span onClick={() => handleViewOrder(order)} className="cursor-pointer1">
                                                        <FaFileAlt className="text-emerald-600 hover:text-emerald-700 size-7" />
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Modal Detalles de la Orden */}
                            {selectedOrder && (
                                <Modal show={!!selectedOrder} onHide={handleCloseOrderDetails} size="lg" centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Detalles de la Orden</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {selectedOrder && (
                                            <div>
                                                <h5 className="mb-3">Información del Comprador</h5>
                                                <p><strong>Nombre:</strong> {selectedOrder.buyer.name} {selectedOrder.buyer.firstName} {selectedOrder.buyer.lastName}</p>
                                                <p><strong>Email:</strong> {selectedOrder.buyer.email}</p>
                                                <p><strong>Teléfono:</strong> {selectedOrder.buyer.phoneNumber}</p>

                                                <h5 className="my-3">Información del Vendedor</h5>
                                                {selectedOrder.items.length > 0 && selectedOrder.items[0].sellerInfo ? (
                                                    <>
                                                        <p><strong>Nombre:</strong> {selectedOrder.items[0].sellerInfo.name}</p>
                                                        <p><strong>Email:</strong> {selectedOrder.items[0].sellerInfo.email}</p>
                                                        <p><strong>Teléfono:</strong> {selectedOrder.items[0].sellerInfo.phoneNumber}</p>
                                                    </>
                                                ) : (
                                                    <p>No hay información del vendedor disponible.</p>
                                                )}

                                                <h5 className="my-3">Productos Comprados</h5>
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Producto</th>
                                                            <th>Cantidad</th>
                                                            <th>Precio Unitario</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedOrder.items.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item.title}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>${item.unit_price.toFixed(2)}</td>
                                                                <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                <h5 className="my-3">Resumen</h5>
                                                <p><strong>Total de la Orden:</strong> ${calcularTotalOrden(selectedOrder.items).toFixed(2)}</p>
                                            </div>
                                        )}
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseOrderDetails}>
                                            Cerrar
                                        </Button>
                                    </Modal.Footer>
                                </Modal>


                            )}

                            {/* Tabla de productos más vendidos */}
                            <div className="w-full lg:w-1/4 mt-6 lg:mt-0 lg:ml-8">
                                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg">
                                    <h2 className="text-xl font-semibold text-center mb-4">
                                        <FaTrophy className="text-yellow-500 mr-2" /> Top 5 Productos Más Vendidos
                                    </h2>
                                    <table className="min-w-full text-center">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2">Producto</th>
                                                <th className="px-4 py-2">Ventas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getTopProducts().map(([product, count], index) => (
                                                <tr key={index} className="bg-white">
                                                    <td className="px-4 py-2">{product}</td>
                                                    <td className="px-4 py-2">{count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Historial;

