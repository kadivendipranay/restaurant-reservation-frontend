
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("LOGIN");
  const [forgotPassword, setForgotPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const switchTab = (tab) => {
    if (loading) return;

    setActiveTab(tab);
    setForgotPassword(false);
    clearMessages();
    setShowPassword(false);
    setPassword("");
  };

  const openForgotPassword = () => {
    if (loading) return;

    setForgotPassword(true);
    clearMessages();
    setPassword("");
    setShowPassword(false);
  };

  const backToLogin = () => {
    if (loading) return;

    setForgotPassword(false);
    setActiveTab("LOGIN");
    clearMessages();
    setPassword("");
    setShowPassword(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Forgot password request
    if (forgotPassword) {
      setLoading(true);

      try {
        await API.post("/auth/forgot-password", {
          email: trimmedEmail,
        });

        setSuccess(
          "If an account exists for this email, password reset instructions will be sent to you."
        );
      } catch (err) {
        console.error("Forgot password request failed:", err);

        setError(
          err.response?.data?.message ||
            "Unable to process your request. Please try again."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // Registration validation
    if (activeTab === "REGISTER" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (activeTab === "REGISTER" && password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (activeTab === "LOGIN") {
        const response = await API.post("/auth/login", {
          email: trimmedEmail,
          password,
        });

        const token = response.data?.token;

        if (!token) {
          throw new Error(
            "The server did not return an authentication token."
          );
        }

        const decoded = jwtDecode(token);

        if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
          throw new Error(
            "The server returned an expired token. Please try again."
          );
        }

        const role = String(decoded.role || "").toUpperCase();

        if (role !== "ADMIN" && role !== "USER") {
          throw new Error(
            "Your account role is invalid. Please contact support."
          );
        }

        login(token);

        navigate(role === "ADMIN" ? "/admin" : "/user", {
          replace: true,
        });
      } else {
        await API.post("/auth/register", {
          name: name.trim(),
          email: trimmedEmail,
          password,
        });

        setActiveTab("LOGIN");
        setForgotPassword(false);
        setName("");
        setPassword("");
        setShowPassword(false);

        setSuccess(
          "Registration successful! Please sign in with your account."
        );
      }
    } catch (err) {
      console.error("Authentication request failed:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          (activeTab === "LOGIN"
            ? "Login failed. Please check your credentials."
            : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <main className="login-main">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-brand-icon" aria-hidden="true">
            {forgotPassword ? "🔑" : "🍽️"}
          </div>

          <p className="login-eyebrow">WELCOME TO RESERVEDINE</p>

          <h1 className="login-title" id="login-title">
            {forgotPassword
              ? "Reset Your Password"
              : activeTab === "LOGIN"
                ? "Welcome Back!"
                : "Create Your Account"}
          </h1>

          <p className="login-subtitle">
            {forgotPassword
              ? "Enter your registered email address to receive password reset instructions."
              : activeTab === "LOGIN"
                ? "Sign in to manage your restaurant reservations."
                : "Join us and make your next dining experience special."}
          </p>

          {!forgotPassword && (
            <div
              className="login-tabs"
              role="tablist"
              aria-label="Account options"
            >
              <button
                type="button"
                role="tab"
                id="login-tab"
                aria-selected={activeTab === "LOGIN"}
                aria-controls="login-form"
                disabled={loading}
                onClick={() => switchTab("LOGIN")}
                className={`tab-btn ${
                  activeTab === "LOGIN" ? "active" : ""
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                role="tab"
                id="register-tab"
                aria-selected={activeTab === "REGISTER"}
                aria-controls="login-form"
                disabled={loading}
                onClick={() => switchTab("REGISTER")}
                className={`tab-btn ${
                  activeTab === "REGISTER" ? "active" : ""
                }`}
              >
                Register
              </button>
            </div>
          )}

          {error && (
            <div className="form-message error-message" role="alert">
              <span aria-hidden="true">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="form-message success-message" role="status">
              <span aria-hidden="true">✅</span>
              <span>{success}</span>
            </div>
          )}

          <form
            id="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {activeTab === "REGISTER" && !forgotPassword && (
              <div className="form-group">
                <label htmlFor="register-name">Full Name</label>

                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    👤
                  </span>

                  <input
                    id="register-name"
                    className="login-input"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    required
                    maxLength={100}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>

              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  ✉️
                </span>

                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={loading}
                  required
                  maxLength={254}
                />
              </div>
            </div>

            {!forgotPassword && (
              <div className="form-group">
                <label htmlFor="login-password">Password</label>

                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    🔒
                  </span>

                  <input
                    id="login-password"
                    className="login-input password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      activeTab === "REGISTER"
                        ? "Create a password"
                        : "Enter your password"
                    }
                    autoComplete={
                      activeTab === "LOGIN"
                        ? "current-password"
                        : "new-password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    required
                    maxLength={128}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((visible) => !visible)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {activeTab === "REGISTER" && (
                  <p className="input-hint">
                    Use at least 8 characters for your password.
                  </p>
                )}
              </div>
            )}

            {activeTab === "LOGIN" && !forgotPassword && (
              <div className="forgot-password-row">
                <button
                  type="button"
                  className="forgot-password-link"
                  disabled={loading}
                  onClick={openForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {!forgotPassword &&
              activeTab === "LOGIN" && (
                <div className="login-extra">
                  <span>🔐 Secure authentication</span>
                </div>
              )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="loading-spinner"
                    aria-hidden="true"
                  />
                  Please wait...
                </>
              ) : forgotPassword ? (
                <>
                  Send Reset Instructions{" "}
                  <span aria-hidden="true">→</span>
                </>
              ) : activeTab === "LOGIN" ? (
                <>
                  Sign In <span aria-hidden="true">→</span>
                </>
              ) : (
                <>
                  Create Account{" "}
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          {forgotPassword ? (
            <button
              type="button"
              className="switch-link back-to-login"
              disabled={loading}
              onClick={backToLogin}
            >
              ← Back to Sign In
            </button>
          ) : (
            <>
              <div className="login-divider">
                <span />
                <span>RESERVEDINE</span>
                <span />
              </div>

              <p className="login-footer-text">
                {activeTab === "LOGIN"
                  ? "New to ReserveDine? "
                  : "Already have an account? "}

                <button
                  type="button"
                  className="switch-link"
                  disabled={loading}
                  onClick={() =>
                    switchTab(
                      activeTab === "LOGIN" ? "REGISTER" : "LOGIN"
                    )
                  }
                >
                  {activeTab === "LOGIN"
                    ? "Create an account"
                    : "Sign in"}
                </button>
              </p>
            </>
          )}

          <p className="login-security-note">
            Your account access is protected by server-side authentication.
          </p>
        </section>
      </main>
    </div>
  );
}
