import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const SalesMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('http://localhost:8080/analytics/api/analytics/sales/kpi-metrics', {
                    headers: {
                        Authorization: user.token,
                    },
                });
                setMetrics(response.data);
            } catch (error) {
                console.error('Error fetching sales metrics:', error);
            }
        };

        fetchMetrics();
    }, [user.token]);

    if (!metrics) return <p>Loading sales metrics...</p>;

    const {
        ordersThisMonth,
        averageOrderValue,
        totalSales,
        ordersThisYear,
        totalOrders
    } = metrics;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h2>Sales Metrics</h2>
            <div style={styles.metricsContainer}>
                <div style={styles.metricBox}>
                    <h3>Total Orders</h3>
                    <p>{totalOrders.toLocaleString()}</p>
                </div>
                <div style={styles.metricBox}>
                    <h3>Orders This Month</h3>
                    <p>{ordersThisMonth.toLocaleString()}</p>
                </div>
                <div style={styles.metricBox}>
                    <h3>Orders This Year</h3>
                    <p>{ordersThisYear.toLocaleString()}</p>
                </div>
                <div style={styles.metricBox}>
                    <h3>Total Sales</h3>
                    <p>${totalSales.toLocaleString()}</p>
                </div>
                <div style={styles.metricBox}>
                    <h3>Average Order Value</h3>
                    <p>${averageOrderValue.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    metricsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginTop: '20px',
    },
    metricBox: {
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
};

export default SalesMetrics;
