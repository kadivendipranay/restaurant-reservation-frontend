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
    if (!window.confirm("Are you sure you want to logout?")) return;
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
    if (!window.confirm("Cancel this reservation?")) return;

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
    if (!window.confirm("Restore this reservation?")) return;

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

      <div className="card" style={{ padding: 18 }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {msg && <div className="card">{msg.text}</div>}

      <div className="card" style={{ padding: 15 }}>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ALL">ALL</option>
        </select>

        <button onClick={() => fetchAllReservations(page)}>
          Refresh
        </button>
      </div>

      <div className="card" style={{ padding: 18 }}>
        {loading ? (
          <Spinner text="Loading..." />
        ) : data.length === 0 ? (
          <Spinner text="No reservations found" />
        ) : (
          data.map((r: any) => (
            <div key={r._id}>
              <p>User: {r.user?.email}</p>
              <p>Status: {r.status}</p>

              {r.status === "ACTIVE" && (
                <button onClick={() => handleAdminCancel(r._id)}>
                  Cancel
                </button>
              )}

              {r.status === "CANCELLED" && (
                <button onClick={() => handleAdminRestore(r._id)}>
                  Restore
                </button>
              )}
            </div>
          ))
        )}

        <div>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </button>

          <span>
            Page {page} / {pages}
          </span>

          <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
