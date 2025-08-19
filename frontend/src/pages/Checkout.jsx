import { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed or you can use fetch

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(UserContext); // Get the user details from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Check if all fields are filled out
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Please fill all fields!");
      return;
    }

    // Check if the user is logged in
    if (!user) {
      alert("Please login to place an order.");
      navigate("/login"); // Redirect to login page if user is not logged in
      return;
    }

    // Construct orderItems from the cart
    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    // Construct orderPayload for the new orders microservice
    const orderPayload = {
      id:null,
      userId: user.id, // Assuming user object has userId
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      orderItems: orderItems, // Order items array with product details
      totalPrice: totalPrice, // Total order price
      status: "ordered",
      orderDate:new Date().toISOString() // Status of the order
    };

    try {
      // Make the POST request to create the order in the new microservice
      const response = await axios.post("http://localhost:8080/orders/api/orders", orderPayload,{
        headers: {
          Authorization: user.token,
        },
      });

      if (response.status === 200) {
        // Order placed successfully
        console.log("Order placed successfully!");
        setCart([]); // Clear the cart
        alert("Order placed successfully!");

        // Redirect to home page or order confirmation page
        navigate("/"); // Or navigate to an order confirmation page if needed
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <h2>Checkout</h2>
        <p>Your cart is empty. Please add products first.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Checkout</h2>

      <div className="checkout-grid">
        {/* Cart Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.title} (x{item.quantity}) - ${item.price.toFixed(2)} each
              </li>
            ))}
          </ul>
          <h4>Total: ${totalPrice.toFixed(2)}</h4>
        </div>

        {/* Shipping Form */}
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h3>Shipping Details</h3>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="checkout-btn">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
