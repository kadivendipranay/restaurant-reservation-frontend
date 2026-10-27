//AdminPage.jsx
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleUserRound,
  ClipboardList, Clock3, Filter, Hash, LayoutDashboard, RotateCcw, Search,
  Armchair, Users, XCircle, RefreshCw, BarChart3, TrendingUp, AlertTriangle,
  Mail, Utensils, Sparkles
} from "lucide-react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "../styles/AdminPage.css";

const PAGE_SIZE = 5;
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ALL", label: "All reservations" },
];
const formatDate = (dateString) => {
  if (!dateString) return "Not available";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const getStatusLabel = (status) => ({ ACTIVE: "Active", CANCELLED: "Cancelled", COMPLETED: "Completed" }[status] || status || "Unknown");
const num = (value) => Number(value) || 0;

export default function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionLoadingLabel, setActionLoadingLabel] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ search: "", date: "" });
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(true);

  const fetchAllReservations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get("/reservations/all", {
        params: { page, limit: PAGE_SIZE, status: statusFilter, search: appliedFilters.search, date: appliedFilters.date }
      });
      const result = response.data || {};
      setReservations(Array.isArray(result.data) ? result.data : []);
      setTotal(num(result.total));
      setPages(Math.max(1, num(result.pages) || 1));
    } catch (error) {
      setReservations([]); setTotal(0); setPages(1);
      toast.error(error?.response?.data?.message || "Unable to load reservations. Please try again.");
    } finally { setLoading(false); }
  }, [page, statusFilter, appliedFilters]);

  useEffect(() => { fetchAllReservations(); }, [fetchAllReservations]);

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const response = await API.get("/insights");
      setInsights(response.data);
    } catch (error) {
      setInsights(null);
      toast.error(error?.response?.data?.message || "Unable to load admin insights.");
    } finally { setInsightsLoading(false); }
  }, []);
  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({ search: searchEmail.trim(), date: searchDate });
  };
  const handleReset = () => {
    setSearchEmail(""); setSearchDate(""); setStatusFilter("ACTIVE");
    setAppliedFilters({ search: "", date: "" }); setPage(1);
  };
  const handleStatusChange = (event) => { setStatusFilter(event.target.value); setPage(1); };

  const performAdminAction = async (id, action, successMessage) => {
    if (actionLoadingId) return;
    if (!window.confirm("Are you sure you want to continue?")) return;
    setActionLoadingId(id);
    setActionLoadingLabel(action);
    try {
      const response = await API.patch(`/reservations/${action}/${id}`);
      toast.success(response.data?.message || successMessage);
      await Promise.all([fetchAllReservations(), fetchInsights()]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update the reservation.");
    } finally { setActionLoadingId(null); setActionLoadingLabel(""); }
  };
  const handleAdminCancel = (id) => performAdminAction(id, "admin-cancel", "Reservation cancelled successfully.");
  const handleAdminRestore = (id) => performAdminAction(id, "admin-restore", "Reservation restored successfully.");
  const handleAdminComplete = (id) => performAdminAction(id, "admin-complete", "Reservation marked as completed.");
  const handlePreviousPage = () => setPage((current) => Math.max(1, current - 1));
  const handleNextPage = () => setPage((current) => Math.min(pages, current + 1));

  const selectedStatus = STATUS_OPTIONS.find((item) => item.value === statusFilter)?.label || "Active";
  const cancellationRate = Math.min(100, Math.max(0, num(insights?.cancellationRate)));
  const statusCounts = insights?.statusCounts || { ACTIVE: 0, CANCELLED: 0, COMPLETED: 0 };
  const statusChartData = [
    { name: "Active", value: num(statusCounts.ACTIVE), fill: "#16a34a" },
    { name: "Cancelled", value: num(statusCounts.CANCELLED), fill: "#e05252" },
    { name: "Completed", value: num(statusCounts.COMPLETED), fill: "#3975e8" },
  ];

  return (
    <main className="admin-container">
      <Navbar />
      <div className="admin-page-content">
        <section className="admin-welcome">
          <div className="admin-welcome-content">
            <span className="admin-eyebrow"><Sparkles size={14} /> RESTAURANT OPERATIONS</span>
            <h1>Admin Dashboard</h1>
            <p>Your reservation command centre. Track bookings, review trends, and keep every service running smoothly.</p>
            <div className="welcome-meta">
              <span><Utensils size={15} /> ReserveDine</span>
              <span><LayoutDashboard size={15} /> Management overview</span>
            </div>
          </div>
          <div className="admin-welcome-icon" aria-hidden="true"><LayoutDashboard size={44} strokeWidth={1.7} /></div>
          <div className="welcome-decoration welcome-decoration-one" />
          <div className="welcome-decoration welcome-decoration-two" />
        </section>

        <section className="admin-panel insights-panel" aria-label="Admin insights">
          <div className="panel-heading">
            <div><span className="section-kicker">PERFORMANCE OVERVIEW</span><h2><BarChart3 size={22} /> Admin Insights</h2><p>Reservation trends and operational recommendations.</p></div>
            <button type="button" className="admin-btn secondary-btn" onClick={fetchInsights} disabled={insightsLoading}>
              <RefreshCw size={16} className={insightsLoading ? "spin-icon" : ""} />{insightsLoading ? "Refreshing…" : "Refresh insights"}
            </button>
          </div>
          {insightsLoading ? <div className="admin-loading"><Spinner text="Loading insights..." /></div> : insights ? <>
            <div className="insights-grid">
              <article className="insight-card insight-indigo"><div className="insight-card-top"><span className="insight-icon"><ClipboardList size={21} /></span><span className="insight-overline">LIFETIME</span></div><p>Total reservations</p><h3>{num(insights.totalReservations).toLocaleString("en-IN")}</h3><span className="insight-caption">All recorded bookings</span></article>
              <article className="insight-card insight-green"><div className="insight-card-top"><span className="insight-icon"><CheckCircle2 size={21} /></span><span className="insight-overline">IN PROGRESS</span></div><p>Active reservations</p><h3>{num(statusCounts.ACTIVE).toLocaleString("en-IN")}</h3><span className="insight-caption">Currently active bookings</span></article>
              <article className="insight-card insight-red"><div className="insight-card-top"><span className="insight-icon"><XCircle size={21} /></span><span className="insight-overline">CANCELLED</span></div><p>Cancelled reservations</p><h3>{num(statusCounts.CANCELLED).toLocaleString("en-IN")}</h3><span className="insight-caption">Bookings cancelled</span></article>
              <article className="insight-card insight-blue"><div className="insight-card-top"><span className="insight-icon"><TrendingUp size={21} /></span><span className="insight-overline">FULFILLED</span></div><p>Completed reservations</p><h3>{num(statusCounts.COMPLETED).toLocaleString("en-IN")}</h3><span className="insight-caption">Successfully completed</span></article>
            </div>
            <div className="cancellation-insight">
              <div className="insight-section-heading"><div><h3>Cancellation rate</h3><p>Share of all recorded reservations that were cancelled.</p></div><strong className="cancellation-percentage">{cancellationRate.toFixed(2)}%</strong></div>
              <div className="insight-progress" role="progressbar" aria-label="Cancellation rate" aria-valuemin={0} aria-valuemax={100} aria-valuenow={cancellationRate}><div style={{ width: `${cancellationRate}%` }} /></div>
            </div>
            <div className="insight-charts-grid">
              <article className="insight-chart-card">
                <div className="insight-chart-heading"><div><h3>Reservation status</h3><p>Breakdown across all statuses</p></div></div>
                <div className="insight-chart-body"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="78%" innerRadius="53%" paddingAngle={3}>{statusChartData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Pie><Tooltip formatter={(value, name) => [value, name]} /></PieChart></ResponsiveContainer></div>
                <div className="insight-chart-legend">{statusChartData.map((item) => <span key={item.name}><i className="legend-dot" style={{ background: item.fill }} />{item.name}: {item.value}</span>)}</div>
              </article>
              <article className="insight-chart-card">
                <div className="insight-chart-heading"><div><h3>Popular time slots</h3><p>Active reservations by time slot</p></div></div>
                <div className="insight-chart-body">{insights.popularSlots?.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={insights.popularSlots.map((slot) => ({ timeSlot: slot.timeSlot, activeReservations: num(slot.activeReservations) }))} margin={{ top: 12, right: 10, left: -20, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf5" /><XAxis dataKey="timeSlot" tick={{ fontSize: 11, fill: "#65708a" }} interval={0} /><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#65708a" }} /><Tooltip /><Bar dataKey="activeReservations" name="Active reservations" fill="#5b5ce2" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer> : <p className="insight-empty">No active reservations to chart yet.</p>}</div>
              </article>
            </div>
            <div className="insight-lower-grid">
              <div className="popular-slots"><h3><Clock3 size={19} /> Popular time slots</h3>
                {insights.popularSlots?.length ? insights.popularSlots.map((slot) => <div className="popular-slot-row" key={slot.timeSlot}><div className="popular-slot-label"><Clock3 size={16} /><span>{slot.timeSlot}</span></div><strong>{slot.activeReservations} active {slot.activeReservations === 1 ? "reservation" : "reservations"}</strong></div>) : <p className="insight-empty">No active reservations to analyze yet.</p>}
                {insights.mostPopularSlot && <div className="busiest-slot"><strong>Busiest slot</strong><span>{insights.mostPopularSlot.timeSlot}</span></div>}
              </div>
              <div className="insight-recommendations"><h3><AlertTriangle size={19} /> Recommendations</h3>{insights.suggestions?.length ? <ul>{insights.suggestions.map((suggestion, index) => <li key={`${index}-${suggestion}`}>{suggestion}</li>)}</ul> : <p className="insight-empty">No recommendations available.</p>}</div>
            </div>
          </> : <div className="insight-error"><p>Unable to load insights. Check your admin login and backend connection.</p><button type="button" className="admin-btn primary-btn" onClick={fetchInsights}><RefreshCw size={16} /> Try again</button></div>}
        </section>

        <section className="admin-stats" aria-label="Reservation summary">
          <article className="stat-card stat-indigo"><div className="stat-icon"><ClipboardList size={23} /></div><div className="stat-content"><p>Matching reservations</p><h2>{loading ? "—" : total.toLocaleString("en-IN")}</h2><span>Based on current filters</span></div></article>
          <article className="stat-card stat-teal"><div className="stat-icon"><Filter size={23} /></div><div className="stat-content"><p>Selected status</p><h2>{selectedStatus}</h2><span>Current reservation view</span></div></article>
          <article className="stat-card stat-blue"><div className="stat-icon"><LayoutDashboard size={23} /></div><div className="stat-content"><p>Current page</p><h2>{page} <span className="page-total">/ {pages}</span></h2><span>{PAGE_SIZE} reservations per page</span></div></article>
        </section>

        <section className="admin-panel filter-panel">
          <div className="panel-heading"><div><span className="section-kicker">FIND A BOOKING</span><h2><Filter size={22} /> Find reservations</h2><p>Search and narrow bookings by status, user email, or date.</p></div><span className="panel-heading-icon"><Search size={22} /></span></div>
          <form className="admin-filter-form" onSubmit={handleSearch}>
            <div className="filter-field"><label htmlFor="statusFilter">Reservation status</label><select id="statusFilter" value={statusFilter} onChange={handleStatusChange}>{STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
            <div className="filter-field"><label htmlFor="searchEmail">User email</label><div className="input-with-icon"><Mail size={17} /><input id="searchEmail" type="text" placeholder="name@example.com" value={searchEmail} onChange={(event) => setSearchEmail(event.target.value)} /></div></div>
            <div className="filter-field"><label htmlFor="searchDate">Reservation date</label><div className="input-with-icon"><CalendarDays size={17} /><input id="searchDate" type="date" value={searchDate} onChange={(event) => setSearchDate(event.target.value)} /></div></div>
            <div className="filter-actions"><button type="submit" className="admin-btn primary-btn" disabled={loading}><Search size={16} /> Search</button><button type="button" className="admin-btn secondary-btn" onClick={handleReset} disabled={loading}><RotateCcw size={16} /> Reset</button></div>
          </form>
        </section>

        <section className="admin-panel reservations-panel">
          <div className="panel-heading reservation-list-heading"><div><span className="section-kicker">BOOKING MANAGEMENT</span><h2><ClipboardList size={22} /> Reservations</h2><p>Review guest details and manage each reservation.</p></div><span className="results-count">{total} {total === 1 ? "result" : "results"}</span></div>
          {loading ? <div className="admin-loading"><Spinner text="Loading reservations..." /></div> : reservations.length === 0 ? (
            <div className="admin-empty-state"><div className="empty-state-icon"><CalendarDays size={28} /></div><h3>No reservations found</h3><p>Try another status, email address, or reservation date.</p><button type="button" className="admin-btn secondary-btn" onClick={handleReset}><RefreshCw size={16} /> Clear filters</button></div>
          ) : <div className="reservation-list">{reservations.map((reservation) => {
            const status = (reservation.status || "UNKNOWN").toUpperCase();
            const isActionLoading = actionLoadingId === reservation._id;
            const userName = reservation.user?.name || "Guest";
            return <article key={reservation._id} className="reservation-item">
              <div className="reservation-item-header"><div className="reservation-identity"><div className="reservation-avatar"><CircleUserRound size={27} /></div><div className="reservation-user"><h3>{userName}</h3><p>{reservation.user?.email || "User information unavailable"}</p></div></div><span className={`status-badge status-${status.toLowerCase()}`}><span className="status-dot" />{getStatusLabel(status)}</span></div>
              <div className="reservation-details">
                <div className="reservation-detail"><span className="detail-label"><Hash size={15} /> Reservation ID</span><span className="detail-value id-value" title={reservation._id}>{reservation._id || "Not available"}</span></div>
                <div className="reservation-detail"><span className="detail-label"><CalendarDays size={15} /> Date</span><span className="detail-value">{formatDate(reservation.date)}</span></div>
                <div className="reservation-detail"><span className="detail-label"><Clock3 size={15} /> Time slot</span><span className="detail-value">{reservation.timeSlot || "Not assigned"}</span></div>
                <div className="reservation-detail"><span className="detail-label"><Armchair size={15} /> Table</span><span className="detail-value">{reservation.table?.tableNumber ?? reservation.table?.number ?? "Not assigned"}</span></div>
                <div className="reservation-detail"><span className="detail-label"><Users size={15} /> Guests</span><span className="detail-value">{reservation.guests ?? "Not specified"}</span></div>
              </div>
              <div className="reservation-actions"><span className="actions-label">Reservation actions</span><div className="actions-buttons">
                {status === "ACTIVE" && <><button type="button" className="action-btn complete-btn" disabled={Boolean(actionLoadingId)} onClick={() => handleAdminComplete(reservation._id)}><CheckCircle2 size={16} />{isActionLoading && actionLoadingLabel === "complete" ? "Processing…" : "Complete"}</button><button type="button" className="action-btn cancel-btn" disabled={Boolean(actionLoadingId)} onClick={() => handleAdminCancel(reservation._id)}><XCircle size={16} />{isActionLoading && actionLoadingLabel === "admin-cancel" ? "Processing…" : "Cancel"}</button></>}
                {status === "CANCELLED" && <button type="button" className="action-btn restore-btn" disabled={Boolean(actionLoadingId)} onClick={() => handleAdminRestore(reservation._id)}><RotateCcw size={16} />{isActionLoading && actionLoadingLabel === "admin-restore" ? "Processing…" : "Restore reservation"}</button>}
                {status === "COMPLETED" && <span className="completed-note"><CheckCircle2 size={16} /> Reservation completed</span>}
              </div></div>
            </article>;
          })}</div>}
          <div className="admin-pagination"><p>Page <strong>{page}</strong> of <strong>{pages}</strong></p><div className="pagination-buttons"><button type="button" className="pagination-btn" onClick={handlePreviousPage} disabled={loading || page <= 1}><ChevronLeft size={16} /> Previous</button><button type="button" className="pagination-btn next-page-btn" onClick={handleNextPage} disabled={loading || page >= pages}>Next <ChevronRight size={16} /></button></div></div>
        </section>
        <footer className="admin-footer"><span className="footer-brand"><Utensils size={16} /> ReserveDine</span><span>Administration <i>·</i> Reservation management</span></footer>
      </div>
    </main>
  );
}
