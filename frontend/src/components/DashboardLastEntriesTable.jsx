const rainbowColors = [
  "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"
];

export default function DashboardLastEntriesTable({ entries }) {
  if (!entries || entries.length === 0) return null;

  const lastEntries = [...entries]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 7);

  return (
    <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th></th>
            <th>Timestamp</th>
            <th>Tenant</th>
            <th>User Email</th>
            <th>IP1</th>
            <th>IP1 City</th>
            <th>IP1 State</th>
            <th>IP1 Country</th>
            <th>IP1 ISP</th>
            <th>IP2</th>
            <th>IP2 City</th>
            <th>IP2 State</th>
            <th>IP2 Country</th>
            <th>IP2 ISP</th>
          </tr>
        </thead>
        <tbody>
          {lastEntries.map((entry, i) => (
            <tr key={i}>
              <td style={{ borderRight: "none" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: rainbowColors[i % rainbowColors.length],
                    border: "2px solid #222",
                  }}
                  title={`Color for map line #${i + 1}`}
                ></span>
              </td>
              <td>{entry.timestamp}</td>
              <td>{entry.tenant}</td>
              <td>{entry.user_email || entry.email}</td>
              <td>{entry.ip1}</td>
              <td>{entry.ip1_city}</td>
              <td>{entry.ip1_state}</td>
              <td>{entry.ip1_country}</td>
              <td>{entry.ip1_isp}</td>
              <td>{entry.ip2}</td>
              <td>{entry.ip2_city}</td>
              <td>{entry.ip2_state}</td>
              <td>{entry.ip2_country}</td>
              <td>{entry.ip2_isp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}