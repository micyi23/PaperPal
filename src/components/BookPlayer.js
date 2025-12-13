"use client";
import { useState } from "react";

export default function BookPlayer() {
  const [bookState, setBookState] = useState({
    status: "idle",
    title: "",
    chapters: []
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBookState({ status: "processing", title: file.name, chapters: [] });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/convert", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setBookState({ status: "ready", title: data.title, chapters: data.chapters });
    } catch (err) {
      console.error(err);
      setBookState({ status: "idle", title: "", chapters: [] });
      alert(err.message);
    }
  };

  const groupedChapters = bookState.chapters.reduce((acc, chapter) => {
    const baseId = chapter.id.split("-")[0];
    if (!acc[baseId]) acc[baseId] = [];
    acc[baseId].push(chapter);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <input type="file" accept=".pdf,.epub" onChange={handleUpload} className="file:bg-blue-600 file:text-white file:px-4 file:py-2" />

      {bookState.status === "processing" && <p className="text-blue-400 mt-2">⏳ Processing book…</p>}
      {bookState.status === "ready" && <p className="text-green-400 mt-2">✅ Book ready: {bookState.title}</p>}

      {bookState.chapters.length > 0 && (
        <div className="flex flex-col gap-4 mt-4 w-full max-w-lg">
          {Object.entries(groupedChapters).map(([chapterId, chunks]) => (
            <div key={chapterId} className="p-4 bg-gray-800 rounded-md">
              <h3 className="font-semibold text-lg">{chunks[0].title.split("(")[0]}</h3>
              {chunks.map((chunk) => (
                <audio key={chunk.id} controls className="w-full mt-2">
                  <source src={chunk.audioUrl} type="audio/mpeg" />
                  Your browser does not support audio playback.
                </audio>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
