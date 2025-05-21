import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import DarkModeToggle from "./components/DarkModeToggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NewEntryForm from "./pages/NewEntryForm";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/last-entries")
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Sidebar />
        <div className="flex-1 p-4 relative">
          {/* Global dark mode toggle in top-right */}
          <div className="absolute top-4 right-4 z-10">
            <DarkModeToggle />
          </div>

          <Routes>
            <Route path="/" element={<Dashboard entries={entries} />} />
            <Route path="/new-entry" element={<NewEntryForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
// This is the main entry point of the React application. It sets up the router and renders the sidebar, dark mode toggle, and the main content area.
// The `useEffect` hook fetches the last entries from the API when the component mounts and stores them in the state.