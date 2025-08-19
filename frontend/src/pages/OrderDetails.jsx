import { useLocation } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "../styles/OrderDetails.css"; // Assuming we have a CSS file for styling
import { UserContext } from "../contexts/UserContext";

function OrderDetails() {
  const { state } = useLocation();
  const order = state?.order;
  const [productDetails, setProductDetails] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (order) {
      fetchProductDetails();
    }
  }, [order]);

  const fetchProductDetails = async () => {
    try {
      const productRequests = order.orderItems.map(item =>
        axios.get(`http://localhost:8080/products/api/products/${item.productId}`,
          {
            headers: {
              Authorization: user.token,
            },
          }
        )
      );
      const productResponses = await Promise.all(productRequests);
      setProductDetails(productResponses.map(response => response.data));
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Error fetching product details.");
    }
  };

  if (!order) {
    return <p>No order found. Please return to the orders page.</p>;
  }

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      <div className="order-header">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
      </div>

      <div className="order-shipping-info">
        <h3>Shipping Info</h3>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
      </div>

      <div className="order-items">
        <h3>Items</h3>
        {productDetails.length > 0 ? (
          <div className="order-items-list">
            {order.orderItems.map((item, index) => {
              const product = productDetails[index]; // Get the product details for the current order item
              return (
                <div key={index} className="order-item-card">
                  <img
                    src={product?.image || "default-image-url.jpg"} // Provide a default image if no product image
                    alt={product?.name}
                    className="product-image"
                  />
                  <div className="order-item-info">
                    <h4>{product?.title}</h4>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Price per unit:</strong> ${item.price.toFixed(2)}</p>
                    <p><strong>Total:</strong> ${(item.quantity * item.price).toFixed(2)}</p>
                    <p><strong>Description:</strong> {product?.description || "No description available."}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
