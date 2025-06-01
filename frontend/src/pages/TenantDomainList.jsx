import { useEffect } from "react";
import TenantDomainListTable from "../components/TenantDomainListTable";

export default function TenantDomainList() {
  useEffect(() => {
    document.title = "Tenant / Domain List";
  }, []);
  return (
    <div className="main-container">
      <TenantDomainListTable />
    </div>
  );
}