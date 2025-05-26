import { useState } from "react";
import NewEntryFormTable from "../components/NewEntryFormTable";

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
    /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) || // IPv4
    /^[a-fA-F0-9:]+$/.test(ip)            // IPv6 (shortened or full)
  );

  const ip1 = ipMatches[0] || "";
  const ip2 = ipMatches[1] || "";

  const tenant = email.split("@")[1] || "";

  return {
    timestamp,
    tenant,
    email,
    ip1,
    ip2,
  };
}

export default function NewEntryForm() {
  const [rawText, setRawText] = useState("");
  const [message, setMessage] = useState(null);
  const [lastEntry, setLastEntry] = useState(null);

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
    const parsed = parseEntry(rawText);

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
      setMessage("❌ Failed to save entry.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="main-container">
        {/* New Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-0">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste the Avanan Alert text here..."
            className="text-lg resize-vertical"
            style={{
              display: "block",
              fontFamily: "monospace",
              fontSize: "1.1rem",
              width: "20rem",
              height: "20rem",
              minHeight: "10rem",
              minWidth: "10rem",
              marginBottom: "1rem",
            }}
          />
          <button
            type="submit"
            className="bg-cyan-600 text-white px-6 py-2 hover:bg-cyan-700 text-lg"
            style={{ display: "block" }}
          >
            Submit
          </button>
          {message && <p className="mt-2 text-lg">{message}</p>}
        </form>
      </div>
      {/* Last Entry sub-container: shows the most recently added entry */}
      {lastEntry && (
        <div className="sub-container">
          <h3 className="font-bold text-xl mb-4 ">Last Entry:</h3>
          <NewEntryFormTable entry={lastEntry} />
        </div>
      )}
    </div>
  );
}
