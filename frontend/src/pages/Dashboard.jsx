import React, { useState } from 'react';
import SalesBarChartByYear from '../components/SalesBarChartByYear';
import SalesBarChartLast12Months from '../components/SalesBarChartLast12Months';
import TopProductsChartAndCards from '../components/TopProductsChartsAndCards';
import CategorySalesPieChart from '../components/CategorySalesPieChart';
import OrderStatusBarChart from '../components/OrderStatusBarChart';
import '../styles/Dashboard.css';
import SalesLineChart from '../components/SalesLineChart';
import SalesMetrics from '../components/SalesMetrics';

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('SalesBarChartByYear');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'SalesBarChartByYear':
        return <SalesBarChartByYear />;
      case 'SalesBarChartLast12Months':
        return <SalesBarChartLast12Months />;
      case 'TopProductsChartAndCards':
        return <TopProductsChartAndCards />;
      case 'CategorySalesPieChart':
        return <CategorySalesPieChart />;
      case 'OrderStatusBarChart':
        return <OrderStatusBarChart />;
      case 'SalesLineChart':
        return <SalesLineChart />;
      case 'SalesMetrics':
        return <SalesMetrics />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <button onClick={() => setSelectedComponent('SalesBarChartByYear')}>Sales by Year</button>
        <button onClick={() => setSelectedComponent('SalesBarChartLast12Months')}>Last 12 Months Sales</button>
        <button onClick={() => setSelectedComponent('TopProductsChartAndCards')}>Top Products</button>
        <button onClick={() => setSelectedComponent('CategorySalesPieChart')}>Sales by Category</button>
        <button onClick={() => setSelectedComponent('OrderStatusBarChart')}>Order Status Distribution</button>
        <button onClick={() => setSelectedComponent('SalesLineChart')}>Next Month Sales Prediction</button>
        <button onClick={() => setSelectedComponent('SalesMetrics')}>Sales Metrics</button>
      </aside>

      <main className="main-content">
        {renderComponent()}
      </main>
    </div>
  );
};

export default Dashboard;
