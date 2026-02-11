import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function UserPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("17:00-18:00");
  const [guests, setGuests] = useState(1);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const TIME = ["17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00"];

  const fetchReservations = async () => {
    const res = await API.get("/reservations/my");
    setReservations(res.data || []);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const createReservation = async () => {
    if (!date) return alert("Select date");

    setLoading(true);
    await API.post("/reservations", { date, timeSlot, guests });
    setLoading(false);
    fetchReservations();
  };

  const cancelReservation = async (id: string) => {
    await API.patch(`/reservations/${id}/cancel`);
    fetchReservations();
  };

  return (
    <div style={bg}>
      <Navbar />

      <div style={container}>
        {/* HEADER */}
        <div style={cardRow}>
          <div>
            <h2>🍽 User Dashboard</h2>
            <p style={{ color: "#666" }}>Book & Manage Reservations</p>
          </div>

          <button
            style={primaryBtn}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* BOOK TABLE */}
        <div style={card}>
          <h3>🍽 Book Your Table</h3>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={input}
          />

          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            style={input}
          >
            {TIME.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(+e.target.value)}
            style={input}
            placeholder="Guests"
          />

          <button style={primaryBtn} onClick={createReservation}>
            {loading ? "Saving..." : "Reserve Table"}
          </button>
        </div>

        {/* RESERVATIONS */}
        <div style={{ marginTop: 25, display: "grid", gap: 16 }}>
          {reservations.length === 0 && (
            <p style={{ color: "white", textAlign: "center" }}>
              No reservations found
            </p>
          )}

          {reservations.map((r: any) => (
            <div key={r._id} style={card}>
              <p>{r.date} • {r.timeSlot}</p>
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
                <button
                  style={dangerBtn}
                  onClick={() => cancelReservation(r._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

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
  gap: 10,
};

const cardRow = {
  ...card,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
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
  padding: "10px 22px",
  borderRadius: 25,
  fontWeight: "bold",
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
