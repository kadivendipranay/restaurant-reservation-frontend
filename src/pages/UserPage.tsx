import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/UserPage.css";

export default function UserPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("17:00-18:00");
  const [guests, setGuests] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  const TIME_SLOTS = [
    "17:00-18:00",
    "18:00-19:00",
    "19:00-20:00",
    "20:00-21:00",
  ];

  const handleLogout = () => {
    if (!window.confirm("Logout?")) return;
    logout();
    navigate("/login");
  };

  const fetchMyReservations = async () => {
    setLoadingList(true);

    try {
      const res = await API.get(`/reservations/my?status=${statusFilter}`);
      setReservations(res.data || []);
    } catch (err) {
      toast.error("Failed to load reservations");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, [statusFilter]);

  const handleCreateReservation = async () => {
    if (!date || !timeSlot || guests < 1) {
      toast.warning("Please fill all fields correctly");
      return;
    }

    setLoading(true);

    try {
      await API.post("/reservations", { date, timeSlot, guests });

      toast.success("Reservation created successfully ✅");

      setDate("");
      setGuests(1);
      setTimeSlot("17:00-18:00");

      fetchMyReservations();
    } catch (err) {
      toast.error("Reservation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm("Cancel reservation?")) return;

    try {
      await API.patch(`/reservations/${id}/cancel`);
      toast.success("Cancelled successfully");
      fetchMyReservations();
    } catch {
      toast.error("Cancel failed");
    }
  };

  return (
    <div className="user-container">
      <Navbar />

      {/* HEADER */}
      <div className="user-header">
        <div>
          <h2>User Dashboard</h2>
          <p>Create and manage your reservations</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* CREATE FORM */}
      <div className="card">
        <h3>Create Reservation</h3>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Time Slot</label>
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <label>Guests</label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />

        <button
          onClick={handleCreateReservation}
          disabled={loading}
          className="create-btn"
        >
          {loading ? "Creating..." : "Create Reservation"}
        </button>
      </div>

      {/* LIST */}
      <div className="card">
        <h3>My Reservations</h3>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ALL">ALL</option>
        </select>

        {loadingList ? (
          <Spinner text="Loading..." />
        ) : reservations.length === 0 ? (
          <p>No reservations found</p>
        ) : (
          reservations.map((r) => (
            <div key={r._id} className="reservation-item">
              <p>
                📅 {r.date} | ⏰ {r.timeSlot} | 👥 {r.guests}
              </p>

              <p>
                Status: <span className={`status ${r.status}`}>{r.status}</span>
              </p>

              {r.status === "ACTIVE" && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancelReservation(r._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}