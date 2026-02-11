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

  const TIME_SLOTS = ["17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"];

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
    <div className="container">
      <Navbar />

      {/* HEADER */}
      <div
        className="card"
        style={{
          padding: 22,
          background: "linear-gradient(135deg,#ff6a00,#ff005c)",
          color: "white",
          borderRadius: 20
        }}
      >
        <h2>🍽 User Dashboard</h2>
        <p>Book & manage your reservations</p>

        <button
          onClick={handleLogout}
          style={{
            background: "white",
            borderRadius: 20,
            padding: "6px 14px",
            border: "none",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>

      {/* BOOK TABLE */}
      <div
        className="card"
        style={{
          padding: 25,
          marginTop: 20,
          background: "white",
          borderRadius: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,.1)"
        }}
      >
        <h3>🍽 Book Your Table</h3>

        <div style={{ display: "grid", gap: 14 }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
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
          />

          <button
            onClick={handleCreateReservation}
            disabled={loading}
            style={{
              padding: 14,
              borderRadius: 30,
              background: "linear-gradient(135deg,#ff6a00,#ff005c)",
              color: "white",
              border: "none",
              fontSize: 16,
              fontWeight: "bold"
            }}
          >
            {loading ? "Creating..." : "Reserve Table"}
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="card" style={{ padding: 15 }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ALL">ALL</option>
        </select>
      </div>

      {/* RESERVATIONS */}
      <div className="card">
        <h3>📌 My Reservations</h3>

        {loadingList ? (
          <Spinner text="Loading..." />
        ) : reservations.length === 0 ? (
          <Spinner text="No reservations" />
        ) : (
          reservations.map((r: any) => (
            <div
              key={r._id}
              style={{
                padding: 20,
                marginBottom: 15,
                borderRadius: 18,
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,.08)"
              }}
            >
              <p>📅 {r.date}</p>
              <p>⏰ {r.timeSlot}</p>
              <p>👥 Guests: {r.guests}</p>

              <b style={{ color: r.status === "ACTIVE" ? "green" : "red" }}>
                {r.status}
              </b>

              {r.status === "ACTIVE" && (
                <button
                  onClick={() => handleCancel(r._id)}
                  style={{
                    marginTop: 10,
                    background: "#ff5252",
                    color: "white",
                    border: "none",
                    borderRadius: 20,
                    padding: "6px 12px"
                  }}
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
