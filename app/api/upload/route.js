import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import epubParser from "epub-parser";

export const runtime = "nodejs"; // REQUIRED for pdf-parse

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let text = "";

    // ---- PDF ----
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      try {
        const pdfData = await pdf(buffer);
        text = pdfData.text;
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return NextResponse.json(
          { error: "Failed to parse PDF file" },
          { status: 400 }
        );
      }

    // ---- EPUB ----
    } else if (
      fileType === "application/epub+zip" || 
      fileType === "application/epub" ||
      fileName.endsWith(".epub")
    ) {
      try {
        const epub = await epubParser.parse(buffer);
        
        // Check if epub has chapters and extract text
        if (epub && epub.chapters && Array.isArray(epub.chapters)) {
          text = epub.chapters
            .map(ch => {
              // Handle different chapter formats
              if (typeof ch === 'string') return ch;
              if (ch.text) return ch.text;
              if (ch.content) return ch.content;
              return '';
            })
            .filter(t => t && t.trim().length > 0)
            .join("\n");
        } else if (epub && epub.text) {
          // Some parsers return text directly
          text = epub.text;
        } else {
          throw new Error("EPUB structure not recognized");
        }
      } catch (epubError) {
        console.error("EPUB parsing error:", epubError);
        return NextResponse.json(
          { error: `Failed to parse EPUB file: ${epubError.message}` },
          { status: 400 }
        );
      }

    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Upload PDF or EPUB." },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No readable text found in file" },
        { status: 400 }
      );
    }

    // ---- LIMIT SIZE (important for OpenAI) ----
    const trimmedText = text.slice(0, 4000);

    // ---- OPENAI TTS ----
    const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: trimmedText,
        voice: "alloy",
        response_format: "mp3",
      }),
    });

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      console.error("TTS ERROR:", errText);
      return NextResponse.json(
        { error: "Text-to-speech failed" },
        { status: 500 }
      );
    }

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    const base64Audio = audioBuffer.toString("base64");
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    return NextResponse.json({ audioUrl });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
