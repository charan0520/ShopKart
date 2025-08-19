import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

// Register necessary chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Generate random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  return '#' + Array.from({ length: 6 })
    .map(() => letters[Math.floor(Math.random() * 16)])
    .join('');
};

const OrderStatusBarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/analytics/api/analytics/orders/count-by-status',
          { headers: { Authorization: user.token } }
        );

        const orderStatusData = res.data;
        const labels = Object.keys(orderStatusData);
        const values = Object.values(orderStatusData);
        const colors = labels.map(() => getRandomColor());

        setChartData({
          labels,
          datasets: [
            {
              label: 'Order Count',
              data: values,
              backgroundColor: colors,
              borderRadius: 8,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching order status data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [user.token]);

  if (loading) return <p>Loading...</p>;
  if (!chartData) return <p>No data available.</p>;

  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      padding: 20,
      border: '1px solid #ddd',
      borderRadius: 12,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Order Status Bar Chart</h2>
      <div style={{ height: 350 }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.parsed.y} orders`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 50,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default OrderStatusBarChart;
