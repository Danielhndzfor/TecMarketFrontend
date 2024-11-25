import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    getTotalUsersCount,
    getSellersCount,
    getBuyersCount,
    getUsersTodayCount,
} from '../../api/auth';
import NavBar from '../../Components/NavBar';

export default function DashboardAdmin() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [sellersCount, setSellersCount] = useState(0);
    const [buyersCount, setBuyersCount] = useState(0);
    const [todayCount, setTodayCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const totalUsers = await getTotalUsersCount();
                const sellers = await getSellersCount();
                const buyers = await getBuyersCount();
                const today = await getUsersTodayCount();

                setTotalUsers(totalUsers);
                setSellersCount(sellers);
                setBuyersCount(buyers);
                setTodayCount(today);
            } catch (error) {
                console.error("Error al obtener datos del dashboard:", error);
            }
        }
        fetchData();
    }, []);

    const usersData = {
        labels: ['Total Usuarios', 'Nuevos Hoy'],
        datasets: [
            {
                label: 'Usuarios',
                data: [totalUsers, todayCount],
                backgroundColor: ['#4A90E2', '#50E3C2'],
            },
        ],
    };

    const roleDistributionData = {
        labels: ['Vendedores', 'Compradores'],
        datasets: [
            {
                label: 'Distribución de Roles',
                data: [sellersCount, buyersCount],
                backgroundColor: ['#E94E77', '#4A90E2'],
            },
        ],
    };

    return (
        <>
            <NavBar />
            <div style={{ padding: '20px', backgroundColor: '#eef2f4', minHeight: '100vh' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Dashboard Admin</h1>

                {/* Cuadrados con estadísticas generales */}
                <div style={infoBoxContainerStyle}>
                    <InfoBox title="Total de Usuarios" value={totalUsers} />
                    <InfoBox title="Nuevos Usuarios Hoy" value={todayCount} />
                    <InfoBox title="Usuarios Compradores" value={buyersCount} />
                    <InfoBox title="Usuarios Vendedores" value={sellersCount} />
                </div>

                <div style={cardContainerStyle}>
                    {/* Gráfico de Usuarios Totales y Nuevos */}
                    <div style={cardStyle}>
                        <h3 style={cardTitleStyle}>Usuarios Totales y Nuevos</h3>
                        <div style={{ ...chartContainerStyle, height: '400px' }}>
                            <Bar data={usersData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Distribución de Roles */}
                    <div style={cardStyle}>
                        <h3 style={cardTitleStyle}>Distribución de Usuarios</h3>
                        <div style={{ ...chartContainerStyle, height: '400px' }}>
                            <Doughnut data={roleDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Componente para cada cuadrado de estadísticas
function InfoBox({ title, value }) {
    return (
        <div style={infoBoxStyle}>
            <h4 style={{ fontSize: '1.8em' ,marginBottom: '15px', color: '#333' }}>{title}</h4>
            <p style={{ fontSize: '5em', color: '#4A90E2' }}>{value}</p>
        </div>
    );
}

// Estilos
const infoBoxContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
};

const infoBoxStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    minWidth: '350px',
    height: '220px',
};

const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
};

const cardStyle = {
    width: '48%',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
};

const cardTitleStyle = {
    marginBottom: '15px',
    fontSize: '1.2em',
    color: '#333',
};

const chartContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
};
