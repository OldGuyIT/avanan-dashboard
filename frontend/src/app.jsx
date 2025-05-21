import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import DarkModeToggle from "./components/DarkModeToggle";
import DashboardMap from "./components/DashboardMap";
import EntryTable from "./components/EntryTable";

export default function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/last-entries")
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Avanan Dashboard</h1>
          <DarkModeToggle />
        </div>
        <DashboardMap entries={entries} />
        <EntryTable entries={entries} />
      </div>
    </div>
  );
}
