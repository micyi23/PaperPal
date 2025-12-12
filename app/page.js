"use client";

import { useState } from "react";

export default function Page() {
  const [audioUrl, setAudioUrl] = useState(null);

  async function handleUpload(e) {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/convert", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setAudioUrl(data.audioUrl);
  }

  return (
    <main className="p-8">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="border p-2 rounded"
      />
      {audioUrl && (
        <audio controls src={audioUrl} className="mt-4 w-full" />
      )}
    </main>
  );
}


