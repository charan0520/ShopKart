import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode';


function parseJwt(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

function Login() {
  const {user, login } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/api/login",
        { "email":email.trim(), "password":password.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const jwtToken = response.data.token;

      if (jwtToken) {
        let claims = parseJwt(jwtToken);
        let userData = {
          id:claims.id,
          email: claims.sub,
          name: claims.name,
          role: claims.role,
          token: "Bearer "+jwtToken
        };
        login(userData); // store user in context
        toast.success("Login successful!");
        if(userData.role === "ADMIN")
          navigate("/admin/products")
        else
          navigate("/"); // redirect to home
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Authentication failed. Please check credentials.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
