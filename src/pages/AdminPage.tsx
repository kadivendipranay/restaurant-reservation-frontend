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
  const { logout } = useAuth();

  const [data, setData] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);

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

  const handleCancel = async (id: string) => {
    await API.patch(`/reservations/admin-cancel/${id}`);
    fetchReservations();
  };

  const handleRestore = async (id: string) => {
    await API.patch(`/reservations/admin-restore/${id}`);
    fetchReservations();
  };

  return (
    <div style={page}>
      <Navbar />

      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <div>
            <h2 style={{ margin: 0 }}>👑 Admin Dashboard</h2>
            <p style={{ margin: 0, color: "#777" }}>
              Restaurant Reservation Control Panel
            </p>
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

        {/* FILTER */}
        <div style={filterCard}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={input}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ALL">ALL</option>
          </select>

          <button style={primaryBtn} onClick={fetchReservations}>
            Refresh
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <Spinner text="Loading reservations..." />
        ) : (
          <div style={{ display: "grid", gap: 20 }}>
            {data.length === 0 && (
              <p style={{ textAlign: "center", color: "#777" }}>
                No reservations found
              </p>
            )}

            {data.map((r) => (
              <div key={r._id} style={card}>
                <b>👤 {r.user?.email || "Unknown user"}</b>

                <p>📅 {r.date}</p>
                <p>⏰ {r.timeSlot}</p>
                <p>👥 Guests: {r.guests}</p>

                <span
                  style={{
                    ...badge,
                    background:
                      r.status === "ACTIVE"
                        ? "#2e7d32"
                        : r.status === "CANCELLED"
                        ? "#c62828"
                        : "#ff9800",
                  }}
                >
                  {r.status}
                </span>

                <div style={{ display: "flex", gap: 10 }}>
                  {r.status === "ACTIVE" && (
                    <button
                      style={dangerSmall}
                      onClick={() => handleCancel(r._id)}
                    >
                      Cancel
                    </button>
                  )}

                  {r.status === "CANCELLED" && (
                    <button
                      style={successSmall}
                      onClick={() => handleRestore(r._id)}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const page = {
  minHeight: "100vh",
  background: "#f8f5f0",
};

const container = {
  maxWidth: 950,
  margin: "auto",
  padding: 30,
};

const header = {
  background: "white",
  padding: 22,
  borderRadius: 16,
  marginBottom: 25,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,.1)",
};

const filterCard = {
  background: "white",
  padding: 18,
  borderRadius: 14,
  marginBottom: 25,
  display: "flex",
  gap: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
};

const card = {
  background: "white",
  padding: 22,
  borderRadius: 16,
  display: "grid",
  gap: 8,
  boxShadow: "0 6px 15px rgba(0,0,0,.08)",
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  flex: 1,
};

const badge = {
  padding: "4px 12px",
  borderRadius: 14,
  width: "fit-content",
  color: "white",
  fontSize: 13,
};

const primaryBtn = {
  background: "#2e7d32",
  border: "none",
  padding: "10px 20px",
  borderRadius: 20,
  color: "white",
  cursor: "pointer",
};

const dangerBtn = {
  background: "#c62828",
  border: "none",
  padding: "10px 22px",
  borderRadius: 20,
  color: "white",
  cursor: "pointer",
};

const dangerSmall = {
  background: "#c62828",
  border: "none",
  padding: "6px 14px",
  borderRadius: 18,
  color: "white",
};

const successSmall = {
  background: "#2e7d32",
  border: "none",
  padding: "6px 14px",
  borderRadius: 18,
  color: "white",
};
