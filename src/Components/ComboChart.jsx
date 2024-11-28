import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes necesarios
Chart.register(...registerables);

const ComboChart = ({ data }) => {
    const today = new Date().toLocaleDateString(); // Obtener la fecha actual

    const datasetsWithHighlight = data.datasets.map(dataset => ({
        ...dataset,
        pointBackgroundColor: dataset.data.map((value, index) => 
            data.labels[index] === today ? 'red' : dataset.pointBackgroundColor || 'rgba(75, 192, 192, 1)'
        ),
    }));

    return (
        <div style={{ height: '300px' }}> {/* Ajusta la altura aquí */}
            <Bar 
                data={{ ...data, datasets: datasetsWithHighlight }} 
                options={{
                    maintainAspectRatio: false, // Permitir personalización de la altura
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Productos',
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Cantidad',
                            },
                        },
                    },
                }} 
            />
        </div>
    );
};

export default ComboChart;


