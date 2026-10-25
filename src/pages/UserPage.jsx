import { useCallback, useEffect, useMemo, useState } from "react";
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

const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMaxReservationDate = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return getLocalDate(maxDate);
};

const formatDate = (value) => {
  if (!value) return "Date not available";
  const dateString = String(value).slice(0, 10);
  const dateValue = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(dateValue.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dateValue);
};

const formatClockTime = (value) => {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatTime = (slot) => {
  if (!slot || typeof slot !== "string") return "Time not available";
  const [start, end] = slot.split("-");
  if (!start || !end) return slot;
  return `${formatClockTime(start)} – ${formatClockTime(end)}`;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function UserPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [guests, setGuests] = useState("1");
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const today = useMemo(() => getLocalDate(), []);
  const maxDate = useMemo(() => getMaxReservationDate(), []);

  const counts = useMemo(() => ({
    active: reservations.filter((item) => item.status === "ACTIVE").length,
    completed: reservations.filter((item) => item.status === "COMPLETED").length,
    cancelled: reservations.filter((item) => item.status === "CANCELLED").length,
  }), [reservations]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to sign out?")) return;
    logout();
    navigate("/login", { replace: true });
  };

  const fetchMyReservations = useCallback(async () => {
    setLoadingList(true);
    try {
      const response = await API.get("/reservations/my", {
        params: statusFilter === "ALL" ? {} : { status: statusFilter },
      });
      const data = response?.data;
      setReservations(Array.isArray(data) ? data : Array.isArray(data?.reservations) ? data.reservations : []);
    } catch (error) {
      setReservations([]);
      toast.error(getErrorMessage(error, "Failed to load your reservations."));
    } finally {
      setLoadingList(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  const handleCreateReservation = async (event) => {
    event.preventDefault();

    if (!date || !timeSlot) {
      toast.warning("Please select a date and time slot.");
      return;
    }
    if (date < today || date > maxDate) {
      toast.warning("Choose a date from today through the next 12 months.");
      return;
    }
    if (!TIME_SLOTS.includes(timeSlot)) {
      toast.warning("Please select a valid time slot.");
      return;
    }

    const guestCount = Number(guests);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20) {
      toast.warning("Guests must be a whole number between 1 and 20.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/reservations", {
        date,
        timeSlot,
        guests: guestCount,
      });
      toast.success(response?.data?.message || "Reservation created successfully!");
      setDate("");
      setTimeSlot(TIME_SLOTS[0]);
      setGuests("1");
      await fetchMyReservations();
    } catch (error) {
      toast.error(getErrorMessage(error, "Reservation failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (actionLoadingId !== null || loading || !id) return;
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    setActionLoadingId(id);
    try {
      const response = await API.patch(`/reservations/${id}/cancel`);
      toast.success(response?.data?.message || "Reservation cancelled successfully.");
      await fetchMyReservations();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to cancel this reservation."));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="user-page">
      <Navbar />

      <main className="user-dashboard">
        <section className="dashboard-welcome">
          <div className="welcome-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> YOUR DINING SPACE</span>
            <h1>Your next great meal <span>starts here.</span></h1>
            <p>Book your table, keep track of your plans, and make every meal special.</p>
            <div className="welcome-highlights">
              <span><span className="highlight-check">✓</span> Easy reservations</span>
              <span><span className="highlight-check">✓</span> Simple booking management</span>
            </div>
          </div>

          <button type="button" className="logout-button" onClick={handleLogout}>
            <span aria-hidden="true">↗</span> Sign out
          </button>

          <div className="welcome-art" aria-hidden="true">
            <div className="art-circle art-circle-one" />
            <div className="art-circle art-circle-two" />
            <div className="art-plate"><span>✦</span><div className="plate-ring" /></div>
            <span className="art-spark spark-one">✧</span>
            <span className="art-spark spark-two">✦</span>
          </div>
        </section>

        <section className="stats-grid" aria-label="Reservation overview">
          <article className="stat-card stat-card-amber">
            <div className="stat-icon stat-icon-amber" aria-hidden="true">⌂</div>
            <div className="stat-content">
              <span className="stat-label">Active bookings</span>
              <strong>{counts.active}</strong>
              <small>Ready for your next visit</small>
            </div>
          </article>
          <article className="stat-card stat-card-green">
            <div className="stat-icon stat-icon-green" aria-hidden="true">✓</div>
            <div className="stat-content">
              <span className="stat-label">Completed</span>
              <strong>{counts.completed}</strong>
              <small>Memories made</small>
            </div>
          </article>
          <article className="stat-card stat-card-rose">
            <div className="stat-icon stat-icon-rose" aria-hidden="true">↺</div>
            <div className="stat-content">
              <span className="stat-label">Cancelled</span>
              <strong>{counts.cancelled}</strong>
              <small>Past booking changes</small>
            </div>
          </article>
        </section>

        <div className="dashboard-columns">
          <section className="dashboard-panel booking-panel">
            <div className="panel-heading">
              <div className="panel-icon">✦</div>
              <div>
                <span className="panel-kicker">PLAN A VISIT</span>
                <h2>Reserve your table</h2>
                <p>A few details and you're all set.</p>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleCreateReservation}>
              <div className="field-group">
                <label htmlFor="reservationDate">Reservation date</label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">▦</span>
                  <input id="reservationDate" type="date" value={date} min={today} max={maxDate}
                    onChange={(event) => setDate(event.target.value)} required disabled={loading} />
                </div>
                <small className="field-help">Book from today up to one year ahead.</small>
              </div>

              <div className="field-group">
                <label htmlFor="timeSlot">Preferred time</label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">◷</span>
                  <select id="timeSlot" value={timeSlot}
                    onChange={(event) => setTimeSlot(event.target.value)} required disabled={loading}>
                    {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{formatTime(slot)}</option>)}
                  </select>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="guests">Number of guests</label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">♧</span>
                  <input id="guests" type="number" min="1" max="20" step="1" value={guests}
                    onChange={(event) => setGuests(event.target.value)} required disabled={loading} />
                  <span className="input-suffix">people</span>
                </div>
                <small className="field-help">For groups of 1–20 guests.</small>
              </div>

              <button type="submit" className="book-submit" disabled={loading || loadingList}>
                {loading ? <><span className="button-spinner" /> Booking your table…</> : <>Confirm reservation <span aria-hidden="true">→</span></>}
              </button>
              <p className="booking-note"><span aria-hidden="true">♧</span> Your table will be assigned based on your group size.</p>
            </form>
          </section>

          <section className="dashboard-panel reservations-panel">
            <div className="reservations-title-row">
              <div>
                <span className="panel-kicker">YOUR ACTIVITY</span>
                <h2>My reservations</h2>
                <p>All your dining plans, in one place.</p>
              </div>
              <div className="reservation-total"><strong>{reservations.length}</strong><span>shown</span></div>
            </div>

            <div className="reservation-toolbar">
              <label htmlFor="reservationStatus">Show</label>
              <select id="reservationStatus" value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="ACTIVE">Active bookings</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
                <option value="ALL">All reservations</option>
              </select>
              <button type="button" className="refresh-button" onClick={fetchMyReservations}
                disabled={loadingList} aria-label="Refresh reservations" title="Refresh reservations">
                {loadingList ? <span className="button-spinner button-spinner-dark" /> : "↻"}
              </button>
            </div>

            {loadingList ? (
              <div className="reservation-loading"><Spinner text="Loading your reservations..." /></div>
            ) : reservations.length === 0 ? (
              <div className="empty-reservations">
                <div className="empty-illustration" aria-hidden="true">♧</div>
                <h3>No bookings here yet</h3>
                <p>Your reservations will appear here once you book a table.</p>
              </div>
            ) : (
              <div className="reservation-list">
                {reservations.map((reservation) => (
                  <article key={reservation._id} className="reservation-card">
                    <div className="reservation-card-top">
                      <div className="reservation-restaurant-mark" aria-hidden="true">♧</div>
                      <div className="reservation-card-name">
                        <h3>Restaurant reservation</h3>
                        <span>Booking ID · {String(reservation._id || "").slice(-8).toUpperCase()}</span>
                      </div>
                      <span className={`status-pill status-${String(reservation.status || "unknown").toLowerCase()}`}>
                        {reservation.status || "UNKNOWN"}
                      </span>
                    </div>

                    <div className="reservation-info-grid">
                      <div className="reservation-info"><span>Date</span><strong>{formatDate(reservation.date)}</strong></div>
                      <div className="reservation-info"><span>Time</span><strong>{formatTime(reservation.timeSlot)}</strong></div>
                      <div className="reservation-info"><span>Guests</span><strong>{reservation.guests} {Number(reservation.guests) === 1 ? "guest" : "guests"}</strong></div>
                      <div className="reservation-info"><span>Table</span><strong>{reservation.table?.tableNumber ?? "Assigned by restaurant"}</strong></div>
                    </div>

                    {reservation.status === "ACTIVE" && (
                      <div className="reservation-card-actions">
                        <button type="button" className="cancel-reservation-button"
                          disabled={loading || actionLoadingId !== null}
                          onClick={() => handleCancelReservation(reservation._id)}>
                          {actionLoadingId === reservation._id ? <><span className="button-spinner" /> Cancelling…</> : "Cancel booking"}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="dashboard-footer">
          <span>Made for memorable meals.</span>
          <span>ReserveDine · Restaurant Reservation System</span>
        </footer>
      </main>
    </div>
  );
}
