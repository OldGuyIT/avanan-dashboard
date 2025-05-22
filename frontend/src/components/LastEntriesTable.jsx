export default function LastEntriesTable({ entries }) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border-2 border-[#40E0D0] text-sm rounded">
        <thead>
          <tr>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">Timestamp</th>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">Tenant</th>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">User Email</th>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">IP1</th>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">IP1 City</th>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">IP1 Country</th>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">IP2</th>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">IP2 City</th>
            <th className="border border-[#40E0D0] px-2 py-1 text-[#40E0D0]">IP2 Country</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i}>
              <td className="border border-[#40E0D0] px-2 py-1">{e.timestamp}</td>
              <td className="border border-[#40E0D0] px-2 py-1">{e.tenant}</td>
              <td className="border border-[#40E0D0] px-2 py-1">{e.user_email}</td>
              <td className="border border-[#40E0D0] px-2 py-1">{e.ip1}</td>
              <td className="border border-[#40E0D0] px-2 py-1">{e.ip1_city}</td>
              <td className="border border-[#40E0D0] px-2 py-1">{e.ip1_country}</td>
              <td className="border border-[#40E0D0] px-2 py-1">{e.ip2}</td>
              <td className="border border-[#40E0D0] px-2 py-1">{e.ip2_city}</td>
              <td className="border border-[#40E0D0] px-2 py-1">{e.ip2_country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}