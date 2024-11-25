import React, { useEffect, useState } from 'react';
import { getOrdersBySeller, updateItemStatus } from '../../api/order';
import { getUser } from '../../api/auth';
import { updateProductStock } from '../../api/products';
import ComboChart from '../../Components/ComboChart';
import '../../Css/Dashboard.css';
import { FaUser } from 'react-icons/fa';

function General() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [totalEarningsGlobal, setTotalEarningsGlobal] = useState(0);
    const [totalEarningsMonth, setTotalEarningsMonth] = useState(0);
    const [totalEarningsWeek, setTotalEarningsWeek] = useState(0);
    const [totalEarningsToday, setTotalEarningsToday] = useState(0);
    const [data, setData] = useState({ labels: [], datasets: [] });
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [buyerInfo, setBuyerInfo] = useState(null);
    const today = new Date();
    const [activeTab, setActiveTab] = useState('General'); // Estado para las subtabs
    const [prevTotalEarningsGlobal, setPrevTotalEarningsGlobal] = useState(0);
    const [prevTotalEarningsMonth, setPrevTotalEarningsMonth] = useState(0);
    const [prevTotalEarningsWeek, setPrevTotalEarningsWeek] = useState(0);
    const [prevTotalEarningsToday, setPrevTotalEarningsToday] = useState(0);



    const fetchOrdersBySeller = async () => {
        try {
            const user = await getUser();
            const id = user._id;
            setUserId(id);

            const fetchedOrders = await getOrdersBySeller(id);
            const filteredOrders = fetchedOrders.filter(order =>
                order.items.some(item => item.sellerId.toString() === id)
            );

            // Filtrar y ordenar por las órdenes recientes
            const sortedOrders = fetchedOrders.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setOrders(filteredOrders);
            setOrders(sortedOrders);
            calculateEarnings(filteredOrders, id, currentWeekOffset);
        } catch (error) {
            console.error('Error fetching seller orders:', error);
            setError('Error al obtener las órdenes.');
        }
    };

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    const calculateEarnings = (orders, sellerId, weekOffset) => {
        const now = new Date();
        const currentDay = now.getDay();

        // Fechas para el inicio de la semana y fin de la semana
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - currentDay + (weekOffset * 7));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Fecha para el inicio del mes basado en el primer día del período
        const startOfMonth = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), 1);

        // Fecha de hoy
        const todayDate = now.toLocaleDateString();

        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date.toLocaleDateString();
        });

        const earningsData = orders.reduce((acc, order) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString();
            const orderDateFull = new Date(order.createdAt);

            // Filtramos solo los items completados
            order.items.forEach(item => {
                if (item.sellerId.toString() === sellerId && item.status === 'completado') {
                    const earnings = item.unit_price * item.quantity;

                    // Ganancias globales
                    acc.totalEarningsGlobal += earnings;

                    // Ganancias del mes en curso
                    if (orderDateFull.getFullYear() === startOfMonth.getFullYear() &&
                        orderDateFull.getMonth() === startOfMonth.getMonth()) {
                        acc.totalEarningsMonth += earnings;
                    }

                    // Ganancias de la semana en curso
                    if (orderDateFull >= startOfWeek && orderDateFull <= endOfWeek) {
                        acc.totalEarningsWeek += earnings;
                    }

                    // Ganancias de hoy
                    if (orderDate === todayDate) {
                        acc.totalEarningsToday += earnings;
                    }

                    // Datos para la gráfica
                    if (!acc.groupedData[orderDate]) {
                        acc.groupedData[orderDate] = { earnings: 0, salesCount: 0 };
                    }
                    acc.groupedData[orderDate].earnings += earnings;
                    acc.groupedData[orderDate].salesCount += item.quantity;
                }
            });

            return acc;
        }, {
            totalEarningsGlobal: 0,
            totalEarningsMonth: 0,
            totalEarningsWeek: 0,
            totalEarningsToday: 0,
            groupedData: {}
        });

        // Asignar ganancias calculadas
        setTotalEarningsGlobal(earningsData.totalEarningsGlobal);
        setTotalEarningsMonth(earningsData.totalEarningsMonth);
        setTotalEarningsWeek(earningsData.totalEarningsWeek);
        setTotalEarningsToday(earningsData.totalEarningsToday);

        // Valores de la gráfica
        const earningsValues = weekDates.map(date => earningsData.groupedData[date]?.earnings || 0);
        const salesValues = weekDates.map(date => earningsData.groupedData[date]?.salesCount || 0);

        // Configuración de la gráfica
        setData({
            labels: weekDates,
            datasets: [
                {
                    type: 'bar',
                    label: 'Cantidad de Ventas',
                    data: salesValues,
                    backgroundColor: salesValues.map((value, index) =>
                        weekDates[index] === todayDate ? 'rgba(144, 238, 144, 0.8)' : 'rgba(144, 238, 144, 0.5)'
                    ),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: true,
                },
                {
                    type: 'line',
                    label: 'Ganancias',
                    data: earningsValues,
                    borderColor: earningsValues.map((value, index) =>
                        weekDates[index] === todayDate ? 'rgba(136, 132, 216, 1)' : 'rgba(136, 132, 216, 0.5)'
                    ),
                    backgroundColor: 'rgba(136, 132, 216, 0.2)',
                    fill: false,
                    tension: 0.1,
                },
                {
                    type: 'line',
                    label: 'Día Actual',
                    data: earningsValues.map((value, index) => weekDates[index] === todayDate ? value : null),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    fill: true,
                    radius: 6,
                }
            ],
        });
    };

    useEffect(() => {
        setPrevTotalEarningsGlobal(totalEarningsGlobal);
    }, [totalEarningsGlobal]);
    
    useEffect(() => {
        setPrevTotalEarningsMonth(totalEarningsMonth);
    }, [totalEarningsMonth]);
    
    useEffect(() => {
        setPrevTotalEarningsWeek(totalEarningsWeek);
    }, [totalEarningsWeek]);
    
    useEffect(() => {
        setPrevTotalEarningsToday(totalEarningsToday);
    }, [totalEarningsToday]);
    
    

    const getStatusClass = (status) => {
        switch (status) {
            case 'completado':
                return 'status-completed';
            case 'pendiente':
                return 'status-pending';
            case 'cancelado':
                return 'status-canceled';
            default:
                return '';
        }
    };

    const handleUpdateItemStatus = async (orderId, itemId, newStatus) => {
        try {
            const item = orders.flatMap(order => order.items).find(item => item._id === itemId);

            if (!item) {
                console.error(`Item con ID ${itemId} no encontrado en las órdenes.`);
                return;
            }

            const productId = item.productId;

            await updateItemStatus(orderId, itemId, newStatus);
            await updateProductStock(productId, newStatus, item.quantity);

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
            calculateEarnings(updatedOrders, userId, currentWeekOffset);
        } catch (error) {
            console.error('Error updating product status:', error);
            setError('Error al actualizar el estado del producto.');
        }
    };

    const handlePreviousWeek = () => {
        setCurrentWeekOffset(prev => prev - 1);
    };

    const handleNextWeek = () => {
        setCurrentWeekOffset(prev => prev + 1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleBuyerInfo = (buyer) => {
        setBuyerInfo(buyer);
    };

    useEffect(() => {
        fetchOrdersBySeller();
    }, [currentWeekOffset]);

    const startOfWeekDate = new Date(today);
    startOfWeekDate.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));
    const endOfWeekDate = new Date(startOfWeekDate);
    endOfWeekDate.setDate(startOfWeekDate.getDate() + 6);

    const handleSort = (column) => {
        const sortedOrders = [...orders].sort((a, b) => {
            const aValue = column === 'Articulo' ? a.title : column === 'Precio Unitario' ? a.unit_price : a.createdAt;
            const bValue = column === 'Articulo' ? b.title : column === 'Precio Unitario' ? b.unit_price : b.createdAt;

            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        });
        setOrders(sortedOrders);
    };

    // Paginación
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <div>
            <h1>Órdenes del Vendedor</h1>
            {error && <p>{error}</p>}
            {orders.length === 0 ? (
                <p>No hay órdenes para mostrar.</p>
            ) : (
                <div>
                    <div className="earnings-container">
                        {/* Ganancias Globales */}
                        <h2 className="total-earnings">
                            Total de Ganancias Globales: <span>${totalEarningsGlobal.toFixed(2)}</span>
                        </h2>
                        <p className="percentage-change">
                            Incremento:
                            {prevTotalEarningsGlobal > 0 ?
                                `${(((totalEarningsGlobal - prevTotalEarningsGlobal) / prevTotalEarningsGlobal) * 100).toFixed(2)}%` :
                                "N/A"}
                        </p>

                        {/* Ganancias Mensuales */}
                        <h2 className="monthly-earnings">
                            Total de Ganancias en el Mes: <span>${totalEarningsMonth.toFixed(2)}</span>
                        </h2>
                        <p className="percentage-change">
                            Incremento:
                            {prevTotalEarningsMonth > 0 ?
                                `${(((totalEarningsMonth - prevTotalEarningsMonth) / prevTotalEarningsMonth) * 100).toFixed(2)}%` :
                                "N/A"}
                        </p>

                        {/* Ganancias Semanales */}
                        <h2 className="weekly-earnings">
                            Total de Ganancias de la Semana: <span>${totalEarningsWeek.toFixed(2)}</span>
                        </h2>
                        <p className="percentage-change">
                            Incremento:
                            {prevTotalEarningsWeek > 0 ?
                                `${(((totalEarningsWeek - prevTotalEarningsWeek) / prevTotalEarningsWeek) * 100).toFixed(2)}%` :
                                "N/A"}
                        </p>

                        {/* Ganancias Diarias */}
                        <h2 className="daily-earnings">
                            Total de Ganancias Hoy: <span>${totalEarningsToday.toFixed(2)}</span>
                        </h2>
                        <p className="percentage-change">
                            Incremento:
                            {prevTotalEarningsToday > 0 ?
                                `${(((totalEarningsToday - prevTotalEarningsToday) / prevTotalEarningsToday) * 100).toFixed(2)}%` :
                                "N/A"}
                        </p>

                        {/* Información de Fechas */}
                        <div className="date-info">
                            <h3 className="period">
                                Periodo: <span>{`${formatDate(startOfWeekDate)} - ${formatDate(endOfWeekDate)}`}</span>
                            </h3>
                            <h3 className="current-date">
                                Fecha Actual: <span>{formatDate(today)}</span>
                            </h3>
                        </div>
                    </div>


                    <div className="week-navigation">
                        <button onClick={handlePreviousWeek}>Semana Anterior</button>
                        <button onClick={handleNextWeek}>Semana Siguiente</button>
                    </div>

                    <div className="chart-and-table-container">
                        <div className="chart-container">
                            <ComboChart data={data} />
                        </div>

                        <div className="filters">
                            <input
                                type="text"
                                placeholder="Buscar Artículo"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <select onChange={handleStatusFilter} value={statusFilter}>
                                <option value="">Filtrar por Estado</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="completado">Completado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>

                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('Fecha de Orden')}>Fecha de Orden</th>
                                    <th onClick={() => handleSort('Articulo')}>Artículo</th>
                                    <th onClick={() => handleSort('Precio Unitario')}>Precio Unitario</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Actualizar Estado</th>
                                    <th>Comprador</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders
                                    .filter(order =>
                                        order.items.some(item =>
                                            item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                            (statusFilter === '' || item.status === statusFilter)
                                        )
                                    )
                                    .map(order => (
                                        order.items.map(item => (
                                            <tr key={item._id}>
                                                <td>{formatDate(new Date(order.createdAt))}</td>
                                                <td>{item.title}</td>
                                                <td>${item.unit_price.toFixed(2)}</td>
                                                <td>{item.quantity}</td>
                                                <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
                                                <td>
                                                    <span className={getStatusClass(item.status)}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleUpdateItemStatus(order._id, item._id, e.target.value)}
                                                    >
                                                        <option value="pendiente">Pendiente</option>
                                                        <option value="completado">Completado</option>
                                                        <option value="cancelado">Cancelado</option>
                                                    </select>
                                                </td>
                                                <td className='user'>
                                                    <FaUser
                                                        className="user-icon"
                                                        onClick={() => handleBuyerInfo(order.buyer)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }, (_, index) => (
                            <button key={index} onClick={() => setCurrentPage(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {buyerInfo && (
                        <div className="buyer-modal" backdrop={true} >
                            <div className="modal-content">
                                <h2>Datos del Comprador</h2>
                                <p>Nombre: {buyerInfo.name}</p>
                                <p>Email: {buyerInfo.email}</p>
                                <p>Teléfono: {buyerInfo.phoneNumber}</p>
                                <button onClick={() => setBuyerInfo(null)}>Cerrar</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default General