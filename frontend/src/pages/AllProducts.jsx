import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AllProducts.css"; // Ensure this CSS file is styled
import { UserContext } from "../contexts/UserContext";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/products/api/products",{
        headers: {
          Authorization: user.token,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products.");
    }
  };

  const handleEdit = (product) => {
    navigate("/admin/edit-product", { state: { product } });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:8080/products/api/products/${productId}`,{
        headers: {
          Authorization: user.token,
        },
      });
      setProducts(products.filter((p) => p.id !== productId));
      alert("Product deleted.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="all-products-container">
      <h2>All Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <h3>{product.title}</h3>
              <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>

              <div className="product-actions">
                <button onClick={() => handleEdit(product)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(product.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProducts;
