import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files (index.html, script.js, etc.)
app.use(express.static("."));

// Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;


    if (!userMsg) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for Om Churi's portfolio. Answer briefly and professionally."
          },
          {
            role: "user",
            content: userMsg
          }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();

    // Debug log (optional)
    console.log("OpenAI response:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ No response from AI";

    res.json({ reply });


  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "❌ Server error. Try again later." });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
