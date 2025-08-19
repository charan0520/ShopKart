import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../styles/EditProducts.css";
import { UserContext } from "../contexts/UserContext";

function EditProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const product = location?.state?.product;

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    if (!product) {
      alert("No product selected for editing.");
      navigate("/admin/all-products");
    } else {
      setFormData({
        title: product.title || "",
        price: product.price || "",
        description: product.description || "",
        image: product.image || "",
        category: product.category || "",
      });
    }
  }, [product, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8080/products/api/products/${product.id}`,
        {
          ...formData,
          price: parseFloat(formData.price),
          rating: {
            rate: null,
            count: null
          }
        },
        {
          headers: {
            Authorization: user.token,
          },
        }
      );
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          ></textarea>
        </label>

        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </label>

        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProducts;
