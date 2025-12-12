import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export const runtime = "edge"; // Vercel optimal

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract PDF text
    const pdfData = await pdf(buffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "PDF contains no readable text" },
        { status: 400 }
      );
    }

    // Convert to speech using OpenAI API
    const speechRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        input: text.slice(0, 4000), // TTS input length limit
        voice: "alloy",
        format: "mp3",
      }),
    });

    if (!speechRes.ok) {
      return NextResponse.json(
        { error: "TTS conversion failed" },
        { status: 500 }
      );
    }

    // Convert response to audio file
    const audioBuffer = Buffer.from(await speechRes.arrayBuffer());

    // Convert buffer → base64 (simple for now)
    const base64 = audioBuffer.toString("base64");
    const audioUrl = `data:audio/mp3;base64,${base64}`;

    return NextResponse.json({ audioUrl });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Server error while converting PDF" },
      { status: 500 }
    );
  }
}


