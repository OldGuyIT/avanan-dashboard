export default function NewEntryFormTable({ entry }) {
  if (!entry) return null;
  return (
    <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
      <table className="custom-table">
        <thead>
          <tr>
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
          <tr>
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
        </tbody>
      </table>
    </div>
  );
}