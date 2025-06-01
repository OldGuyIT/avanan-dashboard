import React, { useEffect, useState } from "react";

export default function TenantDomainLists() {
  return (
    <div>
      <TenantDomainListTable />
    </div>
  );
}

function TenantDomainListTable() {
  const [domains, setDomains] = useState([]);
  const [form, setForm] = useState({ domain: "", tenant_name: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  // Fetch domains on mount
  useEffect(() => {
    document.title = "Tenant / Domain List";
    fetch("/api/tenant-domains")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch domains");
        return res.json();
      })
      .then(setDomains)
      .catch(() => setError("Network error: Could not load tenant/domain list."));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update a domain
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUpdateStatus(null);
    try {
      const res = await fetch("/api/tenant-domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add/update domain");
      setForm({ domain: "", tenant_name: "" });
      setSuccess("Tenant list updated successfully!");
      // Refresh list
      const listRes = await fetch("/api/tenant-domains");
      if (!listRes.ok) throw new Error("Failed to refresh list");
      setDomains(await listRes.json());
    } catch (err) {
      setError("Network error: Unable to add/update tenant/domain.");
    }
  };

  // Delete a domain
  const handleDelete = async (domain) => {
    setError(null);
    setSuccess(null);
    setUpdateStatus(null);
    try {
      const res = await fetch("/api/tenant-domains", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      if (!res.ok) throw new Error("Failed to delete domain");
      setDomains(domains.filter((d) => d.domain !== domain));
      setSuccess("Tenant/domain removed successfully!");
    } catch (err) {
      setError(`Unable to delete domain: ${err.message || "Network error"}`);
    }
  };

  // CSV upload handler: Reads a CSV file and adds each tenant/domain pair to the backend
  const handleCSVUpload = async (e) => {
    setError(null);
    setSuccess(null);
    setUpdateStatus(null);
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const rows = text.trim().split("\n").slice(1); // skip header
      for (const [i, row] of rows.entries()) {
        const [tenant_name, domain] = row.split(",");
        if (!tenant_name || !domain) {
          throw new Error(
            `Error with CSV file upload: Bad field or comma placement on line ${i + 2}`
          );
        }
        const res = await fetch("/api/tenant-domains", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenant_name: tenant_name.trim(),
            domain: domain.trim(),
          }),
        });
        if (!res.ok) throw new Error("Failed to upload CSV row");
      }
      // Refresh list
      const listRes = await fetch("/api/tenant-domains");
      if (!listRes.ok) throw new Error("Failed to refresh list");
      setDomains(await listRes.json());
      setSuccess("CSV has been uploaded successfully!");
    } catch (err) {
      setError(err.message || "Network error: Failed to upload CSV.");
    }
  };

  // CSV template download handler: Provides a blank CSV template for user download
  const handleDownloadTemplate = () => {
    const csv = "tenant_name,domain\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tenant_domains_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle tenant/domain update: Calls the backend to update all tenants/domains
  const handleUpdateTenants = async () => {
    setUpdateStatus(null);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/update-tenants", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setUpdateStatus(`✅ All tenants updated successfully! (${data.updated} entries)`);
      } else {
        setUpdateStatus(`❌ Error updating tenants: ${data.message}`);
      }
    } catch (err) {
      setUpdateStatus("❌ Network error while updating tenants.");
    }
  };

  return (
    <div>
      {/* Center only the Add/Update Form */}
      <div className="entry-form-center">
        {/* Add/Update Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            gap: "1rem",
          }}
        >
          <input
            name="tenant_name"
            value={form.tenant_name}
            onChange={handleChange}
            placeholder="Tenant Name"
            required
            style={{ color: "#fff", background: "#222", border: "1px solid #444", borderRadius: "4px", padding: ".5em" }}
          />
          <input
            name="domain"
            value={form.domain}
            onChange={handleChange}
            placeholder="Domain"
            required
            style={{ color: "#fff", background: "#222", border: "1px solid #444", borderRadius: "4px", padding: ".5em" }}
          />
          <button type="submit" className="btn">Add/Update</button>
        </form>
        {/* Centered feedback messages below the form */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {updateStatus && (
          <div className={updateStatus.startsWith("✅") ? "success-message" : "error-message"}>
            {updateStatus}
          </div>
        )}
      </div>

      {/* CSV Template Download and Upload */}
      <div
        style={{
          alignItems: "center",
          gap: "1rem"
        }}
      >
        <button onClick={handleUpdateTenants} className="btn">
          Update All Tenants
        </button>
        <button onClick={handleDownloadTemplate} className="btn">
          Download CSV Template
        </button>
        <br></br>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          style={{
            color: "#fff",
            padding: "0.5em"
          }}
        />
      </div>

      {/* Tenant/Domain Table */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>Tenant Name</th>
            <th>Domain</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {domains.map((d, i) => (
            <tr key={i}>
              <td>{d.tenant_name}</td>
              <td>{d.domain}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(d.domain)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}