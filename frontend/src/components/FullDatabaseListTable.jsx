import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

// Table page sizes and column definitions
const PAGE_SIZES = [25, 50, 100];
const COLUMNS = [
  { key: "timestamp", label: <>Date / Time<br />&nbsp;</> },
  { key: "tenant", label: <>Tenant<br />&nbsp;</> },
  { key: "user_email", label: <>User Email<br />&nbsp;</> },
  { key: "ip1", label: <>IP 1 <br />Address</> },
  { key: "ip1_city_state", label: <>IP 1 <br />City, State</> },
  { key: "ip1_country", label: <>IP 1 <br />Country</> },
  { key: "ip1_isp", label: <>IP 1 <br />ISP</> },
  { key: "ip2", label: <>IP 2 <br />Address</> },
  { key: "ip2_city_state", label: <>IP 2 <br />City, State</> },
  { key: "ip2_country", label: <>IP 2 <br />Country</> },
  { key: "ip2_isp", label: <>IP 2 <br />ISP</> },
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

// Dropdown filter for unique values in a column, with special handling for city/state
function SelectColumnFilter({ column, table }) {
  const columnId = column.id;
  const options = useMemo(() => {
    const opts = new Set();
    table.getPreFilteredRowModel().rows.forEach(row => {
      if (columnId === "ip1_city_state" || columnId === "ip2_city_state") {
        const prefix = columnId.split('_')[0];
        const city = row.original[`${prefix}_city`] || "";
        const state = row.original[`${prefix}_state`] || "";
        const combined = [city, state].filter(Boolean).join(", ");
        if (combined) opts.add(combined);
      } else {
        const value = row.getValue(columnId);
        if (value) opts.add(value);
      }
    });
    return Array.from(opts).sort();
  }, [columnId, table]);
  return (
    <select
      className="select select-xs select-bordered w-full"
      value={column.getFilterValue() || ""}
      onChange={e => column.setFilterValue(e.target.value || undefined)}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Custom filter for city/state combined columns
function cityStateFilterFn(row, columnId, filterValue) {
  const prefix = columnId.split('_')[0]; // "ip1" or "ip2"
  const city = row.original[`${prefix}_city`] || "";
  const state = row.original[`${prefix}_state`] || "";
  const combined = [city, state].filter(Boolean).join(", ").toLowerCase();
  return combined.includes((filterValue || "").toLowerCase());
}

export default function FullDatabaseListTable() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(0);
  const [uploadFile, setUploadFile] = useState(null);

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

  // react-table columns
  const columns = useMemo(
    () =>
      COLUMNS.map((col) => {
        // Use custom filter for city/state columns
        if (col.key === "ip1_city_state" || col.key === "ip2_city_state") {
          return {
            accessorKey: col.key,
            header: col.label,
            cell: info =>
              `${info.row.original[`${col.key.split('_')[0]}_city`] || ""}${
                info.row.original[`${col.key.split('_')[0]}_city`] &&
                info.row.original[`${col.key.split('_')[0]}_state`]
                  ? ", "
                  : ""
              }${info.row.original[`${col.key.split('_')[0]}_state`] || ""}`,
            Filter: SelectColumnFilter,
            filterFn: "cityStateFilterFn",
          };
        }
        // Default for other columns
        return {
          accessorKey: col.key,
          header: col.label,
          cell: info => info.getValue() ?? "",
          Filter: SelectColumnFilter,
          filterFn: "equalsString",
        };
      }),
    []
  );

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: { cityStateFilterFn },
    state: {
      pagination: { pageIndex: page, pageSize },
    },
    onPaginationChange: updater => {
      if (typeof updater === "function") {
        const next = updater({ pageIndex: page, pageSize });
        setPage(next.pageIndex);
        setPageSize(next.pageSize);
      } else {
        setPage(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    manualPagination: false,
    enableMultiSort: true,
  });

  // Pagination logic
  const pagedRows = table.getRowModel().rows.slice(
    page * pageSize,
    (page + 1) * pageSize
  );
  const pageCount = Math.ceil(table.getRowModel().rows.length / pageSize);

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

  function handleDownloadTemplate() {
    const headers = [
      "timestamp", "tenant", "user_email",
      "ip1", "ip1_city", "ip1_state", "ip1_country", "ip1_isp",
      "ip2", "ip2_city", "ip2_state", "ip2_country", "ip2_isp"
    ];
    const csv = headers.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "avanan-upload-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e) {
    setUploadFile(e.target.files[0]);
  }

  async function handleUploadCSV() {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("file", uploadFile);
    const res = await fetch("/api/upload-csv", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      alert("Upload successful!");
      // Optionally refresh table data here
    } else {
      alert("Upload failed.");
    }
  }

  return (
    <div className="main-container" style={{ marginTop: "2em" }}>
      {error && <div className="error-message">{error}</div>}

      <button onClick={handleDownloadCSV} className="btn">
        Download CSV
      </button>
      <button onClick={handleDownloadTemplate} className="btn">
        Download Template
      </button>
      

      {/* Table */}
      <div className="table-scroll">
        <table className="custom-table auto-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: " ▲",
                        desc: " ▼",
                      }[header.column.getIsSorted()] ?? ""}
                    </div>
                    <div>
                      {header.column.columnDef.Filter ? (
                        <header.column.columnDef.Filter
                          column={header.column}
                          table={table}
                        />
                      ) : null}
                    </div>
                  </th>
                ))}
                <th></th>
              </tr>
            ))}
          </thead>
          <tbody>
            {pagedRows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemove(row.original.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pagedRows.length === 0 && (
          <div className="no-entries-message">
            No entries found.
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
        <span className="table-page-info" style={{ color: "#fff" }}>
          Page {page + 1} of {pageCount}
        </span>
      </div>
    </div>
  );
}