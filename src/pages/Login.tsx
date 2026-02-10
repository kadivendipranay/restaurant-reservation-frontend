import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      login(res.data.token);

      const decoded: any = jwtDecode(res.data.token);

      if (decoded.role === "ADMIN") navigate("/admin");
      else navigate("/user");

      setEmail("");
      setPassword("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please enter name, email and password");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: "USER",
      });

      alert("Registered successfully. Please login.");
      setActiveTab("LOGIN");
      setPassword("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div className="card" style={{ maxWidth: 420, margin: "0 auto", padding: 25 }}>
        <h2 style={{ textAlign: "center" }}>Restaurant Reservation</h2>

        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <button onClick={() => setActiveTab("LOGIN")}>Login</button>
          <button onClick={() => setActiveTab("REGISTER")}>Register</button>
        </div>

        {activeTab === "LOGIN" && (
          <>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        )}

        {activeTab === "REGISTER" && (
          <>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
