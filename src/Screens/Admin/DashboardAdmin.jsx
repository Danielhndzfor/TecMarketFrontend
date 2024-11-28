import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

import { 
    getTotalUsersCount, 
    getSellersCount, 
    getBuyersCount, 
    getUsersTodayCount 
} from '../../api/auth';
import { getProducts } from '../../api/products';
import NavBar from '../../Components/NavBar';

export default function DashboardAdmin() {
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        sellersCount: 0,
        buyersCount: 0,
        todayCount: 0,
        weeklyProductData: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [totalUsers, sellers, buyers, today, productsData] = await Promise.all([
                    getTotalUsersCount(),
                    getSellersCount(),
                    getBuyersCount(),
                    getUsersTodayCount(),
                    getProducts()
                ]);

                const productsCountBySeller = productsData.reduce((acc, product) => {
                    if (!product.seller) return acc;
                    const sellerName = `${product.seller.name} ${product.seller.firstName}`;
                    acc[sellerName] = (acc[sellerName] || 0) + 1;
                    return acc;
                }, {});

                const weeklyProductData = Object.entries(productsCountBySeller).map(
                    ([seller, count]) => ({ seller, count })
                );

                setDashboardData({
                    totalUsers,
                    sellersCount: sellers,
                    buyersCount: buyers,
                    todayCount: today,
                    weeklyProductData
                });
            } catch (error) {
                console.error("Dashboard data fetch error:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Productos Registrados por Vendedor',
                font: {
                    size: 20
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Productos',
                    font: {
                        size: 14
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Vendedores',
                    font: {
                        size: 14
                    }
                }
            }
        }
    };

    const productData = {
        labels: dashboardData.weeklyProductData.map(entry => entry.seller),
        datasets: [{
            label: 'Productos Registrados',
            data: dashboardData.weeklyProductData.map(entry => entry.count),
            backgroundColor: '#4CAF50',
        }],
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <NavBar />
            <div className="flex-grow p-6">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Dashboard Admin</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-500 text-white rounded-lg p-6 shadow-lg">
                        <p className="text-lg opacity-75">Total de Usuarios</p>
                        <p className="text-4xl font-bold">{dashboardData.totalUsers}</p>
                    </div>
                    <div className="bg-teal-500 text-white rounded-lg p-6 shadow-lg">
                        <p className="text-lg opacity-75">Nuevos Usuarios Hoy</p>
                        <p className="text-4xl font-bold">{dashboardData.todayCount}</p>
                    </div>
                    <div className="bg-pink-500 text-white rounded-lg p-6 shadow-lg">
                        <p className="text-lg opacity-75">Usuarios Compradores</p>
                        <p className="text-4xl font-bold">{dashboardData.buyersCount}</p>
                    </div>
                    <div className="bg-indigo-500 text-white rounded-lg p-6 shadow-lg">
                        <p className="text-lg opacity-75">Usuarios Vendedores</p>
                        <p className="text-4xl font-bold">{dashboardData.sellersCount}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="h-[calc(100vh-500px)]">
                        <Bar data={productData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}