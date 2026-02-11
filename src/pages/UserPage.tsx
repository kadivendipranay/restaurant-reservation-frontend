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

  useEffect(() => { fetchReservations(); }, []);

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
    <div style={page}>
      <Navbar />

      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <div>
            <h2 style={{ margin: 0 }}>User Dashboard</h2>
            <p style={{ margin: 0, color: "#aaa" }}>
              Book & Manage Reservations
            </p>
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
          <h3>Book Your Table</h3>

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
          />

          <button style={primaryBtn} onClick={createReservation}>
            {loading ? "Saving..." : "Reserve Table"}
          </button>
        </div>

        {/* RESERVATIONS */}
        <div style={{ display: "grid", gap: 16 }}>
          {reservations.map((r: any) => (
            <div key={r._id} style={card}>
              <p>📅 {r.date}</p>
              <p>⏰ {r.timeSlot}</p>
              <p>👥 Guests: {r.guests}</p>

              <span
                style={{
                  ...badge,
                  background:
                    r.status === "ACTIVE" ? "#2e7d32" : "#c62828",
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

/* STYLES */

const page = {
  minHeight: "100vh",
  background: "#1c1c1c",
  color: "white",
};

const container = {
  maxWidth: 900,
  margin: "auto",
  padding: 30,
};

const header = {
  background: "#2a2a2a",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const card = {
  background: "#2a2a2a",
  padding: 20,
  borderRadius: 12,
  display: "grid",
  gap: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,.4)",
};

const input = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #444",
  background: "#1c1c1c",
  color: "white",
};

const badge = {
  padding: "4px 10px",
  borderRadius: 15,
  width: "fit-content",
  fontSize: 12,
};

const primaryBtn = {
  background: "#d4af37",
  border: "none",
  padding: "8px 18px",
  borderRadius: 20,
  fontWeight: "bold",
  cursor: "pointer",
};

const dangerBtn = {
  background: "#c62828",
  border: "none",
  padding: "6px 14px",
  borderRadius: 20,
  color: "white",
  cursor: "pointer",
};
