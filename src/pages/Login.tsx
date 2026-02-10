import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"LOGIN" | "REGISTER">("LOGIN");

  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in (runs ONCE)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toUpperCase();

    if (!token) return;

    if (role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/user", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveTokenAndRedirect = (token: string) => {
    localStorage.setItem("token", token);

    const decoded: any = jwtDecode(token);
    const role = (decoded.role || "USER").toUpperCase();

    localStorage.setItem("role", role);

    alert(`✅ Login successful | Role: ${role}`);

    if (role === "ADMIN") navigate("/admin", { replace: true });
    else navigate("/user", { replace: true });
  };

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

      saveTokenAndRedirect(res.data.token);

      setEmail("");
      setPassword("");
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err?.message || "Login failed";

      alert(`STATUS: ${status || "NO STATUS"}\nMESSAGE: ${message}`);
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

      alert("✅ Registered successfully. Please login now.");

      setActiveTab("LOGIN");
      setPassword("");
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 409) {
        alert("✅ Email already registered. Please login.");
        setActiveTab("LOGIN");
        return;
      }

      const message =
        err?.response?.data?.message || err?.message || "Register failed";

      alert(`STATUS: ${status || "NO STATUS"}\nMESSAGE: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div
        className="card"
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          padding: "25px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          Restaurant Reservation ✅
        </h2>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          <button
            onClick={() => setActiveTab("LOGIN")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              background:
                activeTab === "LOGIN"
                  ? "linear-gradient(135deg,#0077ff,#00c6ff)"
                  : "#f1f1f1",
              color: activeTab === "LOGIN" ? "white" : "black",
              border: "none",
            }}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("REGISTER")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              background:
                activeTab === "REGISTER"
                  ? "linear-gradient(135deg,#00c853,#00bfa5)"
                  : "#f1f1f1",
              color: activeTab === "REGISTER" ? "white" : "black",
              border: "none",
            }}
          >
            Register
          </button>
        </div>

        {/* LOGIN */}
        {activeTab === "LOGIN" && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        )}

        {/* REGISTER */}
        {activeTab === "REGISTER" && (
          <>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
