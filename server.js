import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// client GROQ
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// endpoint chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const userMsg = req.body.message || "";

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",     // ✔ model yang benar
      messages: [
        {
          role: "system",
          content: "Kamu adalah asisten AI yang ramah dan menjawab dalam bahasa Indonesia."
        },
        { role: "user", content: userMsg }
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Maaf, saya tidak menemukan jawaban.";

    res.json({ reply });

  } catch (err) {
    // Log detail error
    console.error("GROQ API ERROR:", err?.response?.data || err?.message || err);

    // Kasih respons ke front-end
    res.status(500).json({
      reply:
        "Error server: " +
        (err?.response?.data?.error?.message ||
         err?.message ||
         "Terjadi kesalahan tidak diketahui."),
    });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
