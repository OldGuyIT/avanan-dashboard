import { PieChart, Pie, Cell, Legend } from "recharts";

const PIE_COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE",
  "#FF6699", "#FF4444", "#00B8D9", "#FFB347", "#B0E57C"
];

export default function DashboardTop10TenantTable({ entries }) {
  // Count tenants
  const counts = {};
  entries.forEach(e => {
    if (!e.tenant) return;
    counts[e.tenant] = (counts[e.tenant] || 0) + 1;
  });
  const topTenants = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Prepare data for recharts
  const pieData = topTenants.map(([tenant, count]) => ({
    name: tenant,
    value: count,
  }));

  return (
    <div className="table-scroll">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          justifyContent: "center"
        }}
      >
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
              <th>Entries</th>
            </tr>
          </thead>
          <tbody>
            {topTenants.map(([tenant, count], i) => (
              <tr
                key={i}
                className="pie-table-row"
                style={{
                  background: PIE_COLORS[i % PIE_COLORS.length],
                  color: "#111",
                  fontWeight: "bold"
                }}
              >
                <td>{tenant}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}