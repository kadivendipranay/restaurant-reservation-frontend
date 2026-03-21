import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("LOGIN");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return alert("Enter email & password");

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token);

      const decoded = jwtDecode(res.data.token);
      decoded.role === "ADMIN" ? navigate("/admin") : navigate("/user");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return alert("Fill all fields");

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role: "USER",
      });

      alert("Registered successfully. Please login.");
      setActiveTab("LOGIN");
      setPassword("");
    } catch (err) {
      alert(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">🍽 Royal Restaurant</h2>

          {/* Tabs */}
          <div className="login-tabs">
            {["LOGIN", "REGISTER"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`tab-btn ${activeTab === t ? "active" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === "REGISTER" && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />

          <button
            onClick={activeTab === "LOGIN" ? handleLogin : handleRegister}
            disabled={loading}
            className="login-btn"
          >
            {loading
              ? "Please wait..."
              : activeTab === "LOGIN"
              ? "Login"
              : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}