import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"LOGIN" | "REGISTER">("LOGIN");
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

      const decoded: any = jwtDecode(res.data.token);
      decoded.role === "ADMIN" ? navigate("/admin") : navigate("/user");
    } catch (err: any) {
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
    } catch (err: any) {
      alert(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)), url('https://images.unsplash.com/photo-1528605248644-14dd04022da1') center/cover",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 120,
        }}
      >
        <div
          style={{
            width: 420,
            padding: 35,
            borderRadius: 20,
            background: "rgba(255,255,255,.95)",
            boxShadow: "0 10px 30px rgba(0,0,0,.3)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 15 }}>
            🍽 Royal Restaurant
          </h2>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {["LOGIN", "REGISTER"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  background:
                    activeTab === t
                      ? "linear-gradient(135deg,#ff6a00,#ff005c)"
                      : "#eee",
                  color: activeTab === t ? "white" : "#444",
                }}
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
              style={inputStyle}
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={activeTab === "LOGIN" ? handleLogin : handleRegister}
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 30,
              border: "none",
              marginTop: 15,
              fontWeight: "bold",
              background: "linear-gradient(135deg,#ff6a00,#ff005c)",
              color: "white",
              cursor: "pointer",
            }}
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

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ccc",
  marginBottom: 12,
};
