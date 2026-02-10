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
      setMsg({ type: "error", text: "Fill all fields correctly" });
      return;
    }

    setLoading(true);

    try {
      await API.post("/reservations", { date, timeSlot, guests });
      setMsg({ type: "success", text: "Reservation created successfully" });

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

      <div className="card">
        <h2>User Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {msg && <div className="card">{msg.text}</div>}

      {/* Create Reservation */}
      <div className="card">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />

        <button onClick={handleCreateReservation} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {/* Reservation List */}
      <div className="card">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
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
            <div key={r._id}>
              <p>
                {r.date} | {r.timeSlot} | Guests: {r.guests}
              </p>

              {r.status === "ACTIVE" && (
                <button onClick={() => handleCancelReservation(r._id)}>
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
