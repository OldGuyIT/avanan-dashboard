import React, { useEffect, useState } from "react";

export default function TenantDomainListListTable() {
  const [domains, setDomains] = useState([]);
  const [form, setForm] = useState({ domain: "", tenant_name: "" });

  // Fetch domains on mount
  useEffect(() => {
    fetch("/api/tenant-domains")
      .then(res => res.json())
      .then(setDomains);
  }, []);

  // Handle form input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update a domain
  const handleSubmit = async e => {
    e.preventDefault();
    await fetch("/api/tenant-domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ domain: "", tenant_name: "" });
    // Refresh list
    fetch("/api/tenant-domains")
      .then(res => res.json())
      .then(setDomains);
  };

  // Delete a domain
  const handleDelete = async domain => {
    await fetch("/api/tenant-domains", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });
    setDomains(domains.filter(d => d.domain !== domain));
  };

  // CSV upload handler
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const rows = text.trim().split("\n").slice(1); // skip header
    for (const row of rows) {
      const [tenant_name, domain] = row.split(",");
      if (tenant_name && domain) {
        await fetch("/api/tenant-domains", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenant_name: tenant_name.trim(), domain: domain.trim() }),
        });
      }
    }
    // Refresh list
    fetch("/api/tenant-domains")
      .then(res => res.json())
      .then(setDomains);
    alert("Upload complete!");
  };

  // CSV template download handler
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

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#222",
          color: "#fff",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "2px solid #064376",
                borderRight: "1px solid #064376",
                padding: "0.5rem",
                background: "#242424",
                textAlign: "center",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              Tenant Name
            </th>
            <th
              style={{
                borderBottom: "2px solid #064376",
                borderRight: "1px solid #064376",
                padding: "0.5rem",
                background: "#242424",
                textAlign: "center",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              Domain
            </th>
            <th
              style={{
                borderBottom: "2px solid #064376",
                padding: "0.5rem",
                background: "#242424",
                textAlign: "center",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {domains.map(d => (
            <tr key={d.domain} style={{ borderBottom: "1px solid #064376" }}>
              <td
                style={{
                  padding: "0.5rem",
                  fontSize: "0.95rem",
                  textAlign: "center",
                  verticalAlign: "middle",
                  borderRight: "1px solid #064376",
                }}
              >
                {d.tenant_name}
              </td>
              <td
                style={{
                  padding: "0.5rem",
                  fontSize: "0.95rem",
                  textAlign: "center",
                  verticalAlign: "middle",
                  borderRight: "1px solid #064376",
                }}
              >
                {d.domain}
              </td>
              <td
                style={{
                  padding: "0.5rem",
                  fontSize: "0.95rem",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                <button onClick={() => handleDelete(d.domain)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}