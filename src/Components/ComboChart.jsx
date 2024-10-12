// ComboChart.jsx
import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Registrar todos los elementos
Chart.register(...registerables);

const ComboChart = ({ data }) => {
    return (
        <div>
            <Bar data={data} />
        </div>
    );
};

export default ComboChart;

