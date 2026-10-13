import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  Clock3,
  Filter,
  Hash,
  LayoutDashboard,
  ListFilter,
  RotateCcw,
  Search,
  Armchair,
  Users,
  XCircle,
  RefreshCw,
} from "lucide-react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import "../styles/AdminPage.css";

const PAGE_SIZE = 5;

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ALL", label: "All Reservations" },
];

const formatDate = (dateString) => {
  if (!dateString) return "Not available";

  // Keep YYYY-MM-DD dates stable in the user's local timezone.
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusLabel = (status) => {
  const labels = {
    ACTIVE: "Active",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
  };

  return labels[status] || status || "Unknown";
};

export default function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    date: "",
  });

  const fetchAllReservations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await API.get("/reservations/all", {
        params: {
          page,
          limit: PAGE_SIZE,
          status: statusFilter,
          search: appliedFilters.search,
          date: appliedFilters.date,
        },
      });

      const result = response.data || {};
      setReservations(Array.isArray(result.data) ? result.data : []);
      setTotal(Number(result.total) || 0);
      setPages(Math.max(1, Number(result.pages) || 1));
    } catch (error) {
      setReservations([]);
      setTotal(0);
      setPages(1);
      toast.error(
        error?.response?.data?.message ||
          "Unable to load reservations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, appliedFilters]);

  useEffect(() => {
    fetchAllReservations();
  }, [fetchAllReservations]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({
      search: searchEmail.trim(),
      date: searchDate,
    });
  };

  const handleReset = () => {
    setSearchEmail("");
    setSearchDate("");
    setStatusFilter("ACTIVE");
    setAppliedFilters({ search: "", date: "" });
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const performAdminAction = async (id, action, successMessage) => {
    if (actionLoadingId) return;
    if (!window.confirm("Are you sure you want to continue?")) return;

    setActionLoadingId(id);

    try {
      const response = await API.patch(`/reservations/${action}/${id}`);
      toast.success(response.data?.message || successMessage);
      await fetchAllReservations();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update the reservation."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAdminCancel = (id) =>
    performAdminAction(
      id,
      "admin-cancel",
      "Reservation cancelled successfully."
    );

  const handleAdminRestore = (id) =>
    performAdminAction(
      id,
      "admin-restore",
      "Reservation restored successfully."
    );

  const handleAdminComplete = (id) =>
    performAdminAction(
      id,
      "admin-complete",
      "Reservation marked as completed."
    );

  const handlePreviousPage = () =>
    setPage((current) => Math.max(1, current - 1));

  const handleNextPage = () =>
    setPage((current) => Math.min(pages, current + 1));

  const selectedStatus =
    STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label ||
    "Active";

  return (
    <main className="admin-container">
      <Navbar />

      <section className="admin-welcome">
        <div className="admin-welcome-content">
          <span className="admin-eyebrow">RESTAURANT MANAGEMENT</span>
          <h1>Admin Dashboard</h1>
          <p>
            Manage reservations, monitor bookings, and keep restaurant
            operations organized.
          </p>
        </div>

        <div className="admin-welcome-icon" aria-hidden="true">
          <LayoutDashboard size={43} strokeWidth={1.8} />
        </div>
      </section>

      <section className="admin-stats" aria-label="Reservation summary">
        <article className="stat-card stat-indigo">
          <div className="stat-icon" aria-hidden="true">
            <ClipboardList size={26} />
          </div>
          <div className="stat-content">
            <p>Matching Reservations</p>
            <h2>{loading ? "—" : total}</h2>
            <span>Based on current filters</span>
          </div>
        </article>

        <article className="stat-card stat-teal">
          <div className="stat-icon" aria-hidden="true">
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-content">
            <p>Selected Status</p>
            <h2>{selectedStatus}</h2>
            <span>Current reservation view</span>
          </div>
        </article>

        <article className="stat-card stat-blue">
          <div className="stat-icon" aria-hidden="true">
            <LayoutDashboard size={26} />
          </div>
          <div className="stat-content">
            <p>Current Page</p>
            <h2>
              {page} <span className="page-total">/ {pages}</span>
            </h2>
            <span>{PAGE_SIZE} reservations per page</span>
          </div>
        </article>
      </section>

      <section className="admin-panel filter-panel">
        <div className="panel-heading">
          <div>
            <h2>
              <Filter size={23} />
              Find Reservations
            </h2>
            <p>Filter bookings by status, email, or date.</p>
          </div>
          <span className="panel-heading-icon" aria-hidden="true">
            <ListFilter size={25} />
          </span>
        </div>

        <form className="admin-filter-form" onSubmit={handleSearch}>
          <div className="filter-field">
            <label htmlFor="statusFilter">Reservation Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="searchEmail">User Email</label>
            <input
              id="searchEmail"
              type="text"
              placeholder="Enter user email"
              value={searchEmail}
              onChange={(event) => setSearchEmail(event.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="searchDate">Reservation Date</label>
            <input
              id="searchDate"
              type="date"
              value={searchDate}
              onChange={(event) => setSearchDate(event.target.value)}
            />
          </div>

          <div className="filter-actions">
            <button
              type="submit"
              className="admin-btn primary-btn"
              disabled={loading}
            >
              <Search size={17} />
              Search
            </button>
            <button
              type="button"
              className="admin-btn secondary-btn"
              onClick={handleReset}
              disabled={loading}
            >
              <RotateCcw size={16} />
              Reset Filters
            </button>
          </div>
        </form>
      </section>

      <section className="admin-panel reservations-panel">
        <div className="panel-heading reservation-list-heading">
          <div>
            <h2>
              <ClipboardList size={23} />
              Reservations
            </h2>
            <p>Review booking details and manage reservation status.</p>
          </div>
          <span className="results-count">
            {total} {total === 1 ? "result" : "results"}
          </span>
        </div>

        {loading ? (
          <div className="admin-loading">
            <Spinner text="Loading reservations..." />
          </div>
        ) : reservations.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              <CalendarDays size={30} />
            </div>
            <h3>No reservations found</h3>
            <p>
              Try another status, email address, or reservation date.
            </p>
            <button
              type="button"
              className="admin-btn secondary-btn"
              onClick={handleReset}
            >
              <RefreshCw size={16} />
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="reservation-list">
            {reservations.map((reservation) => {
              const status = (reservation.status || "UNKNOWN").toUpperCase();
              const isActionLoading = actionLoadingId === reservation._id;
              const userName = reservation.user?.name || "Guest";

              return (
                <article
                  key={reservation._id}
                  className="reservation-item"
                >
                  <div className="reservation-item-header">
                    <div className="reservation-identity">
                      <div className="reservation-avatar" aria-hidden="true">
                        <CircleUserRound size={29} />
                      </div>
                      <div className="reservation-user">
                        <h3>{userName}</h3>
                        <p>
                          {reservation.user?.email ||
                            "User information unavailable"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`status-badge status-${status.toLowerCase()}`}
                    >
                      <span className="status-dot" />
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  <div className="reservation-details">
                    <div className="reservation-detail">
                      <span className="detail-label">
                        <Hash size={16} />
                        Reservation ID
                      </span>
                      <span className="detail-value id-value">
                        {reservation._id || "Not available"}
                      </span>
                    </div>

                    <div className="reservation-detail">
                      <span className="detail-label">
                        <CalendarDays size={16} />
                        Date
                      </span>
                      <span className="detail-value">
                        {formatDate(reservation.date)}
                      </span>
                    </div>

                    <div className="reservation-detail">
                      <span className="detail-label">
                        <Clock3 size={16} />
                        Time Slot
                      </span>
                      <span className="detail-value">
                        {reservation.timeSlot || "Not assigned"}
                      </span>
                    </div>

                    <div className="reservation-detail">
                      <span className="detail-label">
                        <Armchair size={16} />
                        Table
                      </span>
                      <span className="detail-value">
                        {reservation.table?.tableNumber ??
                          reservation.table?.number ??
                          "Not assigned"}
                      </span>
                    </div>

                    <div className="reservation-detail">
                      <span className="detail-label">
                        <Users size={16} />
                        Guests
                      </span>
                      <span className="detail-value">
                        {reservation.guests ?? "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="reservation-actions">
                    <span className="actions-label">Reservation actions</span>
                    <div className="actions-buttons">
                      {status === "ACTIVE" && (
                        <>
                          <button
                            type="button"
                            className="action-btn complete-btn"
                            disabled={Boolean(actionLoadingId)}
                            onClick={() => handleAdminComplete(reservation._id)}
                          >
                            <CheckCircle2 size={17} />
                            {isActionLoading ? "Processing..." : "Complete"}
                          </button>
                          <button
                            type="button"
                            className="action-btn cancel-btn"
                            disabled={Boolean(actionLoadingId)}
                            onClick={() => handleAdminCancel(reservation._id)}
                          >
                            <XCircle size={17} />
                            Cancel
                          </button>
                        </>
                      )}

                      {status === "CANCELLED" && (
                        <button
                          type="button"
                          className="action-btn restore-btn"
                          disabled={Boolean(actionLoadingId)}
                          onClick={() => handleAdminRestore(reservation._id)}
                        >
                          <RotateCcw size={17} />
                          {isActionLoading
                            ? "Processing..."
                            : "Restore Reservation"}
                        </button>
                      )}

                      {status === "COMPLETED" && (
                        <span className="completed-note">
                          <CheckCircle2 size={17} />
                          Reservation completed
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="admin-pagination">
          <p>
            Page <strong>{page}</strong> of <strong>{pages}</strong>
          </p>
          <div className="pagination-buttons">
            <button
              type="button"
              className="pagination-btn"
              onClick={handlePreviousPage}
              disabled={loading || page <= 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              className="pagination-btn next-page-btn"
              onClick={handleNextPage}
              disabled={loading || page >= pages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <footer className="admin-footer">
        <p>
          ReserveDine Administration <span>·</span> Reservation Management
        </p>
      </footer>
    </main>
  );
}
