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
    setDate("");
    setGuests(1);
    fetchReservations();
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
          <h2>🍽 User Dashboard</h2>
          <button style={primaryBtn} onClick={() => { logout(); navigate("/login"); }}>
            Logout
          </button>
        </div>

        <div style={card}>
          <h3>Book Your Table</h3>

          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} style={input}/>

          <select value={timeSlot} onChange={(e)=>setTimeSlot(e.target.value)} style={input}>
            {TIME.map(t=><option key={t}>{t}</option>)}
          </select>

          <input type="number" min={1} value={guests} onChange={(e)=>setGuests(+e.target.value)} style={input}/>

          <button style={primaryBtn} onClick={createReservation}>
            {loading ? "Saving..." : "Reserve Table"}
          </button>
        </div>

        <div style={{display:"grid",gap:15,marginTop:25}}>
          {reservations.map((r:any)=>(
            <div key={r._id} style={card}>
              <b>{r.user?.email}</b>
              <p>📅 {r.date}</p>
              <p>⏰ {r.timeSlot}</p>
              <p>👥 Guests: {r.guests}</p>

              <span style={{
                ...badge,
                background:r.status==="ACTIVE"?"#2e7d32":"#c62828"
              }}>{r.status}</span>

              {r.status==="ACTIVE" && (
                <button style={dangerBtn} onClick={()=>cancelReservation(r._id)}>
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
const page={minHeight:"100vh",background:"#f8f5f0"};
const container={maxWidth:900,margin:"auto",padding:30};
const header={background:"white",padding:20,borderRadius:15,display:"flex",justifyContent:"space-between"};
const card={background:"white",padding:20,borderRadius:15,boxShadow:"0 6px 15px rgba(0,0,0,.08)",display:"grid",gap:10};
const input={padding:12,borderRadius:8,border:"1px solid #ddd"};
const badge={padding:"4px 10px",borderRadius:15,color:"white",fontSize:12,width:"fit-content"};
const primaryBtn={background:"#2e7d32",border:"none",padding:"8px 18px",borderRadius:20,color:"white"};
const dangerBtn={background:"#c62828",border:"none",padding:"6px 14px",borderRadius:20,color:"white"};
