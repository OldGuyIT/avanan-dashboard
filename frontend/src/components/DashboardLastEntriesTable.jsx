const rainbowColors = [
  "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"
];

export default function DashboardLastEntriesTable({ entries }) {
  if (!entries || entries.length === 0) return null;

  const lastEntries = [...entries]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 7);

  return (
    <div className="table-scroll">
      <table className="custom-table auto-table">
        <thead>
          <tr>
            <th className="color-dot-cell"></th>
            <th>Tenant</th>
            <th>User Email</th>
            <th className="ip-col">IP 1</th>
            <th>IP 1 City, State</th>
            <th>IP 2</th>
            <th>IP 2 City, State</th>
          </tr>
        </thead>
        <tbody>
          {lastEntries.map((entry, i) => (
            <tr key={i}>
              <td className="color-dot-cell">
                <span className={`color-dot color-dot-${i % 7}`}></span>
              </td>
              <td>{entry.tenant}</td>
              <td>{entry.user_email}</td>
              <td className="ip-col">{entry.ip1}</td>
              <td>{entry.ip1_city}, {entry.ip1_state}</td>
              <td>{entry.ip2}</td>
              <td>{entry.ip2_city}, {entry.ip2_state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}