import { useEffect, useState } from "react";

// Table page sizes and column definitions
const PAGE_SIZES = [25, 50, 100];
const COLUMNS = [
  { key: "timestamp", label: <>Date/Time</> },
  { key: "tenant", label: <>Tenant</> },
  { key: "user_email", label: <>User Email</> },
  { key: "ip1", label: <>IP Address<br />1</> },
  { key: "ip1_city", label: <>City<br />1</> },
  { key: "ip1_state", label: <>State<br />1</> },
  { key: "ip1_country", label: <>Country<br />1</> },
  { key: "ip1_isp", label: <>ISP<br />1</> },
  { key: "ip2", label: <>IP Address<br />2</> },
  { key: "ip2_city", label: <>City<br />2</> },
  { key: "ip2_state", label: <>State<br />2</> },
  { key: "ip2_country", label: <>Country<br />2</> },
  { key: "ip2_isp", label: <>ISP<br />2</> },
];

// Helper to get column label as string for CSV export
function getColLabel(col) {
  if (typeof col.label === "string") return col.label;
  if (col.label.props && col.label.props.children) {
    const children = col.label.props.children;
    if (Array.isArray(children)) {
      return children.map(child =>
        typeof child === "string" ? child : ""
      ).join("");
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

  useEffect(() => {
    fetch("/api/all-entries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entries");
        return res.json();
      })
      .then(setEntries)
      .catch(() => setError("Could not load entries."));
  }, []);

  const sorted = [...entries].sort((a, b) => {
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
        COLUMNS.map(col => `"${getColLabel(col)}"`).join(","),
        ...data.map(row =>
          COLUMNS.map(col => `"${(row[col.key] ?? "").toString().replace(/"/g, '""')}"`).join(",")
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
    <div style={{ width: "100%" }}>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={handleDownloadCSV}
          style={{
            background: "#064376",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Download CSV
        </button>
        <label>
          Show{" "}
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(0); }}>
            {PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
          </select>{" "}
          entries
        </label>
        <span style={{ marginLeft: "auto" }}>
          Page {page + 1} of {pageCount}
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="custom-table">
          <thead>
            <tr>
              {COLUMNS.map((col, idx) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ cursor: "pointer" }}
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
                    {row[col.key] !== undefined && row[col.key] !== null
                      ? String(row[col.key])
                      : ""}
                  </td>
                ))}
                <td>
                  <button
                    style={{
                      background: "#c00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.25rem 0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemove(row.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Back
        </button>
        <button disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}