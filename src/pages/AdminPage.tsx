import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

type Message = {
  type: "success" | "error";
  text: string;
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [msg, setMsg] = useState<Message | null>(null);

  const handleLogout = () => {
    if (!window.confirm("Logout?")) return;
    logout();
    navigate("/login");
  };

  const fetchAllReservations = async (pageNumber: number) => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await API.get(
        `/reservations/all?page=${pageNumber}&limit=5&status=${statusFilter}`
      );

      setData(res.data.data || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch (err: any) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load reservations",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCancel = async (id: string) => {
    if (!window.confirm("Cancel reservation?")) return;

    try {
      const res = await API.patch(`/reservations/admin-cancel/${id}`);
      setMsg({ type: "success", text: res.data.message || "Cancelled" });
      fetchAllReservations(page);
    } catch (err: any) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message || err?.message || "Cancel failed",
      });
    }
  };

  const handleAdminRestore = async (id: string) => {
    if (!window.confirm("Restore reservation?")) return;

    try {
      const res = await API.patch(`/reservations/admin-restore/${id}`);
      setMsg({ type: "success", text: res.data.message || "Restored" });
      fetchAllReservations(page);
    } catch (err: any) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message || err?.message || "Restore failed",
      });
    }
  };

  useEffect(() => {
    fetchAllReservations(page);
  }, [page, statusFilter]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('https://images.unsplash.com/photo-1559339352-11d035aa65de') center/cover",
      }}
    >
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "auto", padding: "40px 20px" }}>
        <div style={headerCard}>
          <div>
            <h2>🍽 Restaurant Admin</h2>
            <p style={{ color: "#777" }}>Reservation Dashboard</p>
          </div>

          <button onClick={handleLogout} style={logoutBtn}>
            Logout
          </button>
        </div>

        {msg && (
          <div
            style={{
              ...alertBox,
              background: msg.type === "success" ? "#e8f5e9" : "#fdecea",
            }}
          >
            {msg.text}
          </div>
        )}

        <div style={filterBar}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            style={selectBox}
          >
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="ALL">All</option>
          </select>

          <button onClick={() => fetchAllReservations(page)} style={refreshBtn}>
            Refresh
          </button>
        </div>

        {loading ? (
          <Spinner text="Loading reservations..." />
        ) : data.length === 0 ? (
          <Spinner text="No reservations found" />
        ) : (
          <div style={{ display: "grid", gap: 15 }}>
            {data.map((r: any) => (
              <div key={r._id} style={reservationCard}>
                <div>
                  <h4>{r.user?.email}</h4>
                  <p>
                    {r.date} • {r.timeSlot}
                  </p>
                  <p>Guests: {r.guests}</p>
                </div>

                <span
                  style={{
                    ...statusBadge,
                    background:
                      r.status === "ACTIVE"
                        ? "#c8e6c9"
                        : r.status === "CANCELLED"
                        ? "#ffcdd2"
                        : "#ffe0b2",
                  }}
                >
                  {r.status}
                </span>

                <div style={{ display: "flex", gap: 10 }}>
                  {r.status === "ACTIVE" && (
                    <button
                      onClick={() => handleAdminCancel(r._id)}
                      style={actionRed}
                    >
                      Cancel
                    </button>
                  )}

                  {r.status === "CANCELLED" && (
                    <button
                      onClick={() => handleAdminRestore(r._id)}
                      style={actionGreen}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={pagination}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </button>

          <b style={{ color: "white" }}>
            Page {page} / {pages}
          </b>

          <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const headerCard = {
  background: "rgba(255,255,255,.95)",
  borderRadius: 20,
  padding: 25,
  marginBottom: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logoutBtn = {
  padding: "8px 20px",
  borderRadius: 25,
  border: "none",
  background: "linear-gradient(135deg,#ff6a00,#ff005c)",
  color: "white",
};

const alertBox = {
  padding: 15,
  borderRadius: 12,
  marginBottom: 15,
};

const filterBar = {
  background: "rgba(255,255,255,.9)",
  padding: 15,
  borderRadius: 15,
  marginBottom: 20,
  display: "flex",
  gap: 10,
};

const selectBox = {
  flex: 1,
  padding: 10,
  borderRadius: 10,
};

const refreshBtn = {
  padding: "10px 20px",
  borderRadius: 20,
  border: "none",
  background: "#333",
  color: "white",
};

const reservationCard = {
  background: "rgba(255,255,255,.95)",
  borderRadius: 18,
  padding: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statusBadge = {
  padding: "6px 14px",
  borderRadius: 20,
  fontWeight: "bold",
};

const pagination = {
  marginTop: 25,
  display: "flex",
  justifyContent: "center",
  gap: 20,
};

const actionRed = {
  padding: "8px 14px",
  borderRadius: 20,
  border: "none",
  background: "linear-gradient(135deg,#ff5252,#ff1744)",
  color: "white",
};

const actionGreen = {
  padding: "8px 14px",
  borderRadius: 20,
  border: "none",
  background: "linear-gradient(135deg,#00c853,#00bfa5)",
  color: "white",
};
