import { useEffect, useState } from "react";

// Table page sizes and column definitions
const PAGE_SIZES = [25, 50, 100];
const COLUMNS = [
  { key: "timestamp", label: <>Date / Time</> },
  { key: "tenant", label: <>Tenant</> },
  { key: "user_email", label: <>User Email</> },
  { key: "ip1", label: <>IP Address<br></br> 1</> },
  { key: "ip1_city_state", label: <>IP 1 <br></br> City, State</> },
  { key: "ip1_country", label: <>Country<br></br> 1</> },
  { key: "ip1_isp", label: <>ISP 1</> },
  { key: "ip2", label: <>IP Address<br></br> 2</> },
  { key: "ip2_city_state", label: <>IP 2 <br></br> City, State</> },
  { key: "ip2_country", label: <>Country<br></br> 2</> },
  { key: "ip2_isp", label: <>ISP 2</> },
];

// Helper to get column label as string for CSV export
function getColLabel(col) {
  if (typeof col.label === "string") return col.label;
  if (col.label.props && col.label.props.children) {
    const children = col.label.props.children;
    if (Array.isArray(children)) {
      return children
        .map((child) => (typeof child === "string" ? child : ""))
        .join("");
    }
    return typeof children === "string" ? children : "";
  }
  return "";
}

export default function FullDatabaseListTable() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("timestamp");
  const [sortAsc, setSortAsc] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);
  const [tenantFilter, setTenantFilter] = useState("");

  useEffect(() => {
    document.title = "Full Database List";
    fetch("/api/all-entries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entries");
        return res.json();
      })
      .then(setEntries)
      .catch(() => setError("Could not load entries."));
  }, []);

  // Filtering, sorting, and paging logic
  const filtered = tenantFilter
    ? entries.filter((e) =>
        (e.tenant || "").toLowerCase().includes(tenantFilter.toLowerCase())
      )
    : entries;

  const sorted = [...filtered].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
    return 0;
  });

  const pageCount = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  function handleSort(key) {
    if (sortKey === key) setSortAsc((asc) => !asc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  async function handleDownloadCSV() {
    try {
      const res = await fetch("/api/all-entries");
      if (!res.ok) throw new Error("Failed to download CSV");
      const data = await res.json();
      const csvRows = [
        COLUMNS.map((col) => `"${getColLabel(col)}"`).join(","),
        ...data.map((row) =>
          COLUMNS.map((col) => {
            if (col.key === "ip1_city_state")
              return `"${(row.ip1_city || "")}, ${(row.ip1_state || "")}"`;
            if (col.key === "ip2_city_state")
              return `"${(row.ip2_city || "")}, ${(row.ip2_state || "")}"`;
            return `"${(row[col.key] ?? "").toString().replace(/"/g, '""')}"`;
          }).join(",")
        ),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "avanan-database.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download CSV.");
    }
  }

  async function handleRemove(id) {
    if (!window.confirm("Are you sure you want to remove this entry?")) return;
    try {
      const res = await fetch(`/api/entry/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove entry");
      setEntries((entries) => entries.filter((e) => e.id !== id));
    } catch (err) {
      setError("Failed to remove entry.");
    }
  }

  return (
    <div className="main-container">
      {error && <div className="error-message">{error}</div>}


        <button onClick={handleDownloadCSV} className="btn">
          Download CSV
        </button>
        <input
          type="text"
          placeholder="Filter by Tenant"
          value={tenantFilter}
          onChange={(e) => {
            setTenantFilter(e.target.value);
            setPage(0);
          }}
          className="tenant-filter-input"
          style={{
            color: "#fff",
            background: "#222",
            border: "1px solid #444",
            borderRadius: "4px",
            padding: ".5em",
          }}
        />
        <label style={{ color: "#fff" }}>
          Show{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            style={{
              color: "#fff",
              background: "#222",
              border: "1px solid #444",
              borderRadius: "4px",
              padding: ".5em",
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>{" "}
          entries
        </label>


      {/* Table */}
      <div className="table-scroll">
        <table className="custom-table auto-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="sortable"
                >
                  {col.label} {sortKey === col.key ? (sortAsc ? "▲" : "▼") : ""}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i}>
                {COLUMNS.map((col) => (
                  <td key={col.key}>
                    {col.key === "ip1_city_state"
                      ? `${row.ip1_city || ""}${row.ip1_city && row.ip1_state ? ", " : ""}${row.ip1_state || ""}`
                      : col.key === "ip2_city_state"
                      ? `${row.ip2_city || ""}${row.ip2_city && row.ip2_state ? ", " : ""}${row.ip2_state || ""}`
                      : row[col.key] !== undefined && row[col.key] !== null
                      ? String(row[col.key])
                      : ""}
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemove(row.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paged.length === 0 && (
          <div className="no-entries-message">
            No entries found for this tenant.
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="table-pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Back
        </button>
        <button
          disabled={page >= pageCount - 1}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
          <span className="table-page-info" style={{ color: "#fff" }}>
          Page {page + 1} of {pageCount}
        </span>
      </div>
    </div>
  );
}