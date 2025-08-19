import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import "../styles/EditProfile.css"; // Make sure this CSS file exists

function EditProfile() {
  const { user, login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "", // New password field (optional)
  });

  // Populate form with current user details when the component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        password: "", // Keep password field blank unless updated
      });
    }
  }, [user]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch user data to reload the context with updated user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/api/users/${user.id}`, {
        headers: {
          Authorization: user.token,
        },
      });
      login({
        id: user.id,
        email: response.data.email,
        name: response.data.name,
        role: user.role,
        token: "Bearer " + jwtToken
      }); // Update context with the latest user data
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send PUT request to update user profile
      const response = await axios.put(
        `http://localhost:8080/users/api/users/${user.id}`,
        formData, {
        headers: {
          Authorization: user.token,
        },
      }
      );

      // Update user context with the updated user data
      await fetchUserData();

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your new password"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
