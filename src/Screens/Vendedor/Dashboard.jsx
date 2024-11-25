import React, { useEffect, useState } from 'react';
import '../../Css/Dashboard.css';
import NavBar from '../../Components/NavBar';
import General from './General';
import Inventario from './Inventario';
import Ordenes from './Ordenes';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('General'); // Estado para las subtabs

    // Cambiar entre subtabs
    const handleTabChange = (tab) => setActiveTab(tab);


    return (
        <>
            <NavBar />
            <div className="dashboard-container">
                <h1>Dashboard</h1>

                {/* Subtabs Navigation */}
                <div className="subtabs-container">
                    <button
                        className={`subtab-button ${activeTab === 'General' ? 'active' : ''}`}
                        onClick={() => handleTabChange('General')}
                    >
                        General
                    </button>
                    <button
                        className={`subtab-button ${activeTab === 'Inventario' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Inventario')}
                    >
                        Inventario
                    </button>
                    <button
                        className={`subtab-button ${activeTab === 'Órdenes' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Órdenes')}
                    >
                        Órdenes
                    </button>
                </div>

                <div className="subtab-content">
                    {activeTab === 'General' && (
                        <div>
                            <General />
                        </div>
                    )}

                    {activeTab === 'Inventario' && (
                        <div>
                            <Inventario />
                        </div>
                    )}

                    {activeTab === 'Órdenes' && (
                        <div>
                            <Ordenes />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;

