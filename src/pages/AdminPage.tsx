import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { logout } from "../utils/auth";
import Spinner from "../components/Spinner";

export default function AdminPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(false);

  // ✅ filter
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  // ✅ message box
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleLogout = () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;
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

      setData(res.data.data);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err?.message || "Failed to load";

      setMsg({
        type: "error",
        text: `STATUS: ${status || "NO STATUS"} | ${message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin cancel
  const handleAdminCancel = async (id: string) => {
    const ok = window.confirm("Cancel this reservation?");
    if (!ok) return;

    setMsg(null);

    try {
      const res = await API.patch(`/reservations/admin-cancel/${id}`);
      setMsg({
        type: "success",
        text: res.data.message || "Reservation cancelled ✅",
      });

      fetchAllReservations(page);
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err?.message || "Cancel failed";

      setMsg({
        type: "error",
        text: `STATUS: ${status || "NO STATUS"} | ${message}`,
      });
    }
  };

  // ✅ Admin restore
  const handleAdminRestore = async (id: string) => {
    const ok = window.confirm("Restore this reservation to ACTIVE?");
    if (!ok) return;

    setMsg(null);

    try {
      const res = await API.patch(`/reservations/admin-restore/${id}`);
      setMsg({
        type: "success",
        text: res.data.message || "Reservation restored ✅",
      });

      fetchAllReservations(page);
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err?.message || "Restore failed";

      setMsg({
        type: "error",
        text: `STATUS: ${status || "NO STATUS"} | ${message}`,
      });
    }
  };

  useEffect(() => {
    fetchAllReservations(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  return (
    <div className="container">
      <Navbar />

      {/* ✅ Header */}
      <div
        className="card"
        style={{
          padding: "18px",
          marginBottom: "15px",
          background: "linear-gradient(135deg,#6a11cb,#2575fc)",
          color: "white",
        }}
      >
        <h2 style={{ margin: 0 }}>Admin Dashboard ✅</h2>
        <p style={{ marginTop: "5px", opacity: 0.9 }}>
          View all reservations, cancel or restore.
        </p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "10px",
            background: "white",
            color: "#2575fc",
            border: "none",
            padding: "8px 12px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* ✅ Message Box */}
      {msg && (
        <div
          className="card"
          style={{
            padding: "12px",
            marginBottom: "15px",
            background: msg.type === "success" ? "#d4edda" : "#f8d7da",
            border:
              msg.type === "success"
                ? "1px solid #28a745"
                : "1px solid #dc3545",
            color: msg.type === "success" ? "#155724" : "#721c24",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* ✅ Filter + Refresh */}
      <div
        className="card"
        style={{
          padding: "15px",
          marginBottom: "18px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <b>Filter:</b>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          style={{
            padding: "10px",
            flex: 1,
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ALL">ALL</option>
        </select>

        <button
          onClick={() => fetchAllReservations(page)}
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "white",
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ✅ Reservations */}
      <div className="card" style={{ padding: "18px" }}>
        <h3 style={{ marginTop: 0 }}>📌 All Reservations</h3>

        {loading ? (
          <Spinner text="Loading reservations..." />
        ) : data.length === 0 ? (
          <Spinner text="No reservations found..." />
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {data.map((r: any) => (
              <div
                key={r._id}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  background: "#fafafa",
                }}
              >
                <p style={{ margin: "4px 0" }}>
                  👤 <b>User:</b> {r.user?.email || "Deleted User"}
                </p>
                <p style={{ margin: "4px 0" }}>
                  🧾 <b>Role:</b> {r.user?.role || "N/A"}
                </p>
                <p style={{ margin: "4px 0" }}>
                  📅 <b>Date:</b> {r.date}
                </p>
                <p style={{ margin: "4px 0" }}>
                  ⏰ <b>Time Slot:</b> {r.timeSlot}
                </p>
                <p style={{ margin: "4px 0" }}>
                  👥 <b>Guests:</b> {r.guests}
                </p>
                <p style={{ margin: "4px 0" }}>
                  🪑 <b>Table:</b> {r.table?.tableNumber || "N/A"} (Capacity:{" "}
                  {r.table?.capacity || "N/A"})
                </p>

                <p style={{ margin: "4px 0" }}>
                  ✅ <b>Status:</b>{" "}
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

                {/* ✅ Actions */}
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  {r.status === "ACTIVE" && (
                    <button
                      onClick={() => handleAdminCancel(r._id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "none",
                        background: "linear-gradient(135deg,#ff5252,#ff1744)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Cancel
                    </button>
                  )}

                  {r.status === "CANCELLED" && (
                    <button
                      onClick={() => handleAdminRestore(r._id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "none",
                        background: "linear-gradient(135deg,#00c853,#00bfa5)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Pagination */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
            }}
          >
            Previous
          </button>

          <div style={{ padding: "10px", fontWeight: "bold" }}>
            Page {page} of {pages}
          </div>

          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
