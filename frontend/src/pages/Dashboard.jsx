import { useEffect, useState } from "react";
import DashboardMapView from "../components/DashboardMapView";
import DashboardLastEntriesTable from "../components/DashboardLastEntriesTable";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("/api/last-entries")
      .then((res) => res.json())
      .then(setEntries);
  }, []);

  return (
    <>
      <div className="dashboard-map">
        <DashboardMapView points={entries} />
      </div>
      <DashboardLastEntriesTable entries={entries} />
    </>
  );
}