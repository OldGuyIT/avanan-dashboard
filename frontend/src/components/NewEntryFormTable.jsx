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

export default function NewEntryFormTable({ onEntrySaved }) {
  const [rawText, setRawText] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle form submission: parse and send to backend
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
        if (onEntrySaved) onEntrySaved(parsed);
      } else if (res.status === 409) {
        setError("❌ Failed to save entry. Reason: Duplicate.");
      } else {
        const errData = await res.json();
        setError(errData.message || "❌ Failed to save entry.");
      }
    } catch (err) {
      setError("❌ Failed to save entry. Reason: (network error).");
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
    </div>
  );
}