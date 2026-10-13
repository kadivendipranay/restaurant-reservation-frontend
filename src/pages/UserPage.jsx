
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/UserPage.css";

const TIME_SLOTS = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
];

const getLocalDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function UserPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [guests, setGuests] = useState(1);

  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const today = getLocalDate();

  // Logout
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }

    logout();
    navigate("/login");
  };

  // Load the logged-in user's reservations
  const fetchMyReservations = useCallback(async () => {
    setLoadingList(true);

    try {
      const response = await API.get("/reservations/my", {
        params: { status: statusFilter },
      });

      setReservations(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      setReservations([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load your reservations."
      );
    } finally {
      setLoadingList(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  // Create a reservation
  const handleCreateReservation = async (event) => {
    event.preventDefault();

    if (!date || !timeSlot) {
      toast.warning("Please select a date and time slot.");
      return;
    }

    if (date < getLocalDate()) {
      toast.warning("Please select today or a future date.");
      return;
    }

    if (!TIME_SLOTS.includes(timeSlot)) {
      toast.warning("Please select a valid time slot.");
      return;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
      toast.warning("Guests must be between 1 and 20.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/reservations", {
        date,
        timeSlot,
        guests,
      });

      toast.success(
        response.data?.message ||
          "Reservation created successfully! ✅"
      );

      setDate("");
      setTimeSlot(TIME_SLOTS[0]);
      setGuests(1);

      await fetchMyReservations();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Reservation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cancel a reservation
  const handleCancelReservation = async (id) => {
    if (actionLoadingId !== null || loading) {
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setActionLoadingId(id);

    try {
      const response = await API.patch(
        `/reservations/${id}/cancel`
      );

      toast.success(
        response.data?.message || "Reservation cancelled successfully."
      );

      await fetchMyReservations();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to cancel this reservation."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="user-container">
      <Navbar />

      {/* Dashboard header */}
      <header className="user-header">
        <div>
          <h2>👋 User Dashboard</h2>
          <p>Create and manage your restaurant reservations</p>
        </div>

        <button
          type="button"
          className="user-logout-btn"
          onClick={handleLogout}
        >
          ↪ Logout
        </button>
      </header>

      {/* Create reservation form */}
      <section className="user-card">
        <div className="card-heading">
          <h3>🍽️ Create Reservation</h3>
          <p>Choose your preferred date, time, and party size.</p>
        </div>

        <form onSubmit={handleCreateReservation}>
          <div className="form-field">
            <label htmlFor="reservationDate">📅 Reservation Date</label>

            <input
              id="reservationDate"
              type="date"
              value={date}
              min={today}
              onChange={(event) => setDate(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="timeSlot">🕒 Time Slot</label>

            <select
              id="timeSlot"
              value={timeSlot}
              onChange={(event) => setTimeSlot(event.target.value)}
              required
              disabled={loading}
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="guests">👥 Number of Guests</label>

            <input
              id="guests"
              type="number"
              min="1"
              max="20"
              step="1"
              value={guests}
              onChange={(event) => {
                const value = event.target.value;
                setGuests(value === "" ? "" : Number(value));
              }}
              required
              disabled={loading}
            />

            <small>Minimum 1 guest, maximum 20 guests.</small>
          </div>

          <button
            type="submit"
            className="create-btn"
            disabled={loading || loadingList}
          >
            {loading ? "⏳ Creating reservation..." : "✅ Book a Table"}
          </button>
        </form>
      </section>

      {/* User reservation list */}
      <section className="user-card">
        <div className="reservation-heading">
          <div className="card-heading">
            <h3>📋 My Reservations</h3>
            <p>View and manage your bookings.</p>
          </div>

          <span className="reservation-count">
            {reservations.length} shown
          </span>
        </div>

        <div className="status-filter">
          <label htmlFor="reservationStatus">Filter by status:</label>

          <select
            id="reservationStatus"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="ALL">All Reservations</option>
          </select>
        </div>

        {loadingList ? (
          <Spinner text="Loading your reservations..." />
        ) : reservations.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🍽️</span>
            <h4>No reservations found</h4>
            <p>Try another status filter or create a new reservation.</p>
          </div>
        ) : (
          <div className="user-reservation-list">
            {reservations.map((reservation) => (
              <article
                key={reservation._id}
                className="user-reservation-item"
              >
                <div className="user-reservation-top">
                  <h4>🍽️ Reservation Details</h4>

                  <span
                    className={`status-badge ${reservation.status}`}
                  >
                    {reservation.status}
                  </span>
                </div>

                <div className="reservation-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">📅 Date</span>
                    <strong>{reservation.date}</strong>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">🕒 Time</span>
                    <strong>{reservation.timeSlot}</strong>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">👥 Guests</span>
                    <strong>{reservation.guests}</strong>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">🪑 Table</span>
                    <strong>
                      {reservation.table?.tableNumber ??
                        "Assigned by restaurant"}
                    </strong>
                  </div>
                </div>

                <p className="reservation-id">
                  <strong>Booking ID:</strong> {reservation._id}
                </p>

                {reservation.status === "ACTIVE" && (
                  <div className="user-reservation-actions">
                    <button
                      type="button"
                      className="user-cancel-btn"
                      disabled={
                        loading || actionLoadingId !== null
                      }
                      onClick={() =>
                        handleCancelReservation(reservation._id)
                      }
                    >
                      {actionLoadingId === reservation._id
                        ? "⏳ Cancelling..."
                        : "❌ Cancel Reservation"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
