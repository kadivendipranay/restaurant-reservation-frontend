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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Navbar />

      {/* Header */}
      <div className="card" style={{
        padding: 20,
        background: "linear-gradient(135deg,#ff6a00,#ff005c)",
        color: "white"
      }}>
        <h2>🍽 User Dashboard</h2>
        <p>Book & manage your reservations</p>
        <button onClick={handleLogout} style={{background:"white",borderRadius:20,padding:"6px 14px"}}>
          Logout
        </button>
      </div>

      {/* Create Reservation */}
      <div className="card" style={{ padding: 20 }}>
        <h3>➕ Book a Table</h3>

        <div style={{ display: "grid", gap: 12 }}>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />

          <select value={timeSlot} onChange={(e)=>setTimeSlot(e.target.value)}>
            {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
          </select>

          <input type="number" min={1} value={guests} onChange={(e)=>setGuests(+e.target.value)} />

          <button onClick={handleCreateReservation} disabled={loading}
            style={{
              padding:12,
              borderRadius:25,
              background:"linear-gradient(135deg,#00c853,#00bfa5)",
              color:"white",
              border:"none"
            }}>
            {loading ? "Creating..." : "Reserve Now"}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="card" style={{ padding: 15 }}>
        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ALL">ALL</option>
        </select>
      </div>

      {/* Reservations */}
      <div className="card">
        <h3>📌 My Reservations</h3>

        {loadingList ? <Spinner text="Loading..." /> :
        reservations.length === 0 ? <Spinner text="No reservations" /> :
        reservations.map((r:any)=>(
          <div key={r._id} style={{
            padding:15,
            marginBottom:12,
            borderRadius:14,
            background:"#fafafa",
            border:"1px solid #ddd"
          }}>
            <p>📅 {r.date}</p>
            <p>⏰ {r.timeSlot}</p>
            <p>👥 Guests: {r.guests}</p>

            <b style={{color:r.status==="ACTIVE"?"green":"red"}}>{r.status}</b>

            {r.status==="ACTIVE" && (
              <button
                onClick={()=>API.patch(`/reservations/${r._id}/cancel`).then(fetchMyReservations)}
                style={{
                  marginTop:8,
                  background:"#ff5252",
                  color:"white",
                  border:"none",
                  borderRadius:20,
                  padding:"6px 12px"
                }}>
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
