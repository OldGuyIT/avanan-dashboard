// Dashboard.jsx
// Main dashboard page: shows a map of recent entries and a table of the latest alerts.

import { useEffect, useState } from "react";
import DashboardMapView from "../components/DashboardMapView";
import DashboardLastEntriesTable from "../components/DashboardLastEntriesTable";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  // Fetch the most recent entries from the backend on mount
  useEffect(() => {
    fetch("/api/last-entries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entries");
        return res.json();
      })
      .then(setEntries)
      .catch(() => setError("Could not load entries."));
  }, []);

  return (
    <>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {/* Map view of recent entries */}
      <div className="dashboard-map">
        <DashboardMapView points={entries} />
      </div>
      {/* Table of last entries */}
      <DashboardLastEntriesTable entries={entries} />
    </>
  );
}