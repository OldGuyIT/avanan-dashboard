import { PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE",
  "#FF6699", "#FF4444", "#00B8D9", "#FFB347", "#B0E57C"
];

export default function Top5IPTable({ entries }) {
  // Map IP to { count, isp }
  const ipStats = {};
  entries.forEach(e => {
    if (e.ip1) {
      if (!ipStats[e.ip1]) {
        ipStats[e.ip1] = { count: 0, isp: e.ip1_isp || "" };
      }
      ipStats[e.ip1].count += 1;
      // Optionally update ISP if not set
      if (!ipStats[e.ip1].isp && e.ip1_isp) ipStats[e.ip1].isp = e.ip1_isp;
    }
    if (e.ip2) {
      if (!ipStats[e.ip2]) {
        ipStats[e.ip2] = { count: 0, isp: e.ip2_isp || "" };
      }
      ipStats[e.ip2].count += 1;
      if (!ipStats[e.ip2].isp && e.ip2_isp) ipStats[e.ip2].isp = e.ip2_isp;
    }
  });

  const topIPs = Object.entries(ipStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const pieData = topIPs.map(([ip, stat]) => ({
    name: ip,
    value: stat.count,
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
              <th>IP Address</th>
              <th>ISP</th>
              <th>Entries</th>
            </tr>
          </thead>
          <tbody>
            {topIPs.map(([ip, stat], i) => (
              <tr
                key={i}
                style={{
                  background: PIE_COLORS[i % PIE_COLORS.length],
                  color: "#111",
                  fontWeight: "bold"
                }}
              >
                <td>{ip}</td>
                <td>{stat.isp}</td>
                <td>{stat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}