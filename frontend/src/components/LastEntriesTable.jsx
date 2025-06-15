import React from "react";

const rainbowColors = [
  "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"
];

export default function LastEntriesTable({ entries }) {
  if (!entries || entries.length === 0) return null;

  // Sort by entry_number descending (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.entry_number - a.entry_number);

  return (
    <div className="table-scroll">
      <table className="custom-table auto-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Tenant</th>
            <th>User Email</th>
            <th>IP 1</th>
            <th>IP 1 City, State</th>
            <th>IP 1 ISP</th>
            <th>IP 2</th>
            <th>IP 2 City, State</th>
            <th>IP 2 ISP</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry, idx) => (
            <React.Fragment key={entry.id || entry.timestamp}>
              <tr
                style={idx === 0 ? { background: "#222a44", fontWeight: "bold" } : {}}
              >
                <td>{entry.timestamp}</td>
                <td>{entry.tenant}</td>
                <td>{entry.user_email}</td>
                <td>{entry.ip1}</td>
                <td>{[entry.ip1_city, entry.ip1_state].filter(Boolean).join(", ")}</td>
                <td>{entry.ip1_isp}</td>
                <td>{entry.ip2}</td>
                <td>{[entry.ip2_city, entry.ip2_state].filter(Boolean).join(", ")}</td>
                <td>{entry.ip2_isp}</td>
              </tr>
              {idx === 0 && (
                <tr>
                  <td colSpan={9} style={{
                    height: "16px",
                    background: "transparent",
                    border: "none",
                    padding: 0
                  }} />
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}