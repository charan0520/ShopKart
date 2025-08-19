import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesLineChart = () => {
    const { user } = useContext(UserContext);
    const [salesData, setSalesData] = useState([]);
    const [predictedSales, setPredictedSales] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.token) return;

        const fetchData = async () => {
            try {
                const [salesRes, predictionRes] = await Promise.all([
                    axios.get('http://localhost:8080/analytics/api/analytics/sales/monthlyAllTime', {
                        headers: { Authorization: user.token },
                    }),
                    axios.get('http://localhost:8080/analytics/api/analytics/sales/predict-next-month-sales', {
                        headers: { Authorization: user.token },
                    }),
                ]);

                setSalesData(salesRes.data);
                setPredictedSales(predictionRes.data); // assume the backend returns a number
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load chart or prediction data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>Loading sales data...</p>;

    if (!salesData || salesData.length === 0)
        return <p style={{ textAlign: 'center', marginTop: 50 }}>No sales data available.</p>;

    const labels = salesData.map(({ year, month }) =>
        new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' })
    );

    const dataPoints = salesData.map(({ sales }) => sales);

    const data = {
        labels,
        datasets: [
            {
                label: 'Monthly Sales ($)',
                data: dataPoints,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Monthly Sales Over Time' },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `$${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                },
                title: {
                    display: true,
                    text: 'Sales Amount ($)',
                    font: { weight: 'bold' },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Month / Year',
                    font: { weight: 'bold' },
                },
            },
        },
        interaction: { mode: 'nearest', intersect: false },
    };

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 12px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    height: '370px', // Reduced height
                    marginBottom: '16px', // Reduced margin
                }}
            >
                <Line data={data} options={options} />
            </div>

            {predictedSales !== null && (
                <div
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '18px', // Reduced padding
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                        marginTop: '16px', // Reduced margin
                        textAlign: 'center',
                        color: '#333',
                        fontFamily: "'Roboto', sans-serif",
                        maxWidth: '360px', // Reduced width
                        margin: '0 auto',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    <h3
                        style={{
                            fontSize: '20px', // Reduced font size
                            fontWeight: '700',
                            color: '#555',
                            marginBottom: '12px', // Reduced margin
                        }}
                    >
                        Predicted Sales for Next Month
                    </h3>
                    <p
                        style={{
                            fontSize: '24px', // Reduced font size
                            fontWeight: '800',
                            color: '#0288d1',
                            marginBottom: '12px',
                        }}
                    >
                        ${predictedSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p
                        style={{
                            fontSize: '12px', // Reduced font size
                            fontWeight: '400',
                            color: '#777',
                            marginTop: '8px',
                            opacity: 0.8,
                        }}
                    >
                        This is an estimate based on current trends.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SalesLineChart;
