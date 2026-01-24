import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import { logout } from "../utils/auth";
import Spinner from "../components/Spinner";

export default function UserPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("17:00-18:00");
  const [guests, setGuests] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  // ✅ UI message
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const TIME_SLOTS = [
    "17:00-18:00",
    "18:00-19:00",
    "19:00-20:00",
    "20:00-21:00",
  ];

  // ✅ Date input min/max (today to 1 year)
  const today = new Date().toISOString().split("T")[0];
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  const maxDate = oneYearLater.toISOString().split("T")[0];

  const handleLogout = () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;
    logout();
    navigate("/login");
  };

  const fetchMyReservations = async () => {
    setLoadingList(true);
    setMsg(null);

    try {
      const res = await API.get(`/reservations/my?status=${statusFilter}`);
      setReservations(res.data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load reservations";
      setMsg({ type: "error", text: message });
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, [statusFilter]);

  const handleCreateReservation = async () => {
    setMsg(null);

    if (!date || !timeSlot || !guests) {
      setMsg({ type: "error", text: "Please fill all fields" });
      return;
    }

    if (guests < 1) {
      setMsg({ type: "error", text: "Guests must be at least 1" });
      return;
    }

    setLoading(true);

    try {
      await API.post("/reservations", {
        date,
        timeSlot,
        guests,
      });

      setMsg({ type: "success", text: "Reservation created successfully ✅" });

      setDate("");
      setTimeSlot("17:00-18:00");
      setGuests(1);

      fetchMyReservations();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Reservation failed";
      setMsg({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    setMsg(null);

    const ok = window.confirm("Cancel this reservation?");
    if (!ok) return;

    try {
      const res = await API.patch(`/reservations/${id}/cancel`);
      setMsg({ type: "success", text: res.data.message || "Cancelled ✅" });
      fetchMyReservations();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Cancel failed";
      setMsg({ type: "error", text: message });
    }
  };

  return (
    <div className="container">
      <Navbar />

      {/* ✅ Page Header */}
      <div
        className="card"
        style={{
          padding: "18px",
          marginBottom: "15px",
          background: "linear-gradient(135deg,#0077ff,#00c6ff)",
          color: "white",
        }}
      >
        <h2 style={{ margin: 0 }}>User Dashboard ✅</h2>
        <p style={{ marginTop: "5px", opacity: 0.9 }}>
          Create and manage your reservations easily.
        </p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "10px",
            background: "white",
            color: "#0077ff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* ✅ Message Box */}
      {msg && (
        <div
          className="card"
          style={{
            padding: "12px",
            marginBottom: "15px",
            background: msg.type === "success" ? "#d4edda" : "#f8d7da",
            border: msg.type === "success" ? "1px solid #28a745" : "1px solid #dc3545",
            color: msg.type === "success" ? "#155724" : "#721c24",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* ✅ Create Reservation Card */}
      <div
        className="card"
        style={{
          padding: "18px",
          marginBottom: "20px",
          border: "1px solid #ddd",
          borderRadius: "14px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>➕ Create Reservation</h3>

        <label style={{ fontWeight: "bold" }}>Select Date</label>
        <input
          type="date"
          value={date}
          min={today}
          max={maxDate}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
          style={{ width: "100%", padding: "10px", margin: "8px 0 12px" }}
        />

        <label style={{ fontWeight: "bold" }}>Select Time Slot</label>
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          disabled={loading}
          style={{ width: "100%", padding: "10px", margin: "8px 0 12px" }}
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <label style={{ fontWeight: "bold" }}>Guests</label>
        <input
          type="number"
          value={guests}
          min={1}
          onChange={(e) => setGuests(Number(e.target.value))}
          disabled={loading}
          style={{ width: "100%", padding: "10px", margin: "8px 0 12px" }}
        />

        <button
          onClick={handleCreateReservation}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            background: "linear-gradient(135deg,#00c853,#00bfa5)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Reservation"}
        </button>
      </div>

      {/* ✅ Reservations List Card */}
      <div className="card" style={{ padding: "18px" }}>
        <h3 style={{ marginTop: 0 }}>📌 My Reservations</h3>

        <div style={{ marginBottom: "12px", display: "flex", gap: "10px" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px", flex: 1 }}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ALL">ALL</option>
          </select>

          <button
            onClick={fetchMyReservations}
            disabled={loadingList}
            style={{
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            {loadingList ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loadingList ? (
          <Spinner text="Loading reservations..." />
        ) : reservations.length === 0 ? (
          <Spinner text="No reservations found..." />
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {reservations.map((r: any) => (
              <div
                key={r._id}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  background: "#fafafa",
                }}
              >
                <p style={{ margin: "4px 0" }}>
                  📅 <b>Date:</b> {r.date}
                </p>
                <p style={{ margin: "4px 0" }}>
                  ⏰ <b>Time:</b> {r.timeSlot}
                </p>
                <p style={{ margin: "4px 0" }}>
                  👥 <b>Guests:</b> {r.guests}
                </p>
                <p style={{ margin: "4px 0" }}>
                  🪑 <b>Table:</b> {r.table?.tableNumber || "N/A"} (Capacity:{" "}
                  {r.table?.capacity || "N/A"})
                </p>
                <p style={{ margin: "4px 0" }}>
                  ✅ <b>Status:</b>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        r.status === "ACTIVE"
                          ? "#00c853"
                          : r.status === "CANCELLED"
                          ? "#e53935"
                          : "#ff9800",
                    }}
                  >
                    {r.status}
                  </span>
                </p>

                {r.status === "ACTIVE" && (
                  <button
                    style={{
                      marginTop: "10px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg,#ff5252,#ff1744)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleCancelReservation(r._id)}
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
  );
}
