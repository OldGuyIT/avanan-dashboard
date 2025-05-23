export default function DashboardMap({ entries }) {
  return (
    <div className="w-full h-64 bg-blue-200 rounded my-4 flex items-center justify-center">
      <p className="text-gray-700">
        [Map Placeholder: {entries.length} Entries]
      </p>
    </div>
  );
}
