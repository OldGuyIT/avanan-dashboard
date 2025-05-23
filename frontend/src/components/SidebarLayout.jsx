import { Link, Outlet } from "react-router-dom";

export default function SidebarLayout() {
  return (
    <div className="flex h-screen bg-[#242424]">
      <nav className="w-72 flex flex-col items-center border-4 border-[#40E0D0] rounded-[3rem] m-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-[#40E0D0] underline">
          Menu
        </h2>
        <div className="flex flex-col gap-6 w-full items-start mt-4 px-10">
          <Link
            className="text-[#40E0D0] text-xl font-mono hover:underline ml-2"
            to="/"
          >
            Dashboard
          </Link>
          <Link
            className="text-[#40E0D0] text-xl font-mono hover:underline ml-2"
            to="/new-entry"
          >
            New Entry
          </Link>
          <Link
            className="text-[#40E0D0] text-xl font-mono hover:underline ml-2"
            to="/tenant-domains"
          >
            Tenant List
          </Link>
          <Link
            className="text-[#40E0D0] text-xl font-mono hover:underline ml-2"
            to="/full-table"
          >
            View All
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex flex-col">
        <header className="flex justify-end items-center p-4 border-b border-[#40E0D0]"></header>
        <main className="flex-1 flex items-center justify-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
