import { useState } from "react";

export default function NewEntryForm() {
  const [rawText, setRawText] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const res = await fetch("http://localhost:8000/api/parse-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: rawText }),
    });

    const result = await res.json();
    if (result.status === "success") {
      setMessage("✅ Entry saved successfully!");
      setRawText("");
    } else {
      setMessage("❌ Failed to process entry.");
    }
  };

  return (
    <div className="ml-64 p-4">
      <h2 className="text-xl font-bold mb-4">New Avanan Alert Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste raw alert text here..."
          className="w-full h-48 p-3 border rounded dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
