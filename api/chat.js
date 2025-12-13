import Groq from "groq-sdk";

export default async function handler(req, res) {
  // hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const userMsg = req.body?.message || "";

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah asisten AI yang ramah dan menjawab dalam bahasa Indonesia.",
        },
        { role: "user", content: userMsg },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Maaf, saya tidak menemukan jawaban.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("GROQ API ERROR:", err);

    return res.status(500).json({
      reply:
        "Error server: " +
        (err?.response?.data?.error?.message ||
          err?.message ||
          "Terjadi kesalahan tidak diketahui."),
    });
  }
}
