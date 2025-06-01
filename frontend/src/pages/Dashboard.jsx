import { useEffect, useState } from "react";
import DashboardMapView from "../components/DashboardMapView";
import DashboardLastEntriesTable from "../components/DashboardLastEntriesTable";
import DashboardTop5TenantTable from "../components/DashboardTop5TenantTable";
import DashboardTop5UserTable from "../components/DashboardTop5UserTable";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Dashboard";
    fetch("/api/last-entries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entries");
        return res.json();
      })
      .then(setEntries)
      .catch(() => setError("Could not load entries."));

    fetch("/api/all-entries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch all entries");
        return res.json();
      })
      .then(setAllEntries)
      .catch(() => setError("Could not load all entries."));
  }, []);

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <div className="dashboard-flex">
        <div className="dashboard-main">
          <div className="dashboard-map-border">
            <DashboardMapView points={entries} />
          </div>
          <section>
            <h2 className="section-title">Recent Entries</h2>
            <DashboardLastEntriesTable entries={entries} />
          </section>
        </div>
        <div className="dashboard-sidebar">
          <section>
            <h2 className="section-title">Top 5 Tenants</h2>
            <DashboardTop5TenantTable entries={allEntries} />
          </section>
          <section>
            <h2 className="section-title">Top 5 Users</h2>
            <DashboardTop5UserTable entries={allEntries} />
          </section>
        </div>
      </div>
    </>
  );
}