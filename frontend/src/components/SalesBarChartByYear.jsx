import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { UserContext } from '../contexts/UserContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SalesBarChartByYear = () => {
    const [salesData, setSalesData] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/analytics/api/analytics/sales/total-by-year', {
                    headers: {
                        Authorization: user.token,
                    },
                });
                setSalesData(response.data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchSalesData();
    }, []);

    if (!salesData) return <p>Loading sales chart...</p>;

    const labels = Object.keys(salesData);
    const dataValues = Object.values(salesData);

    const data = {
        labels,
        datasets: [
            {
                label: 'Sales (USD)',
                data: dataValues,
                backgroundColor: '#4a90e2',
                borderRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: 'Sales by Year' }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `$${value.toLocaleString()}`
                }
            }
        }
    };

    return (
        <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
            <Bar data={data} options={options} />
        </div>
    )
};

export default SalesBarChartByYear;
