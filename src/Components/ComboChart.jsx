import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components, including scales
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
        <Line 
            data={{ ...data, datasets: datasetsWithHighlight }} 
            options={{
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            }} 
        />
    );
};

export default ComboChart;


