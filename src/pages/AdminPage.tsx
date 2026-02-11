import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchAllReservations = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await API.get(
        `/reservations/all?page=${pageNumber}&limit=5&status=${statusFilter}`
      );

      setData(res?.data?.data || []);
      setPages(res?.data?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReservations(page);
  }, [page, statusFilter]);

  const cancel = async (id: string) => {
    try {
      await API.patch(`/reservations/admin-cancel/${id}`);
      fetchAllReservations(page);
    } catch {
      alert("Cancel failed");
    }
  };

  const restore = async (id: string) => {
    try {
      await API.patch(`/reservations/admin-restore/${id}`);
      fetchAllReservations(page);
    } catch {
      alert("Restore failed");
    }
  };

  return (
    <div style={bg}>
      <Navbar />

      <div style={container}>
        {/* Header */}
        <div style={cardRow}>
          <div>
            <h2>🍽 Restaurant Admin</h2>
            <p style={{ color: "#666" }}>Reservation Dashboard</p>
          </div>

          <button style={primaryBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Filter */}
        <div style={card}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            style={input}
          >
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="ALL">All</option>
          </select>
        </div>

        {loading ? (
          <Spinner text="Loading..." />
        ) : data.length === 0 ? (
          <p style={{ color: "white", textAlign: "center" }}>
            No reservations found
          </p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {data.map((r: any) => (
              <div key={r._id} style={card}>
                <b>{r.user?.email || "Unknown User"}</b>
                <p>
                  {r.date} • {r.timeSlot}
                </p>
                <p>Guests: {r.guests}</p>

                <span
                  style={{
                    ...badge,
                    background:
                      r.status === "ACTIVE" ? "#c8e6c9" : "#ffcdd2",
                  }}
                >
                  {r.status}
                </span>

                {r.status === "ACTIVE" && (
                  <button style={dangerBtn} onClick={() => cancel(r._id)}>
                    Cancel
                  </button>
                )}

                {r.status === "CANCELLED" && (
                  <button style={successBtn} onClick={() => restore(r._id)}>
                    Restore
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          <span style={{ color: "white", margin: "0 15px" }}>
            {page} / {pages}
          </span>

          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------- Styles -------- */

const bg = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  background:
    "linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)), url('https://images.unsplash.com/photo-1559339352-11d035aa65de') center/cover",
};

const container = {
  width: "100%",
  maxWidth: 900,
  padding: "30px 15px",
};

const card = {
  background: "rgba(255,255,255,.95)",
  borderRadius: 18,
  padding: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,.25)",
  display: "grid",
  gap: 8,
};

const cardRow = {
  ...card,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
};

const badge = {
  padding: "5px 12px",
  borderRadius: 20,
  width: "fit-content",
  fontWeight: "bold",
};

const primaryBtn = {
  background: "linear-gradient(135deg,#ff6a00,#ff005c)",
  border: "none",
  color: "white",
  padding: "8px 20px",
  borderRadius: 25,
  cursor: "pointer",
};

const dangerBtn = {
  marginTop: 10,
  background: "#ff5252",
  border: "none",
  color: "white",
  padding: "6px 14px",
  borderRadius: 20,
  cursor: "pointer",
};

const successBtn = {
  marginTop: 10,
  background: "#00c853",
  border: "none",
  color: "white",
  padding: "6px 14px",
  borderRadius: 20,
  cursor: "pointer",
};
