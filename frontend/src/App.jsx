import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import Dashboard from "./pages/Dashboard";
import NewEntry from "./pages/NewEntry";
import TenantDomains from "./pages/TenantDomains";
import FullTable from "./pages/FullTable";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="new-entry" element={<NewEntry />} />
          <Route path="tenant-domains" element={<TenantDomains />} />
          <Route path="full-table" element={<FullTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}