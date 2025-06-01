import { useEffect } from "react";
import NewEntryFormTable from "../components/NewEntryFormTable";

export default function NewEntryForm() {
  useEffect(() => {
    document.title = "New Entry";
  }, []);
  return (
    <div className="main-container">
      <NewEntryFormTable />
    </div>
  );
}