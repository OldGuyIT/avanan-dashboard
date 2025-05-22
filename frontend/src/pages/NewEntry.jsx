import { useState } from "react";

export default function NewEntry() {
  const [rawText, setRawText] = useState("");
  const [message, setMessage] = useState(null);
  const [lastEntry, setLastEntry] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Submit to your backend
    const res = await fetch("/api/new-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // You may need to parse rawText into the expected fields here!
      body: rawText,
    });

    if (res.ok) {
      setMessage("✅ Entry saved successfully!");
      setRawText("");

      // Fetch the latest entry
      const entriesRes = await fetch("/api/last-entries");
      const entries = await entriesRes.json();
      setLastEntry(entries[0]); // Most recent entry
    } else {
      setMessage("❌ Failed to save entry.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">New Avanan Alert Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste raw alert JSON here..."
          className="w-full h-48 p-3 border rounded  "
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
      {lastEntry && (
        <div className="mt-6 p-4 border rounded bg-gray-50 ">
          <h3 className="font-bold mb-2">Last Entry:</h3>
          <pre className="text-xs">{JSON.stringify(lastEntry, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}