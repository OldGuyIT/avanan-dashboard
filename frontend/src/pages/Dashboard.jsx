import { useEffect, useState } from "react";
import Top5TenantTable from "../components/Top5TenantTable";
import Top5UserTable from "../components/Top5UserTable";
import Top5IPTable from "../components/Top5IPTable";
import Top5DomainTable from "../components/Top5DomainTable";
import Top5TenantIPTable from "../components/Top5TenantIPTable";
import Top5UserIPTable from "../components/Top5UserIPTable";

export default function Dashboard() {
  const [allEntries, setAllEntries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Dashboard";
    fetch("/api/all-entries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch all entries");
        return res.json();
      })
      .then(setAllEntries)
      .catch(() => setError("Could not load all entries."));
  }, []);

  return (
    <div className="dashboard-flex">
      <div className="dashboard-main">
        {/* First row: Tenants, Domains, Users */}
        <div className="dashboard-row">
          <section>
            <h2 className="section-title">Top 5 Tenants</h2>
            <Top5TenantTable entries={allEntries} />
          </section>
          <section>
            <h2 className="section-title">Top 5 Domains</h2>
            <Top5DomainTable entries={allEntries} />
          </section>
          <section>
            <h2 className="section-title">Top 5 Users</h2>
            <Top5UserTable entries={allEntries} />
          </section>
        </div>
        {/* Second row: IPs and another Top 5 */}
        <div className="dashboard-row">
          <section>
            <h2 className="section-title">Top 5 IPs w/ ISP</h2>
            <Top5IPTable entries={allEntries} />
          </section>
          <section>
            <h2 className="section-title">Top 5 Tenants by Most Frequent IP</h2>
            <Top5TenantIPTable entries={allEntries} />
          </section>
          <section>
            <h2 className="section-title">Top 5 Users by Most Frequent IP</h2>
            <Top5UserIPTable entries={allEntries} />
          </section>
        </div>
      </div>
    </div>
  );
}