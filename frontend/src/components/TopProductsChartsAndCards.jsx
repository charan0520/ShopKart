import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const TopProductsCards = () => {
  const { user } = useContext(UserContext);
  const [topProductSales, setTopProductSales] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const salesRes = await axios.get(
          'http://localhost:8080/analytics/api/analytics/products/top-3-most-sold',
          { headers: { Authorization: user.token } }
        );
        setTopProductSales(salesRes.data);

        const productsRes = await axios.get('http://localhost:8080/products/api/products', {
          headers: { Authorization: user.token },
        });
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>Loading...</p>;

  if (!topProductSales || Object.keys(topProductSales).length === 0)
    return <p style={{ textAlign: 'center', marginTop: 50 }}>No sales data available.</p>;

  const topProductsDetails = Object.entries(topProductSales)
    .map(([id, salesCount]) => {
      const product = products.find((p) => p.id === id);
      return product ? { ...product, salesCount } : null;
    })
    .filter(Boolean);

  if (topProductsDetails.length === 0)
    return <p style={{ textAlign: 'center', marginTop: 50 }}>No matching products found.</p>;

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 16px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, fontWeight: '700', fontSize: 28, color: '#222' }}>
        Top 3 Products
      </h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {topProductsDetails.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              width: 280,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
            }}
          >
            <div
              style={{
                height: 180,
                backgroundColor: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={product.image}
                alt={product.title || 'Product image'}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '16px 20px' }}>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  margin: '0 0 8px',
                  color: '#111',
                  minHeight: 48,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={product.title}
              >
                {product.title}
              </h3>

              <p
                style={{
                  fontWeight: '700',
                  fontSize: 18,
                  color: '#1e88e5',
                  margin: '0 0 12px',
                }}
              >
                ${product.price.toFixed(2)}
              </p>
              <div
                style={{
                  marginTop: 12,
                  fontWeight: '600',
                  color: '#4caf50',
                  fontSize: 16,
                }}
              >
                Sold: {product.salesCount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsCards;
