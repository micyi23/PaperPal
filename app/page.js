"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please upload a PDF");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.text) {
        setText(data.text);
      } else {
        alert("PDF processing failed");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const speakText = () => {
    if (!text) return alert("No text to read");

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 gap-6">
      <h1 className="text-4xl font-bold">PaperPal – PDF to Speech</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Upload & Extract"}
      </button>

      {text && (
        <>
          <button
            onClick={speakText}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            🔊 Play Audio
          </button>

          <div className="mt-6 max-w-3xl whitespace-pre-wrap border p-4 rounded">
            {text}
          </div>
        </>
      )}
    </main>
  );
}
