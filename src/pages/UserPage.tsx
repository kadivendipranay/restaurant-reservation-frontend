import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

type Reservation = {
  _id: string;
  date: string;
  timeSlot: string;
  guests: number;
  status: string;
};

export default function UserPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("17:00-18:00");
  const [guests, setGuests] = useState(1);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const TIMES = ["17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"];

  const fetchReservations = async () => {
    setLoadingList(true);
    try {
      const res = await API.get("/reservations/my");
      setReservations(res.data || []);
    } catch {
      setReservations([]);
    }
    setLoadingList(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const createReservation = async () => {
    if (!date) return alert("Select date");

    setLoading(true);
    try {
      await API.post("/reservations", { date, timeSlot, guests });
      setDate("");
      setGuests(1);
      fetchReservations();
    } catch {
      alert("Reservation failed");
    }
    setLoading(false);
  };

  const cancelReservation = async (id: string) => {
    await API.patch(`/reservations/${id}/cancel`);
    fetchReservations();
  };

  return (
    <div style={page}>
      <Navbar />

      <div style={container}>
        <div style={header}>
          <h2>User Dashboard</h2>

          <button
            style={dangerBtn}
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        <div style={card}>
          <h3>🍽 Book Table</h3>

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />

          <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} style={input}>
            {TIMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input type="number" min={1} value={guests} onChange={(e) => setGuests(+e.target.value)} style={input} />

          <button style={primaryBtn} onClick={createReservation}>
            {loading ? "Saving..." : "Reserve"}
          </button>
        </div>

        {loadingList ? (
          <Spinner text="Loading..." />
        ) : (
          <div style={{ display: "grid", gap: 15 }}>
            {reservations.map((r) => (
              <div key={r._id} style={card}>
                <p>📅 {r.date}</p>
                <p>⏰ {r.timeSlot}</p>
                <p>👥 {r.guests}</p>

                <span style={{ ...badge, background: r.status === "ACTIVE" ? "#2e7d32" : "#c62828" }}>
                  {r.status}
                </span>

                {r.status === "ACTIVE" && (
                  <button style={dangerBtn} onClick={() => cancelReservation(r._id)}>
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLES */

const page = { minHeight: "100vh", background: "#f8f5f0" };
const container = { maxWidth: 900, margin: "auto", padding: 30 };
const header = { background: "white", padding: 20, borderRadius: 15, marginBottom: 25, display: "flex", justifyContent: "space-between" };
const card = { background: "white", padding: 20, borderRadius: 15, display: "grid", gap: 10 };
const input = { padding: 12, borderRadius: 8 };
const badge = { padding: "4px 10px", borderRadius: 15, color: "white", width: "fit-content" };
const primaryBtn = { background: "#2e7d32", color: "white", borderRadius: 20, padding: "8px 18px", border: "none" };
const dangerBtn = { background: "#c62828", color: "white", borderRadius: 20, padding: "6px 14px", border: "none" };
