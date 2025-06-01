import { useState } from "react";

// Helper to parse the raw Avanan alert text into structured fields
function parseEntry(text) {
  const emailMatch = text.match(/[\w.-]+@[\w.-]+/);
  const email = emailMatch ? emailMatch[0] : "";

  const timestampMatch = text.match(
    /Date(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
  );
  const timestamp = timestampMatch ? timestampMatch[1] : "";

  // Match anything inside parentheses, then trim and validate as IP
  const parenMatches = [...text.matchAll(/\(([^)]+)\)/g)].map(m => m[1].trim());

  // Optionally, filter for valid IPv4/IPv6 (basic check)
  const ipMatches = parenMatches.filter(ip =>
    /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) || /^[a-fA-F0-9:]+$/.test(ip)
  );

  return {
    timestamp,
    user_email: email,
    ip1: ipMatches[0] || "",
    ip2: ipMatches[1] || "",
  };
}

export default function NewEntryFormTable() {
  const [rawText, setRawText] = useState("");
  const [message, setMessage] = useState(null);
  const [lastEntry, setLastEntry] = useState(null);
  const [error, setError] = useState(null);

  // Helper to poll for enrichment after submitting a new entry
  async function fetchEnrichedEntry(id, maxAttempts = 10, delayMs = 1000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const res = await fetch(`/api/entry/${id}`);
      if (res.ok) {
        const entry = await res.json();
        // Check if enrichment fields are present (customize as needed)
        if (entry.ip1_country || entry.ip1_geo) {
          return entry;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return null;
  }

  // Handle form submission: parse, send to backend, and poll for enrichment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const parsed = parseEntry(rawText);

    try {
      const res = await fetch("/api/new-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (res.ok) {
        setMessage("✅ Entry saved successfully!");
        setRawText("");
        const createdEntry = await res.json();
        if (createdEntry && createdEntry.id) {
          // Poll for enrichment
          const enriched = await fetchEnrichedEntry(createdEntry.id);
          setLastEntry(enriched || createdEntry);
        } else {
          setLastEntry(null);
        }
      } else {
        const errData = await res.json();
        setError(errData.message || "❌ Failed to save entry.");
      }
    } catch (err) {
      setError("❌ Failed to save entry (network error).");
    }
  };

  return (
    <div>
      <div className="entry-form-center">
      <form onSubmit={handleSubmit}>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={6}
          cols={60}
          placeholder="Paste Avanan alert text here..."
        />
        <br />
        <button type="submit">Submit Entry</button>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
      {lastEntry && (
  <div className="sub-container" style={{ marginTop: "2em" }}>
    <h3>Last Entry</h3>
    <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
      <table className="custom-table auto-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Tenant</th>
            <th>User Email</th>
            <th>IP1</th>
            <th>IP1 City</th>
            <th>IP1 State</th>
            <th>IP1 Country</th>
            <th>IP1 ISP</th>
            <th>IP2</th>
            <th>IP2 City</th>
            <th>IP2 State</th>
            <th>IP2 Country</th>
            <th>IP2 ISP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{lastEntry.timestamp}</td>
            <td>{lastEntry.tenant}</td>
            <td>{lastEntry.user_email || lastEntry.email}</td>
            <td>{lastEntry.ip1}</td>
            <td>{lastEntry.ip1_city}</td>
            <td>{lastEntry.ip1_state}</td>
            <td>{lastEntry.ip1_country}</td>
            <td>{lastEntry.ip1_isp}</td>
            <td>{lastEntry.ip2}</td>
            <td>{lastEntry.ip2_city}</td>
            <td>{lastEntry.ip2_state}</td>
            <td>{lastEntry.ip2_country}</td>
            <td>{lastEntry.ip2_isp}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}
    </div>
  );
}