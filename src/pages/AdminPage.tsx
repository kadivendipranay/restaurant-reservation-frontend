import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import "../styles/AdminPage.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  // 🔥 NEW STATES
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const handleLogout = () => {
    if (!window.confirm("Logout?")) return;
    logout();
    navigate("/login");
  };

  const fetchAllReservations = async (pageNumber) => {
    setLoading(true);

    try {
      const res = await API.get(
        `/reservations/all?page=${pageNumber}&limit=5&status=${statusFilter}&email=${searchEmail}&date=${searchDate}`
      );

      setData(res.data.data || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load reservations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCancel = async (id) => {
    if (!window.confirm("Cancel reservation?")) return;

    try {
      const res = await API.patch(`/reservations/admin-cancel/${id}`);
      toast.success(res.data.message || "Cancelled");
      fetchAllReservations(page);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cancel failed");
    }
  };

  const handleAdminRestore = async (id) => {
    if (!window.confirm("Restore reservation?")) return;

    try {
      const res = await API.patch(`/reservations/admin-restore/${id}`);
      toast.success(res.data.message || "Restored");
      fetchAllReservations(page);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Restore failed");
    }
  };

  useEffect(() => {
    fetchAllReservations(page);
  }, [page, statusFilter]);

  return (
    <div className="admin-container">
      <Navbar />

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Manage all reservations</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* 🔥 FILTER + SEARCH */}
      <div className="filter-card">
        <b>Status:</b>

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

        <input
          placeholder="Search email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />

        <button onClick={() => fetchAllReservations(1)}>Search</button>

        <button
          onClick={() => {
            setSearchEmail("");
            setSearchDate("");
            fetchAllReservations(1);
          }}
        >
          Reset
        </button>
      </div>

      {/* LIST */}
      <div className="reservation-card">
        {loading ? (
          <Spinner text="Loading..." />
        ) : data.length === 0 ? (
          <p>No reservations found</p>
        ) : (
          data.map((r) => (
            <div key={r._id} className="reservation-item">
              <p>👤 {r.user?.email}</p>
              <p>📅 {r.date}</p>
              <p>⏰ {r.timeSlot}</p>
              <p>👥 Guests: {r.guests}</p>

              <p>
                Status:{" "}
                <span className={`status ${r.status}`}>
                  {r.status}
                </span>
              </p>

              <div className="actions">
                {r.status === "ACTIVE" && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleAdminCancel(r._id)}
                  >
                    Cancel
                  </button>
                )}

                {r.status === "CANCELLED" && (
                  <button
                    className="restore-btn"
                    onClick={() => handleAdminRestore(r._id)}
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* PAGINATION */}
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </button>

          <b>Page {page} / {pages}</b>

          <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}