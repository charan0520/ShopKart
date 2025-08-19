import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewOrders.css";
import { UserContext } from "../contexts/UserContext";

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get("http://localhost:8080/orders/api/orders", {
          headers: {
            Authorization: user.token,
          },
        }),
        axios.get("http://localhost:8080/products/api/products", {
          headers: {
            Authorization: user.token,
          },
        }),
      ]);

      const sortedOrders = ordersRes.data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setOrders(sortedOrders);

      const productMap = {};
      productsRes.data.forEach((product) => {
        productMap[product.id] = product;
      });
      setProducts(productMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load orders or products.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const saveStatus = async (order) => {
    try {
      await axios.put(`http://localhost:8080/orders/api/orders/${order.id}`, order, {
        headers: {
          Authorization: user.token,
        },
      });
      alert("Order status updated.");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="view-orders-container">
      <h2>All Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>Order ID: {order.id}</h3>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Date:</strong> {order.orderDate}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>

            <label>
              <strong>Status:</strong>{" "}
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="ordered">Ordered</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </label>

            <button onClick={() => saveStatus(order)} className="save-btn">
              Save Status
            </button>

            <div className="order-items">
              <strong>Items:</strong>
              <div className="items-list">
                {order.orderItems.map((item, index) => {
                  const product = products[item.productId];
                  return (
                    <div key={index} className="item-card">
                      {product ? (
                        <>
                          <img
                            src={product.image}
                            alt={product.title}
                            className="item-image"
                          />
                          <div>
                            <p><strong>{product.title}</strong></p>
                            <p>Price: ${item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                          </div>
                        </>
                      ) : (
                        <p>Product ID {item.productId} not found</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewOrders;
