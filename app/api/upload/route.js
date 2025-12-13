import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import EPub from "epub";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();

    // ---------- PDF ----------
    if (name.endsWith(".pdf")) {
      const data = await pdf(buffer);

      return NextResponse.json({
        title: file.name,
        chapters: [
          {
            id: "chapter-1",
            title: "Full Document",
            text: data.text
          }
        ]
      });
    }

    // ---------- EPUB ----------
    if (name.endsWith(".epub")) {
      const epub = new EPub(buffer);
      await epub.parse();

      const chapters = [];

      for (const chapter of epub.flow) {
        const text = await new Promise((resolve, reject) => {
          epub.getChapter(chapter.id, (err, txt) => {
            if (err) reject(err);
            else resolve(txt.replace(/<[^>]+>/g, ""));
          });
        });

        chapters.push({
          id: chapter.id,
          title: chapter.title || "Chapter",
          text
        });
      }

      return NextResponse.json({
        title: epub.metadata.title || file.name,
        chapters
      });
    }

    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}

