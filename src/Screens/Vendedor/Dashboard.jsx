import React, { useEffect, useState } from 'react';
import { getOrdersBySeller, updateItemStatus } from '../../api/order';
import { getUser } from '../../api/auth';
import { updateProductStock } from '../../api/products'; // Asegúrate de importar la función
import ComboChart from '../../Components/ComboChart'; // Asegúrate de que la ruta es correcta
import '../../Css/Dashboard.css';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [data, setData] = useState({ labels: [], datasets: [] });

    const fetchOrdersBySeller = async () => {
        try {
            const user = await getUser();
            const id = user._id;
            setUserId(id);

            const fetchedOrders = await getOrdersBySeller();
            const filteredOrders = fetchedOrders.filter(order =>
                order.items.some(item => item.sellerId === id)
            );

            setOrders(filteredOrders);
            calculateEarnings(filteredOrders, id);
        } catch (error) {
            console.error('Error fetching seller orders:', error);
            setError(error.message);
        }
    };

    const calculateEarnings = (orders, sellerId) => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Lunes
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

        const weeklyOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startOfWeek && orderDate <= endOfWeek;
        });

        const earnings = weeklyOrders.reduce((total, order) => {
            return total + order.items.reduce((sum, item) => {
                if (item.sellerId === sellerId && item.status === 'completado') {
                    return sum + item.unit_price * item.quantity;
                }
                return sum;
            }, 0);
        }, 0);
        setTotalEarnings(earnings);

        const earningsData = weeklyOrders.map(order => ({
            date: new Date(order.createdAt).toLocaleDateString(),
            earnings: order.items.reduce((sum, item) => {
                if (item.sellerId === sellerId && item.status === 'completado') {
                    return sum + item.unit_price * item.quantity;
                }
                return sum;
            }, 0),
        }));

        const labels = earningsData.map(entry => entry.date);
        const earningsValues = earningsData.map(entry => entry.earnings);

        const salesData = weeklyOrders.map(order => ({
            date: new Date(order.createdAt).toLocaleDateString(),
            salesCount: order.items.reduce((count, item) => {
                if (item.sellerId === sellerId && item.status === 'completado') {
                    return count + item.quantity;
                }
                return count;
            }, 0),
        }));

        const salesValues = salesData.map(entry => entry.salesCount);

        setData({
            labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Cantidad de Ventas',
                    data: salesValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: true,
                },
                {
                    type: 'line',
                    label: 'Ganancias',
                    data: earningsValues,
                    borderColor: '#8884d8',
                    backgroundColor: 'rgba(136, 132, 216, 0.2)',
                    fill: false,
                    tension: 0.1,
                },
            ],
        });
    };

    const handleUpdateItemStatus = async (orderId, itemId, newStatus) => {
        try {
            const item = orders.flatMap(order => order.items).find(item => item._id === itemId);
            
            // Verifica si el item existe
            if (!item) {
                console.error(`Item con ID ${itemId} no encontrado en las órdenes.`);
                return; // O maneja el error de otra manera
            }
    
            // Aquí deberías usar el ID del producto correcto
            const productId = item.productId; // Asegúrate de que `item` tenga una referencia al `productId`
    
            // Actualizar el estado del item
            await updateItemStatus(orderId, itemId, newStatus);
    
            // Actualizar el stock según el nuevo estado
            await updateProductStock(productId, newStatus, item.quantity); // Ahora pasamos directamente el nuevo estado
    
            // Actualizar las órdenes en el estado
            const updatedOrders = orders.map(order => {
                if (order._id === orderId) {
                    return {
                        ...order,
                        items: order.items.map(item => {
                            if (item._id === itemId) {
                                return { ...item, status: newStatus };
                            }
                            return item;
                        }),
                    };
                }
                return order;
            });
    
            setOrders(updatedOrders);
            calculateEarnings(updatedOrders, userId);
        } catch (error) {
            console.error('Error updating product status:', error);
            setError(error.message);
        }
    };
    
    

    useEffect(() => {
        fetchOrdersBySeller();
    }, []);

    return (
        <div>
            <h1>Órdenes del Vendedor</h1>
            {error && <p>{error}</p>}
            {orders.length === 0 ? (
                <p>No hay órdenes para mostrar.</p>
            ) : (
                <div>
                    <h2>Total de Ganancias: ${totalEarnings.toFixed(2)}</h2>
                    <ComboChart data={data} /> {/* Usando el ComboChart aquí */}
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Fecha de Orden</th>
                                <th>Artículo</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Actualizar Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                order.items
                                    .filter(item => item.sellerId === userId)
                                    .map(item => (
                                        <tr key={item._id}>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>{item.title}</td>
                                            <td>${item.unit_price.toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
                                            <td>
                                                <span className={`status ${item.status}`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)} {/* Capitaliza el estado */}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    onChange={(e) => handleUpdateItemStatus(order._id, item._id, e.target.value)}
                                                    defaultValue={item.status}
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="completado">Completado</option>
                                                    <option value="cancelado">Cancelado</option>
                                                </select>
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

export default Dashboard;
