export default function EntryTable({ entries }) {
  return (
    <div className="overflow-auto mt-4">
      <table className="min-w-full text-sm text-left border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">Tenant</th>
            <th className="px-4 py-2">User Email</th>
            <th className="px-4 py-2">IP1</th>
            <th className="px-4 py-2">IP2</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
              <td className="px-4 py-2">{entry[1]}</td>
              <td className="px-4 py-2">{entry[2]}</td>
              <td className="px-4 py-2">{entry[3]}</td>
              <td className="px-4 py-2">{entry[4]}</td>
              <td className="px-4 py-2">{entry[9]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
