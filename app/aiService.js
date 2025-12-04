import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const summarizeText = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an assistant that summarizes study notes." },
        { role: "user", content: text }
      ],
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("AI Summarization error:", err);
    return "Error generating summary";
  }
};
