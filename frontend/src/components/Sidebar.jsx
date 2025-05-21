export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 fixed">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li><a href="/" className="hover:underline">Dashboard</a></li>
        <li><a href="/new-entry" className="hover:underline">New Entry</a></li>
        <li><a href="/domain-tenant" className="hover:underline">Domain/Tenant</a></li>
        <li><a href="/database" className="hover:underline">Full Database</a></li>
      </ul>
    </div>
  );
}
