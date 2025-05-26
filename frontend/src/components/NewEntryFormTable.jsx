export default function NewEntryFormTable({ entry }) {
  if (!entry) return null;
  return (
    <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#222",
          color: "#fff",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>Tenant</th>
            <th style={thStyle}>User Email</th>
            <th style={thStyle}>IP1</th>
            <th style={thStyle}>IP1 City</th>
            <th style={thStyle}>IP1 State</th>
            <th style={thStyle}>IP1 Country</th>
            <th style={thStyle}>IP1 ISP</th>
            <th style={thStyle}>IP2</th>
            <th style={thStyle}>IP2 City</th>
            <th style={thStyle}>IP2 State</th>
            <th style={thStyle}>IP2 Country</th>
            <th style={thStyle}>IP2 ISP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>{entry.timestamp}</td>
            <td style={tdStyle}>{entry.tenant}</td>
            <td style={tdStyle}>{entry.user_email || entry.email}</td>
            <td style={tdStyle}>{entry.ip1}</td>
            <td style={tdStyle}>{entry.ip1_city}</td>
            <td style={tdStyle}>{entry.ip1_state}</td>
            <td style={tdStyle}>{entry.ip1_country}</td>
            <td style={tdStyle}>{entry.ip1_isp}</td>
            <td style={tdStyle}>{entry.ip2}</td>
            <td style={tdStyle}>{entry.ip2_city}</td>
            <td style={tdStyle}>{entry.ip2_state}</td>
            <td style={tdStyle}>{entry.ip2_country}</td>
            <td style={tdStyle}>{entry.ip2_isp}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  borderBottom: "2px solid #064376",
  borderRight: "1px solid #064376",
  padding: "0.5rem",
  background: "#242424",
  textAlign: "center",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  color: "#064376",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "0.5rem",
  fontSize: "0.95rem",
  textAlign: "center",
  verticalAlign: "middle",
  borderRight: "1px solid #064376",
  color: "#fff",
};