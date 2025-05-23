import { useState } from "react";
import EntryTable from "../components/EntryTable";

// Add a function to parse the raw text into the expected fields
// This function will extract the email, timestamp, IP addresses, and tenant from the raw text
// The regex patterns are designed to be strict and only match valid formats
// The email regex matches standard email formats
// The timestamp regex matches the format "DateYYYY-MM-DD HH:MM:SS"
// The IP regex matches both IPv4 and IPv6 formats
// The tenant is extracted from the email domain
// The function returns an object with the parsed fields
function parseEntry(text) {
  // Email extraction
  const emailMatch = text.match(/[\w.-]+@[\w.-]+/);
  const email = emailMatch ? emailMatch[0] : "";

  // Timestamp extraction
  const timestampMatch = text.match(
    /Date(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
  );
  const timestamp = timestampMatch ? timestampMatch[1] : "";

  // IP extraction (IPv4 or IPv6, strict)
  const ipRegex =
    /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[a-fA-F0-9]{1,4}:){2,7}[a-fA-F0-9]{1,4}\b/g;
  const ipMatches = [...text.matchAll(ipRegex)].map((m) => m[0]);

  const ip1 = ipMatches[0] || "";
  const ip2 = ipMatches[1] || "";

  // Tenant extraction (from email domain)
  const tenant = email.split("@")[1] || "";

  return {
    timestamp,
    tenant,
    email,
    ip1,
    ip2,
    latitude1,
    longitude1,
    latitude2,
    longitude2,
  };
}

export default function NewEntry() {
  const [rawText, setRawText] = useState("");
  const [message, setMessage] = useState(null);
  const [lastEntry, setLastEntry] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Parse the rawText into the expected fields
    const parsed = parseEntry(rawText);

    // Submit to your backend
    const res = await fetch("/api/new-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });

    if (res.ok) {
      setMessage("✅ Entry saved successfully!");
      setRawText("");
      setLastEntry(parsed); // Show the just-submitted entry
    } else {
      setMessage("❌ Failed to save entry.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-cyan-800">
        New Avanan Alert Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the Avanan Alert text here..."
          className="w-full h-48 p-4 border-2 border-cyan-400 rounded-lg text-lg"
        />
        <button
          type="submit"
          className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 text-lg"
        >
          Submit
        </button>
        {message && <p className="mt-2 text-lg">{message}</p>}
      </form>
      {lastEntry && (
        <div className="mt-8 p-6 border-4 border-cyan-400 bg-cyan-50 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl mb-4 text-cyan-700">Last Entry:</h3>
          <EntryTable entry={lastEntry} />
        </div>
      )}
    </div>
  );
}
