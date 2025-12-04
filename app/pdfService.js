import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (err) {
    console.error("PDF parsing error:", err);
    return "";
  }
};
