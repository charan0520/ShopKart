import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom"; // import navigate
import { UserContext } from "../contexts/UserContext";

function Cart() {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // initialize navigate

  // Calculate the total price of the items in the cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (user === null) {
      navigate("/login");
      return;
    }
    navigate("/checkout"); // navigate to Checkout page
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p>Price: ${item.price}</p>
                  <div className="quantity-controls">
                    {/* Decrease quantity */}
                    <button
                      onClick={() => removeFromCart(item)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span> {/* Show current quantity */}
                    {/* Increase quantity */}
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
