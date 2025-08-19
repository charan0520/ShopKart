import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { UserContext } from "../contexts/UserContext";
import "../styles/Navbar.css"; // Make sure this file exists

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);

  return (
    <nav className="navbar">
      <h1>ShopKart</h1>
      <div>
        {user?.admin ? (
          <>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Products
            </NavLink>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/add-product" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              AddProduct
            </NavLink>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              ViewOrders
            </NavLink>
            <NavLink to="/edit-profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              EditProfile
            </NavLink>
            <button
              onClick={logout}
              className="logout-button"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f44336";
                e.target.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#f44336";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Orders
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Cart ({cart.length})
            </NavLink>
            {user ? (
              <>
                <span style={{ marginLeft: "10px" }}>Welcome, {user.name}</span>
                <NavLink to="/edit-profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  EditProfile
                </NavLink>
                <button
                  onClick={logout}
                  className="logout-button"
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f44336";
                    e.target.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#f44336";
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Login
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Register
                </NavLink>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
