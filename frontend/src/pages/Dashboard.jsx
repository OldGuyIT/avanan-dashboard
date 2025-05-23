import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import LastEntriesTable from "../components/LastEntriesTable";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("/api/last-entries")
      .then((res) => res.json())
      .then(setEntries);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="rounded-[4rem] border-4 border-[#40E0D0] p-8 bg-[#242424]">
        <h1 className="text-4xl font-bold mb-6 text-[#40E0D0] text-center">
          Dashboard
        </h1>
        <MapView points={entries} />
        <LastEntriesTable entries={entries} />
      </div>
    </div>
  );
}
