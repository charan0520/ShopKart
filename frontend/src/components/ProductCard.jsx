import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  // Find the quantity of the product in the cart, default to 0 if not found
  const productInCart = cart.find((item) => item.id === product.id);
  const quantity = productInCart ? productInCart.quantity : 0;

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>

      <div className="card-buttons">
        <Link to={`/product/${product.id}`}>
          <button className="view-btn">View</button>
        </Link>

        {quantity === 0 ? (
          <button className="add-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        ) : (
          <div className="quantity-controls">
            <button onClick={() => removeFromCart(product)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => addToCart(product)}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
