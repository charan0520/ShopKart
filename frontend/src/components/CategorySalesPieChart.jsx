import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { UserContext } from '../contexts/UserContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Function to generate a random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for(let i=0; i<6; i++) {
    color += letters[Math.floor(Math.random()*16)];
  }
  return color;
};

const CategorySalesPieChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/analytics/api/analytics/sales/by-category',
          { headers: { Authorization: user.token } }
        );

        const categories = Object.keys(res.data);
        const values = Object.values(res.data).map(v => Number(v.toFixed(2)));

        // Generate colors dynamically
        const colors = categories.map(() => getRandomColor());

        setData({
          labels: categories,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              hoverBackgroundColor: colors,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching category sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySales();
  }, [user.token]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  if (!data) return <p style={{ textAlign: 'center' }}>No sales data available.</p>;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 600,
        margin: '30px auto',
        padding: 20,
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        borderRadius: 10,
        backgroundColor: '#fff',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Category Sales Distribution</h2>

      <div
        style={{
          position: 'relative',
          height: 350,
          width: '100%',
        }}
      >
        <Pie
          data={data}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 20,
                  padding: 10,
                  usePointStyle: true,
                },
                align: 'start',
                maxHeight: 150,
              },
              tooltip: {
                callbacks: {
                  label: ctx => `${ctx.label}: $${ctx.parsed.toLocaleString()}`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default CategorySalesPieChart;
