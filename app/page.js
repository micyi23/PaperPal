"use client";

import { useState } from "react";
import { extractTextFromPDF } from "./pdfService";
import { summarizeText } from "./aiService";

export default function Home() {
  const [pdfText, setPdfText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const text = await extractTextFromPDF(arrayBuffer);
    setPdfText(text);
  };

  const handleSummarize = async () => {
    if (!pdfText) return;
    setLoading(true);
    const result = await summarizeText(pdfText);
    setSummary(result);
    setLoading(false);
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>PaperPal</h1>
      <p>Upload a PDF and see the extracted text below:</p>

      <input type="file" accept="application/pdf" onChange={handleFileUpload} />

      <div style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        {pdfText ? pdfText : "Your PDF text will appear here"}
      </div>

      <button onClick={handleSummarize} style={{ marginTop: 20 }}>
        {loading ? "Summarizing..." : "Generate Summary"}
      </button>

      {summary && (
        <div style={{ marginTop: 20, padding: 10, background: "#f0f0f0" }}>
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </main>
  );
}

