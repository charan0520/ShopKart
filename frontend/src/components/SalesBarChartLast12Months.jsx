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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesBarChartLast12Months = () => {
  const [salesData, setSalesData] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/analytics/api/analytics/sales/monthly-last-12-months', {
          headers: {
            Authorization: user.token,
          },
        });
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching monthly sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  if (!salesData) return <p>Loading sales chart...</p>;

  // Convert keys like '2024-07' to readable labels like 'Jul 2024'
  const labels = Object.keys(salesData).map(dateStr => {
    const [year, month] = dateStr.split('-');
    return new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'short', year: 'numeric' });
  });

  const dataValues = Object.values(salesData);

  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Sales (USD)',
        data: dataValues,
        backgroundColor: '#36a2eb',
        borderRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Sales (Last 12 Months)' }
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
    <div style={{ width: '800px', height: '500px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesBarChartLast12Months;
