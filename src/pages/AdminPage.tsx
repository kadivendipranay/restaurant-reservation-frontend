import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

type Reservation = {
  _id: string;
  date: string;
  timeSlot: string;
  guests: number;
  status: string;
  user?: { email?: string };
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { logout, role } = useAuth();

  const [data, setData] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role !== "ADMIN") navigate("/login");
  }, [role, navigate]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/reservations/all?status=${statusFilter}`);
      setData(res?.data?.data || []);
    } catch {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  return (
    <div style={page}>
      <Navbar />

      <div style={container}>
        <div style={header}>
          <div>
            <h2>👑 Admin Dashboard</h2>
            <p style={{ color: "#666" }}>Manage restaurant reservations</p>
          </div>

          <button
            style={dangerBtn}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        <div style={card}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={input}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ALL">ALL</option>
          </select>
        </div>

        {loading ? (
          <Spinner text="Loading..." />
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            {data.length === 0 && <p style={{ textAlign: "center" }}>No reservations</p>}

            {data.map((r) => (
              <div key={r._id} style={card}>
                <b>{r.user?.email || "Unknown user"}</b>
                <p>📅 {r.date}</p>
                <p>⏰ {r.timeSlot}</p>
                <p>👥 Guests: {r.guests}</p>

                <span
                  style={{
                    ...badge,
                    background: r.status === "ACTIVE" ? "#2e7d32" : "#c62828",
                  }}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLES */

const page = { minHeight: "100vh", background: "#f8f5f0" };

const container = { maxWidth: 900, margin: "auto", padding: 30 };

const header = {
  background: "white",
  padding: 20,
  borderRadius: 15,
  marginBottom: 25,
  display: "flex",
  justifyContent: "space-between",
  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 15,
  display: "grid",
  gap: 10,
  boxShadow: "0 6px 15px rgba(0,0,0,.08)",
};

const input = { padding: 12, borderRadius: 8 };

const badge = {
  padding: "4px 10px",
  borderRadius: 15,
  color: "white",
  width: "fit-content",
};

const dangerBtn = {
  background: "#c62828",
  border: "none",
  padding: "8px 18px",
  borderRadius: 20,
  color: "white",
  cursor: "pointer",
};
