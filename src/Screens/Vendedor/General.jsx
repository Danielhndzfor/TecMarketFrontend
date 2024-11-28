import React, { useEffect, useState } from 'react';
import { getOrdersBySeller } from '../../api/order';
import { getUser } from '../../api/auth';
import ComboChart from '../../Components/ComboChart';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaUtensils, FaWineGlassAlt, FaCheese, FaCarrot, FaChartPie } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function General() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [totalOrdersGlobal, setTotalOrdersGlobal] = useState(0);
    const [totalOrdersMonth, setTotalOrdersMonth] = useState(0);
    const [totalOrdersWeek, setTotalOrdersWeek] = useState(0);
    const [totalOrdersToday, setTotalOrdersToday] = useState(0);
    const [data, setData] = useState({ labels: [], datasets: [] });
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrdersBySeller = async () => {
        try {
            setIsLoading(true);
            const user = await getUser();
            const id = user._id;
            setUserId(id);

            const fetchedOrders = await getOrdersBySeller(id);
            const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);

            calculateOrderCounts(sortedOrders, id);
            prepareChartData(sortedOrders, id);
        } catch (error) {
            console.error('Error fetching seller orders:', error);
            setError('Error al obtener las órdenes. Por favor, intente de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateOrderCounts = (orders, sellerId) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfMonth = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), 1);

        let globalCount = 0, monthCount = 0, weekCount = 0, todayCount = 0;
        const todayDate = now.toLocaleDateString();

        orders.forEach(order => {
            if (order.status === 'completado') {
                const orderDate = new Date(order.createdAt).toLocaleDateString();
                globalCount++;
                if (new Date(order.createdAt) >= startOfMonth) monthCount++;
                if (new Date(order.createdAt) >= startOfWeek) weekCount++;
                if (orderDate === todayDate) todayCount++;
            }
        });

        setTotalOrdersGlobal(globalCount);
        setTotalOrdersMonth(monthCount);
        setTotalOrdersWeek(weekCount);
        setTotalOrdersToday(todayCount);
    };

    const prepareChartData = (orders, sellerId) => {
        const productCounts = {};

        orders.forEach(order => {
            if (order.status === 'completado') {
                order.items.forEach(item => {
                    if (item.sellerId.toString() === sellerId) {
                        productCounts[item.title] = (productCounts[item.title] || 0) + 1;
                    }
                });
            }
        });

        const labels = Object.keys(productCounts);
        const dataValues = Object.values(productCounts);

        setData({
            labels,
            datasets: [
                {
                    label: 'Ventas por Producto',
                    data: dataValues,
                    backgroundColor: 'rgba(76, 175, 80, 0.6)',
                    borderColor: '#4CAF50',
                    borderWidth: 2,
                },
            ],
        });
    };

    useEffect(() => {
        fetchOrdersBySeller();
    }, []);

    const OrderCard = ({ title, value, icon, color }) => (
        <Card className="h-100 shadow-lg rounded-3 border-0 overflow-hidden">
            <div className="food-pattern-background" style={{ backgroundColor: color }}></div>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center position-relative">
                <div className="mb-3 text-white" style={{ fontSize: '2.5rem', zIndex: 1 }}>{icon}</div>
                <Card.Title className="text-center text-white mb-3" style={{ zIndex: 1 }}>{title}</Card.Title>
                <Card.Text className="fs-1 fw-bold text-center text-white" style={{ zIndex: 1 }}>{value}</Card.Text>
            </Card.Body>
        </Card>
    );

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" variant="success">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 bg-light">
            <h1 className="mb-4 text-success fw-bold">Dashboard de Ventas Gastronómicas</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row className="mb-4 g-4">
                <Col md={3}>
                    <OrderCard title="Ventas Totales" value={totalOrdersGlobal} icon={<FaUtensils />} color="#2E7D32" />
                </Col>
                <Col md={3}>
                    <OrderCard title="Ventas del Mes" value={totalOrdersMonth} icon={<FaWineGlassAlt />} color="#388E3C" />
                </Col>
                <Col md={3}>
                    <OrderCard title="Ventas de la Semana" value={totalOrdersWeek} icon={<FaCheese />} color="#43A047" />
                </Col>
                <Col md={3}>
                    <OrderCard title="Ventas de Hoy" value={totalOrdersToday} icon={<FaCarrot />} color="#4CAF50" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="shadow-lg rounded-3 border-0 overflow-hidden">
                        <div className="food-pattern-background bg-success opacity-25"></div>
                        <Card.Body className="position-relative">
                            <Card.Title className="text-center text-success mb-4 fw-bold fs-4">
                                <FaChartPie className="me-2" />
                                Gráfico de Ventas por Producto
                            </Card.Title>
                            <div style={{ height: '300px', position: 'relative', zIndex: 1 }}>
                                <ComboChart data={data} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <style jsx global>{`
                .food-pattern-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    opacity: 0.8;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20h20v20H20V20zm20 20h20v20H40V40zm20-20h20v20H60V20zm-40 40h20v20H20V60zm40 0h20v20H60V60z'/%3E%3C/g%3E%3C/svg%3E");
                }
            `}</style>
        </Container>
    );
}

export default General;