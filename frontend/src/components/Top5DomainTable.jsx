import { PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE",
  "#FF6699", "#FF4444", "#00B8D9", "#FFB347", "#B0E57C"
];

function extractDomain(email) {
  if (!email) return "";
  const parts = email.split("@");
  return parts.length === 2 ? parts[1].toLowerCase() : "";
}

export default function Top5DomainTable({ entries }) {
  // Count domains
  const domainCounts = {};
  entries.forEach(e => {
    const domain = extractDomain(e.user_email);
    if (domain) {
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    }
  });

  const topDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const pieData = topDomains.map(([domain, count]) => ({
    name: domain,
    value: count,
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
              <th>Domain</th>
              <th>Entries</th>
            </tr>
          </thead>
          <tbody>
            {topDomains.map(([domain, count], i) => (
              <tr
                key={i}
                style={{
                  background: PIE_COLORS[i % PIE_COLORS.length],
                  color: "#111",
                  fontWeight: "bold"
                }}
              >
                <td>{domain}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}