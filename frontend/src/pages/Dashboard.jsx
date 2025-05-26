// Dashboard.jsx
// Main dashboard page: shows a map of recent entries and a table of the latest alerts.

import { useEffect, useState } from "react";
import DashboardMapView from "../components/DashboardMapView";
import DashboardLastEntriesTable from "../components/DashboardLastEntriesTable";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);

  // Fetch the most recent entries from the backend on mount
  useEffect(() => {
    fetch("/api/last-entries")
      .then((res) => res.json())
      .then(setEntries);
  }, []);

  return (
    <>
      {/* Map view of recent entries */}
      <div className="dashboard-map">
        <DashboardMapView points={entries} />
      </div>
      {/* Table of last entries */}
      <DashboardLastEntriesTable entries={entries} />
    </>
  );
}