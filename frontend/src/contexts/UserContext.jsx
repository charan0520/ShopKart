import { createContext, useState } from "react";
import {jwtDecode} from "jwt-decode";

export const UserContext = createContext();

function parseJwt(token) {
  try {
    if (!token) return null;

    // Remove 'Bearer ' if present
    const jwtToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Decode token
    const claims = jwtDecode(jwtToken);
    const isAdmin = (claims.role === "ADMIN")

    // Construct userData object
    const userData = {
      id: claims.id,
      email: claims.sub,
      name: claims.name,
      role: claims.role,
      token: "Bearer " + jwtToken, // Add Bearer prefix back
      admin: isAdmin
    };

    return userData;
  } catch (error) {
    console.error("Failed to parse token", error);
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(parseJwt(localStorage.getItem('auth_token')) || null);

  const login = (userData) => {
    const isAdmin = (userData.role === "ADMIN")
    localStorage.setItem('auth_token', userData.token);
    setUser({ ...userData, admin: isAdmin });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null); // Clear user info when logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
