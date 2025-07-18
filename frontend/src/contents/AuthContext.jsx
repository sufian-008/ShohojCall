import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";

// ✅ Context তৈরি
export const AuthContext = createContext({});

// ✅ axios instance
const client = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // user info state
  const navigate = useNavigate();

  // ✅ REGISTER Function
  const handleRegister = async (name, username, password) => {
    try {
      const res = await client.post("/register", {
        name,
        username,
        password,
      });

      if (res.status === StatusCodes.CREATED) {
        return res.data.message; // success message
      }
    } catch (err) {
      // যদি API error থাকে তাহলে সেটা throw করব
      const msg =
        err?.response?.data?.message || err.message || "Registration failed";
      throw new Error(msg);
    }
  };

  // ✅ LOGIN Function
  const handleLogin = async (username, password) => {
    try {
      const res = await client.post("/login", {
        username,
        password,
      });

      if (res.status === StatusCodes.OK) {
        const { user, token } = res.data;

        // Token save করবো localStorage এ
        localStorage.setItem("token", token);

        // Context এ userData set করবো
        setUserData(user);

 
        navigate("/dashboard");

        return user;
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Login failed";
      throw new Error(msg);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/login");
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
  );
};
