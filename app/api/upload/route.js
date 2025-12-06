import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Dynamic import to ensure pdf-parse only loads on server
    const pdf = (await import("pdf-parse")).default;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);

    return NextResponse.json({
      text: data.text,
      pages: data.numpages,
    });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF: " + error.message },
      { status: 500 }
    );
  }
}
