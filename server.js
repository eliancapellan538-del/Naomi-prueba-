
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
  res.json({ status: "online" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Escribe un mensaje para NAOMI."
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "Eres NAOMI, una asistente de IA amable e inteligente. " +
        "Habla en español y responde de forma clara y natural.",
      input: messages.slice(-10).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "")
      }))
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("Error de NAOMI:", error.message);
    res.status(500).json({
      error: "No pude responder. Revisa la configuración del servidor."
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`NAOMI está funcionando en el puerto ${port}`);
});
        
