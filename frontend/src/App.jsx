import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import Dashboard from "./pages/Dashboard";
import NewEntryForm from "./pages/NewEntryForm";
import TenantDomainLists from "./pages/TenantDomainList";
import FullDatabaseList from "./pages/FullDatabaseList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SidebarLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="new-entry" element={<NewEntryForm />} />
          <Route path="tenant-domains" element={<TenantDomainLists />} />
          <Route path="full-table" element={<FullDatabaseList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
