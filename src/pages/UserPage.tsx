import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function UserPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("17:00-18:00");
  const [guests, setGuests] = useState(1);
  const [reservations, setReservations] = useState<any[]>([]);
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
    logout();
    navigate("/login");
  };

  const fetchMyReservations = async () => {
    setLoadingList(true);
    try {
      const res = await API.get(`/reservations/my?status=${statusFilter}`);
      setReservations(res.data || []);
    } catch {
      alert("Failed to load reservations");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, [statusFilter]);

  const handleCreateReservation = async () => {
    if (!date || guests < 1) return alert("Fill all fields");

    setLoading(true);
    try {
      await API.post("/reservations", { date, timeSlot, guests });
      setDate("");
      setGuests(1);
      fetchMyReservations();
    } catch {
      alert("Reservation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this reservation?")) return;

    try {
      await API.patch(`/reservations/${id}/cancel`);
      fetchMyReservations();
    } catch {
      alert("Cancel failed");
    }
  };

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
        {/* HEADER */}
        <div style={headerCard}>
          <div>
            <h2>🍽 User Dashboard</h2>
            <p style={{ color: "#777" }}>
              Book & Manage Your Reservations
            </p>
          </div>

          <button onClick={handleLogout} style={logoutBtn}>
            Logout
          </button>
        </div>

        {/* BOOK TABLE */}
        <div style={bookingCard}>
          <h3>🍽 Book Your Table</h3>

          <div style={{ display: "grid", gap: 15 }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />

            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              style={inputStyle}
            >
              {TIME_SLOTS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(+e.target.value)}
              placeholder="Guests"
              style={inputStyle}
            />

            <button
              onClick={handleCreateReservation}
              disabled={loading}
              style={primaryBtn}
            >
              {loading ? "Creating..." : "Reserve Table"}
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div style={filterBar}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="ALL">All</option>
          </select>
        </div>

        {/* RESERVATIONS */}
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: "white" }}>📌 My Reservations</h3>

          {loadingList ? (
            <Spinner text="Loading..." />
          ) : reservations.length === 0 ? (
            <Spinner text="No reservations found" />
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              {reservations.map((r: any) => (
                <div key={r._id} style={reservationCard}>
                  <div>
                    <p>📅 {r.date}</p>
                    <p>⏰ {r.timeSlot}</p>
                    <p>👥 Guests: {r.guests}</p>
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

                  {r.status === "ACTIVE" && (
                    <button
                      onClick={() => handleCancel(r._id)}
                      style={cancelBtn}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const headerCard = {
  background: "rgba(255,255,255,.95)",
  borderRadius: 20,
  padding: 25,
  marginBottom: 25,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const bookingCard = {
  background: "rgba(255,255,255,.95)",
  borderRadius: 20,
  padding: 25,
  boxShadow: "0 6px 18px rgba(0,0,0,.2)",
};

const filterBar = {
  marginTop: 20,
  background: "rgba(255,255,255,.9)",
  padding: 15,
  borderRadius: 15,
};

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 15,
};

const primaryBtn = {
  padding: 14,
  borderRadius: 30,
  background: "linear-gradient(135deg,#ff6a00,#ff005c)",
  color: "white",
  border: "none",
  fontSize: 16,
  fontWeight: "bold",
};

const reservationCard = {
  background: "rgba(255,255,255,.95)",
  borderRadius: 18,
  padding: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,.2)",
};

const statusBadge = {
  padding: "6px 14px",
  borderRadius: 20,
  fontWeight: "bold",
};

const cancelBtn = {
  padding: "6px 14px",
  borderRadius: 20,
  background: "#ff5252",
  color: "white",
  border: "none",
};

const logoutBtn = {
  padding: "8px 20px",
  borderRadius: 25,
  border: "none",
  background: "linear-gradient(135deg,#ff6a00,#ff005c)",
  color: "white",
};
