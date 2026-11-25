import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Armchair,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Hash,
  Layers,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import API from "../api/api";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

const TIME_SLOTS = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
];

const ZONES = ["Main Hall", "Window", "Patio", "VIP"];

const getToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
};

const getErrorMessage = (error, fallback) => {
  if (error?.response?.status === 404) {
    return "Table management API is not deployed on the backend yet. Please push your updated backend routes to Render.";
  }
  return error?.response?.data?.message || error?.message || fallback;
};

export default function AdminTableManager() {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("ALL");
  const [occupancyData, setOccupancyData] = useState(null);
  const [loadingOccupancy, setLoadingOccupancy] = useState(true);

  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("2");
  const [zone, setZone] = useState("Main Hall");
  const [editingTable, setEditingTable] = useState(null);
  const [savingTable, setSavingTable] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadOccupancy = useCallback(async (isCancelled = () => false) => {
    setLoadingOccupancy(true);
    try {
      const response = await API.get("/tables/occupancy", {
        params: { date: selectedDate, timeSlot: selectedSlot },
      });
      if (!isCancelled()) {
        setOccupancyData(response?.data || null);
      }
    } catch (error) {
      if (isCancelled()) return;

      // Fallback if Render hasn't deployed /tables/occupancy yet
      if (error?.response?.status === 404) {
        try {
          const [tablesRes, resvRes] = await Promise.all([
            API.get("/tables"),
            API.get("/reservations/all", {
              params: {
                page: 1,
                limit: 100,
                status: "ACTIVE",
                date: selectedDate,
              },
            }),
          ]);
          if (isCancelled()) return;

          const allTables = Array.isArray(tablesRes?.data)
            ? tablesRes.data
            : Array.isArray(tablesRes?.data?.tables)
            ? tablesRes.data.tables
            : [];
          const activeList = Array.isArray(resvRes?.data?.data)
            ? resvRes.data.data
            : [];
          const slotBookings = activeList.filter(
            (booking) => booking.timeSlot === selectedSlot
          );

          const occupancy = allTables.map((table) => {
            const booking = slotBookings.find(
              (b) => String(b.table?._id || b.table) === String(table._id)
            );
            return {
              ...table,
              status: booking ? "BOOKED" : "AVAILABLE",
              reservation: booking
                ? {
                    _id: booking._id,
                    guests: booking.guests,
                    guestName: booking.user?.name || "Guest",
                    guestEmail: booking.user?.email || "",
                  }
                : null,
            };
          });

          setOccupancyData({
            date: selectedDate,
            timeSlot: selectedSlot,
            totalTables: allTables.length,
            bookedCount: occupancy.filter((t) => t.status === "BOOKED").length,
            availableCount: occupancy.filter((t) => t.status === "AVAILABLE")
              .length,
            occupancy,
          });
          return;
        } catch (fallbackError) {
          if (!isCancelled()) {
            toast.error(
              getErrorMessage(
                fallbackError,
                "Unable to load table floor status."
              )
            );
          }
          return;
        }
      }

      toast.error(getErrorMessage(error, "Unable to load table floor status."));
    } finally {
      if (!isCancelled()) {
        setLoadingOccupancy(false);
      }
    }
  }, [selectedDate, selectedSlot]);

  useEffect(() => {
    let cancelled = false;
    loadOccupancy(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [loadOccupancy]);

  const tables = useMemo(
    () => (Array.isArray(occupancyData?.occupancy) ? occupancyData.occupancy : []),
    [occupancyData]
  );

  const suggestedNextNumber = useMemo(() => {
    if (!tables.length) return "1";
    const maxNum = Math.max(
      ...tables.map((t) => Number(t.tableNumber) || 0)
    );
    return String(maxNum + 1);
  }, [tables]);

  useEffect(() => {
    if (!editingTable && !tableNumber) {
      setTableNumber(suggestedNextNumber);
    }
  }, [editingTable, suggestedNextNumber, tableNumber]);

  const filteredTables = useMemo(() => {
    if (selectedZoneFilter === "ALL") return tables;
    return tables.filter((t) => (t.zone || "Main Hall") === selectedZoneFilter);
  }, [tables, selectedZoneFilter]);

  const resetForm = () => {
    setEditingTable(null);
    setTableNumber("");
    setCapacity("2");
    setZone("Main Hall");
  };

  const startEditing = (table) => {
    setEditingTable(table);
    setTableNumber(String(table.tableNumber));
    setCapacity(String(table.capacity));
    setZone(table.zone || "Main Hall");
  };

  const handleSaveTable = async (event) => {
    event.preventDefault();
    const parsedNumber = Number(tableNumber);
    const parsedCapacity = Number(capacity);

    if (!Number.isInteger(parsedNumber) || parsedNumber < 1) {
      toast.warning("Table number must be a positive whole number.");
      return;
    }
    if (
      !Number.isInteger(parsedCapacity) ||
      parsedCapacity < 1 ||
      parsedCapacity > 20
    ) {
      toast.warning("Seating capacity must be between 1 and 20 guests.");
      return;
    }

    setSavingTable(true);
    try {
      const payload = {
        tableNumber: parsedNumber,
        capacity: parsedCapacity,
        zone,
      };

      if (editingTable) {
        const res = await API.patch(`/tables/${editingTable._id}`, payload);
        toast.success(
          res?.data?.message || `Table #${parsedNumber} updated.`
        );
      } else {
        const res = await API.post("/tables", payload);
        toast.success(res?.data?.message || `Table #${parsedNumber} added.`);
      }

      resetForm();
      await loadOccupancy();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save table."));
    } finally {
      setSavingTable(false);
    }
  };

  const handleDeleteTable = async (table) => {
    if (deletingId || savingTable || !table?._id) return;
    if (!window.confirm(`Delete Table #${table.tableNumber}?`)) return;

    setDeletingId(table._id);
    try {
      const res = await API.delete(`/tables/${table._id}`);
      toast.success(
        res?.data?.message || `Table #${table.tableNumber} deleted.`
      );
      if (editingTable?._id === table._id) resetForm();
      await loadOccupancy();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete table."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section
      className="admin-panel table-manager-panel"
      aria-label="Floor and Table Management"
    >
      <div className="panel-heading">
        <div>
          <span className="section-kicker">FLOOR OPERATIONS</span>
          <h2>
            <Armchair size={22} /> Live Table Occupancy & Setup
          </h2>
          <p>
            Monitor live table availability by slot and configure restaurant
            seating.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn secondary-btn"
          onClick={() => loadOccupancy()}
          disabled={loadingOccupancy}
        >
          <RefreshCw
            size={16}
            className={loadingOccupancy ? "spin-icon" : ""}
          />
          {loadingOccupancy ? "Refreshing…" : "Refresh floor"}
        </button>
      </div>

      {/* Add / Edit Table Form */}
      <div className="table-setup-card">
        <div className="table-setup-header">
          <span className="setup-badge">
            {editingTable
              ? `Editing Table #${editingTable.tableNumber}`
              : "Add New Table"}
          </span>
        </div>

        <form
          className="admin-filter-form table-crud-form"
          onSubmit={handleSaveTable}
        >
          <div className="filter-field">
            <label htmlFor="newTableNumber">Table number</label>
            <div className="input-with-icon">
              <Hash size={17} />
              <input
                id="newTableNumber"
                type="number"
                min="1"
                placeholder={suggestedNextNumber}
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
                disabled={savingTable}
              />
            </div>
          </div>

          <div className="filter-field">
            <label htmlFor="newTableCapacity">Seating capacity</label>
            <div className="input-with-icon">
              <Users size={17} />
              <input
                id="newTableCapacity"
                type="number"
                min="1"
                max="20"
                placeholder="2"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                disabled={savingTable}
              />
            </div>
          </div>

          <div className="filter-field">
            <label htmlFor="newTableZone">Seating zone</label>
            <div className="input-with-icon">
              <Layers size={17} />
              <select
                id="newTableZone"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                disabled={savingTable}
              >
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button
              type="submit"
              className="admin-btn primary-btn"
              disabled={savingTable}
            >
              {editingTable ? <Edit3 size={16} /> : <Plus size={16} />}
              {savingTable
                ? "Saving…"
                : editingTable
                ? "Update Table"
                : "Add Table"}
            </button>
            {editingTable && (
              <button
                type="button"
                className="admin-btn secondary-btn"
                onClick={resetForm}
                disabled={savingTable}
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Live Floor Toolbar */}
      <div className="floor-toolbar">
        <div className="floor-controls">
          <div className="floor-control">
            <CalendarDays size={16} />
            <input
              type="date"
              aria-label="Floor date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="floor-control">
            <Clock3 size={16} />
            <select
              aria-label="Floor time slot"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          <div className="floor-control">
            <Layers size={16} />
            <select
              aria-label="Filter by zone"
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
            >
              <option value="ALL">All Zones</option>
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        </div>

        {occupancyData && (
          <div className="floor-summary-pills">
            <span className="pill-total">
              Total: <strong>{occupancyData.totalTables}</strong>
            </span>
            <span className="pill-available">
              <CheckCircle2 size={14} /> Open:{" "}
              <strong>{occupancyData.availableCount}</strong>
            </span>
            <span className="pill-booked">
              <XCircle size={14} /> Booked:{" "}
              <strong>{occupancyData.bookedCount}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Visual Floor Grid */}
      {loadingOccupancy ? (
        <div className="admin-loading">
          <Spinner text="Loading floor layout..." />
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="admin-empty-state">
          <div className="empty-state-icon">
            <Armchair size={28} />
          </div>
          <h3>
            {tables.length === 0
              ? "No tables configured yet"
              : "No tables in this zone"}
          </h3>
          <p>
            {tables.length === 0
              ? "Use the form above to add your first restaurant table."
              : "Switch to All Zones or add a new table in this section."}
          </p>
        </div>
      ) : (
        <div className="floor-grid">
          {filteredTables.map((table) => {
            const isBooked = table.status === "BOOKED";
            const isBusy = deletingId === table._id || savingTable;

            return (
              <article
                key={table._id}
                className={`table-tile ${
                  isBooked ? "table-tile-booked" : "table-tile-available"
                }`}
              >
                <div className="table-tile-top">
                  <div className="table-title-wrap">
                    <span className="table-zone-tag">
                      {table.zone || "Main Hall"}
                    </span>
                    <h3>Table #{table.tableNumber}</h3>
                  </div>
                  <span
                    className={`tile-status ${isBooked ? "booked" : "available"}`}
                  >
                    <span className="tile-status-dot" />
                    {isBooked ? "Booked" : "Available"}
                  </span>
                </div>

                <div className="table-capacity-badge">
                  <Users size={15} />
                  <span>
                    Seats up to <strong>{table.capacity}</strong>{" "}
                    {table.capacity === 1 ? "guest" : "guests"}
                  </span>
                </div>

                {isBooked && table.reservation ? (
                  <div className="table-booking-info booked">
                    <strong>{table.reservation.guestName}</strong>
                    <span>
                      {table.reservation.guests} guests ·{" "}
                      {table.reservation.guestEmail}
                    </span>
                  </div>
                ) : (
                  <div className="table-booking-info empty">
                    <span>Open for online or walk-in guests</span>
                  </div>
                )}

                <div className="table-tile-actions">
                  <button
                    type="button"
                    className="tile-icon-btn"
                    onClick={() => startEditing(table)}
                    disabled={isBusy}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    className="tile-icon-btn danger"
                    onClick={() => handleDeleteTable(table)}
                    disabled={isBusy}
                  >
                    <Trash2 size={14} />{" "}
                    {deletingId === table._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}