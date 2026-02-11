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
    <div className="container">
      <Navbar />

      {/* Header */}
      <div
        className="card"
        style={{
          padding: 18,
          marginBottom: 15,
          background: "linear-gradient(135deg,#6a11cb,#2575fc)",
          color: "white",
        }}
      >
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <p>Manage all reservations</p>

        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "#2575fc",
            border: "none",
            padding: "8px 12px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div
          className="card"
          style={{
            padding: 12,
            marginBottom: 15,
            background: msg.type === "success" ? "#d4edda" : "#f8d7da",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Filter */}
      <div
        className="card"
        style={{
          padding: 15,
          marginBottom: 15,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <b>Status:</b>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          style={{ padding: 8, flex: 1 }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ALL">ALL</option>
        </select>

        <button onClick={() => fetchAllReservations(page)}>Refresh</button>
      </div>

      {/* Reservations */}
      <div className="card" style={{ padding: 18 }}>
        {loading ? (
          <Spinner text="Loading..." />
        ) : data.length === 0 ? (
          <Spinner text="No reservations found" />
        ) : (
          data.map((r: any) => (
            <div
              key={r._id}
              style={{
                padding: 14,
                border: "1px solid #ddd",
                borderRadius: 12,
                marginBottom: 12,
                background: "#fafafa",
              }}
            >
              <p>👤 {r.user?.email}</p>
              <p>📅 {r.date}</p>
              <p>⏰ {r.timeSlot}</p>
              <p>👥 Guests: {r.guests}</p>

              <p>
                Status:{" "}
                <b
                  style={{
                    color:
                      r.status === "ACTIVE"
                        ? "#00c853"
                        : r.status === "CANCELLED"
                        ? "#e53935"
                        : "#ff9800",
                  }}
                >
                  {r.status}
                </b>
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                {r.status === "ACTIVE" && (
                  <button
                    onClick={() => handleAdminCancel(r._id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: "#ff5252",
                      color: "white",
                    }}
                  >
                    Cancel
                  </button>
                )}

                {r.status === "CANCELLED" && (
                  <button
                    onClick={() => handleAdminRestore(r._id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: "#00c853",
                      color: "white",
                    }}
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          <b>
            Page {page} / {pages}
          </b>

          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
