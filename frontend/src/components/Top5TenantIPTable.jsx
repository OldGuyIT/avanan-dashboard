import { PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE",
  "#FF6699", "#FF4444", "#00B8D9", "#FFB347", "#B0E57C"
];

export default function Top5TenantIPTable({ entries }) {
  // Map: tenant -> { [ip]: count }
  const tenantIpCounts = {};

  entries.forEach(e => {
    if (!e.tenant) return;
    if (!tenantIpCounts[e.tenant]) tenantIpCounts[e.tenant] = {};
    // Count ip1
    if (e.ip1) {
      tenantIpCounts[e.tenant][e.ip1] = (tenantIpCounts[e.tenant][e.ip1] || 0) + 1;
    }
    // Optionally count ip2 as well:
    if (e.ip2) {
      tenantIpCounts[e.tenant][e.ip2] = (tenantIpCounts[e.tenant][e.ip2] || 0) + 1;
    }
  });

  // For each tenant, find their most frequent IP and its count
  const tenantTopIPs = Object.entries(tenantIpCounts).map(([tenant, ipMap]) => {
    const [topIp, topCount] = Object.entries(ipMap).sort((a, b) => b[1] - a[1])[0] || ["", 0];
    return { tenant, ip: topIp, count: topCount };
  });

  // Sort tenants by their top IP count, descending, and take top 5
  const top5 = tenantTopIPs
    .filter(t => t.ip && t.count > 1) // Only show if IP appears more than once
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Pie chart data
  const pieData = top5.map(row => ({
    name: row.tenant,
    value: row.count,
  }));

  return (
    <div className="table-scroll">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
        <PieChart width={180} height={180}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
          >
            {pieData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        <table className="custom-table pie-table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Most Frequent IP</th>
              <th>Entries</th>
            </tr>
          </thead>
          <tbody>
            {top5.map((row, i) => (
              <tr
                key={i}
                style={{
                  background: PIE_COLORS[i % PIE_COLORS.length],
                  color: "#111",
                  fontWeight: "bold"
                }}
              >
                <td>{row.tenant}</td>
                <td>{row.ip}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}