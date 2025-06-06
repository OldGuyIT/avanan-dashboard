import { useEffect, useState, useCallback } from "react";
import NewEntryFormTable from "../components/NewEntryFormTable";
import DashboardMapView from "../components/MapView";
import LastEntriesTable from "../components/LastEntriesTable";

export default function NewEntryForm() {
  const [entries, setEntries] = useState([]);
  const [latestEntryId, setLatestEntryId] = useState(null);

  // Fetch last 5 entries
  const refreshEntries = useCallback(() => {
    fetch("/api/last-entries?limit=5")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entries");
        return res.json();
      })
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  useEffect(() => {
    document.title = "New Entry";
    refreshEntries();
  }, [refreshEntries]);

  // Handler after successful entry
  const handleEntrySaved = (entry) => {
    setLatestEntryId(entry.id || entry.timestamp);
    refreshEntries();
  };

  return (
    <div className="main-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="entry-form-center" style={{ width: "100%", maxWidth: 700 }}>
        <NewEntryFormTable onEntrySaved={handleEntrySaved} />
      </div>
      <div style={{ width: "100%", marginTop: "0em" }}>
        <LastEntriesTable entries={entries} highlightId={latestEntryId} />
      </div>
      <div className="dashboard-map-border" style={{ marginTop: "2em", width: "100%", maxWidth: 700 }}>
        <DashboardMapView points={entries} clustering={false} />
      </div>
    </div>
  );
}