import { useEffect } from "react";
import FullDatabaseListTable from "../components/FullDatabaseListTable";

export default function FullDatabaseList() {
  useEffect(() => {
    document.title = "Full Database List";
  }, []);
  return (
    <div className="main-container">
      <FullDatabaseListTable />
    </div>
  );
}