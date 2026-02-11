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
          "linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)), url('https://images.unsplash.com/photo-1559339352-11d035aa65de') center/cover",
      }}
    >
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "auto", padding: "40px 20px" }}>
        {/* HEADER */}
        <div
          style={{
            background: "rgba(255,255,255,.95)",
            borderRadius: 20,
            padding: 25,
            marginBottom: 20,
            boxShadow: "0 10px 25px rgba(0,0,0,.3)",
          }}
        >
          <h2>👑 Admin Dashboard</h2>
          <p style={{ color: "#666" }}>Manage all restaurant reservations</p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              borderRadius: 30,
              border: "none",
              background: "linear-gradient(135deg,#ff6a00,#ff005c)",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        {/* MESSAGE */}
        {msg && (
          <div
            style={{
              padding: 15,
              borderRadius: 15,
              marginBottom: 15,
              background: msg.type === "success" ? "#d4edda" : "#f8d7da",
            }}
          >
            {msg.text}
          </div>
        )}

        {/* FILTER */}
        <div
          style={{
            background: "rgba(255,255,255,.9)",
            padding: 15,
            borderRadius: 15,
            marginBottom: 20,
            display: "flex",
            gap: 10,
          }}
        >
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            style={{ flex: 1, padding: 10, borderRadius: 10 }}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ALL">ALL</option>
          </select>

          <button onClick={() => fetchAllReservations(page)}>Refresh</button>
        </div>

        {/* LIST */}
        {loading ? (
          <Spinner text="Loading reservations..." />
        ) : data.length === 0 ? (
          <Spinner text="No reservations found" />
        ) : (
          <div style={{ display: "grid", gap: 15 }}>
            {data.map((r: any) => (
              <div
                key={r._id}
                style={{
                  background: "rgba(255,255,255,.95)",
                  borderRadius: 18,
                  padding: 20,
                  boxShadow: "0 6px 15px rgba(0,0,0,.2)",
                }}
              >
                <b>{r.user?.email}</b>
                <p>{r.date} | {r.timeSlot}</p>
                <p>Guests: {r.guests}</p>

                <p>
                  Status:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        r.status === "ACTIVE"
                          ? "#00c853"
                          : r.status === "CANCELLED"
                          ? "#e53935"
                          : "#ff9800",
                    }}
                  >
                    {r.status}
                  </span>
                </p>

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

        {/* PAGINATION */}
        <div style={{ marginTop: 20, display: "flex", gap: 15 }}>
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

const actionRed = {
  padding: "8px 14px",
  borderRadius: 20,
  border: "none",
  background: "linear-gradient(135deg,#ff5252,#ff1744)",
  color: "white",
  cursor: "pointer",
};

const actionGreen = {
  padding: "8px 14px",
  borderRadius: 20,
  border: "none",
  background: "linear-gradient(135deg,#00c853,#00bfa5)",
  color: "white",
  cursor: "pointer",
};
