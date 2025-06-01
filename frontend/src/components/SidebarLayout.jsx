import { Link, Outlet, useLocation } from "react-router-dom";

// Map routes to page titles
const pageTitles = {
  "/": "Dashboard",
  "/new-entry": "New Entry Form",
  "/tenant-domains": "Tenant / Domain List",
  "/full-table": "Full Database List",
  // Add more routes as needed
};

export default function SidebarLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Page";

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h2 className="sidebar-title">Menu</h2>
        <div className="sidebar-links">
          <Link className="sidebar-link" to="/">Dashboard</Link>
          <Link className="sidebar-link" to="/new-entry">New Entry</Link>
          <Link className="sidebar-link" to="/tenant-domains">Tenant List</Link>
          <Link className="sidebar-link" to="/full-table">View All</Link>
        </div>
      </nav>
      <div className="content-area">
        <div className="page-title-card">
        </div>
        <div className="main-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}