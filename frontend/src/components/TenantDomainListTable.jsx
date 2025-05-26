import React, { useEffect, useState } from "react";

export default function TenantDomainLists() {
  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Tenant / Domain List</h2>
      <TenantDomainListTable />
    </div>
  );
}

function TenantDomainListTable() {
  const [domains, setDomains] = useState([]);
  const [form, setForm] = useState({ domain: "", tenant_name: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch domains on mount
  useEffect(() => {
    fetch("/api/tenant-domains")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch domains");
        return res.json();
      })
      .then(setDomains)
      .catch(() => setError("Could not load tenant/domain list."));
  }, []);

  // Handle form input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update a domain
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/tenant-domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add/update domain");
      setForm({ domain: "", tenant_name: "" });
      setSuccess("Domain added/updated!");
      // Refresh list
      const listRes = await fetch("/api/tenant-domains");
      if (!listRes.ok) throw new Error("Failed to refresh list");
      setDomains(await listRes.json());
    } catch {
      setError("Failed to add/update domain.");
    }
  };

  // Delete a domain
  const handleDelete = async domain => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/tenant-domains", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      if (!res.ok) throw new Error("Failed to delete domain");
      setDomains(domains.filter(d => d.domain !== domain));
      setSuccess("Domain deleted!");
    } catch {
      setError("Failed to delete domain.");
    }
  };

  // CSV upload handler: Reads a CSV file and adds each tenant/domain pair to the backend
  const handleCSVUpload = async (e) => {
    setError(null);
    setSuccess(null);
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const rows = text.trim().split("\n").slice(1); // skip header
      for (const row of rows) {
        const [tenant_name, domain] = row.split(",");
        if (tenant_name && domain) {
          const res = await fetch("/api/tenant-domains", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tenant_name: tenant_name.trim(), domain: domain.trim() }),
          });
          if (!res.ok) throw new Error("Failed to upload CSV row");
        }
      }
      // Refresh list
      const listRes = await fetch("/api/tenant-domains");
      if (!listRes.ok) throw new Error("Failed to refresh list");
      setDomains(await listRes.json());
      setSuccess("Upload complete!");
    } catch {
      setError("Failed to upload CSV.");
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

  return (
    <div>
      {error && <div style={{ color: "red", marginBottom: "1em" }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: "1em" }}>{success}</div>}
      {/* Add/Update Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "1em",
          display: "flex",
          alignItems: "center",
          gap: "0.1rem",
        }}
      >
        <input
          name="tenant_name"
          value={form.tenant_name}
          onChange={handleChange}
          placeholder="Tenant Name"
          required
        />
        <input
          name="domain"
          value={form.domain}
          onChange={handleChange}
          placeholder="Domain"
          required
        />
        <button type="submit">Add/Update</button>
      </form>

      {/* CSV Template Download and Upload */}
      <div style={{ marginBottom: "1em", display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={handleDownloadTemplate}
          style={{
            background: "#064376",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Download CSV Template
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
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
                  style={{
                    background: "#c00",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                  }}
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