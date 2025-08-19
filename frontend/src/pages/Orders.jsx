import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Order.css";

function Order() {
  const { user } = useContext(UserContext);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchUserOrders(user.id);
    }
  }, [user]);

  const fetchUserOrders = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/orders/api/orders/user/${userId}`, {
        headers: {
          Authorization: user.token,
        },
      }
    );

    // Sort by orderDate descending (newest first)
    const sortedOrders = response.data.sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );

    setUserOrders(sortedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    alert("Error fetching orders.");
  } finally {
    setLoadingOrders(false);
  }
};


  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "shipped":
        return "status shipped";
      case "delivered":
        return "status delivered";
      case "cancelled":
        return "status cancelled";
      default:
        return "status ordered";
    }
  };

  const handleViewDetails = (order) => {
    navigate("/orders/details", { state: { order } });
  };

  return (
    <div className="order-container">
      <h2>Your Orders</h2>

      {loadingOrders ? (
        <p>Loading your orders...</p>
      ) : userOrders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="order-grid">
          {userOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>
                    Order ID: <span>{order.id}</span>
                  </h3>
                  <p>
                    Date: <strong>{new Date(order.orderDate).toLocaleString()}</strong>
                  </p>
                  <p>
                    Total: <strong>${order.totalPrice.toFixed(2)}</strong>
                  </p>
                </div>
                <span className={getStatusClass(order.status)}>
                  {order.status}
                </span>
              </div>

              <button
                onClick={() => handleViewDetails(order)}
                className="view-details-btn"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
