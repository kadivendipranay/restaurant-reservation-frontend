import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

type Message = {
  type: "success" | "error";
  text: string;
};

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
  const [msg, setMsg] = useState<Message | null>(null);

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
    setMsg(null);

    try {
      const res = await API.get(`/reservations/my?status=${statusFilter}`);
      setReservations(res.data || []);
    } catch (err: any) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load reservations",
      });
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, [statusFilter]);

  const handleCreateReservation = async () => {
    if (!date || !timeSlot || guests < 1) {
      setMsg({ type: "error", text: "Please fill all fields correctly" });
      return;
    }

    setLoading(true);

    try {
      await API.post("/reservations", { date, timeSlot, guests });

      setMsg({ type: "success", text: "Reservation created successfully ✅" });

      setDate("");
      setGuests(1);
      setTimeSlot("17:00-18:00");

      fetchMyReservations();
    } catch (err: any) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Reservation failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!window.confirm("Cancel reservation?")) return;

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

      {/* Header */}
      <div
        className="card"
        style={{
          padding: 18,
          marginBottom: 15,
          background: "linear-gradient(135deg,#0077ff,#00c6ff)",
          color: "white",
        }}
      >
        <h2 style={{ margin: 0 }}>User Dashboard</h2>
        <p>Create and manage your reservations</p>

        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "#0077ff",
            border: "none",
            padding: "8px 12px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div
          className="card"
          style={{
            padding: 12,
            marginBottom: 15,
            background: msg.type === "success" ? "#d4edda" : "#f8d7da",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Create Reservation */}
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
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
          style={{
            marginTop: 10,
            width: "100%",
            padding: 10,
            borderRadius: 12,
            background: "linear-gradient(135deg,#00c853,#00bfa5)",
            border: "none",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {loading ? "Creating..." : "Create Reservation"}
        </button>
      </div>

      {/* Reservation List */}
      <div className="card" style={{ padding: 18 }}>
        <h3>My Reservations</h3>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ marginBottom: 12 }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ALL">ALL</option>
        </select>

        {loadingList ? (
          <Spinner text="Loading..." />
        ) : reservations.length === 0 ? (
          <Spinner text="No reservations found" />
        ) : (
          reservations.map((r: any) => (
            <div
              key={r._id}
              style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <p>
                📅 {r.date} | ⏰ {r.timeSlot} | 👥 {r.guests}
              </p>

              <p>
                Status:{" "}
                <b style={{ color: r.status === "ACTIVE" ? "#00c853" : "#e53935" }}>
                  {r.status}
                </b>
              </p>

              {r.status === "ACTIVE" && (
                <button
                  onClick={() => handleCancelReservation(r._id)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "none",
                    background: "#ff5252",
                    color: "white",
                    cursor: "pointer",
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
