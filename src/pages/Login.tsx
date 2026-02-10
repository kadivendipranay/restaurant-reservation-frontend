import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";
import Navbar from "../components/Navbar";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"LOGIN" | "REGISTER">("LOGIN");

  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const saveTokenAndRedirect = (token: string) => {
    localStorage.setItem("token", token);

    const decoded: any = jwtDecode(token);
    const role = (decoded.role || "USER").toUpperCase();

    localStorage.setItem("role", role);

    alert(`✅ Login successful | Role: ${role}`);

    // 🔥 Single redirect point (no loops)
    if (role === "ADMIN") {
      window.location.replace("/#/admin");
    } else {
      window.location.replace("/#/user");
    }
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
        style={{ maxWidth: "420px", margin: "0 auto", padding: "25px" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          Restaurant Reservation ✅
        </h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          <button onClick={() => setActiveTab("LOGIN")}>Login</button>
          <button onClick={() => setActiveTab("REGISTER")}>Register</button>
        </div>

        {activeTab === "LOGIN" && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        )}

        {activeTab === "REGISTER" && (
          <>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
