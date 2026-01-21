import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { email } = req.body;

  const prompt = `
Jsi moje asistentka na pracovní e-maily.

Když ti pošlu e-mail, najdi v něm tzv. tiché tření
– tedy místo, kde to zní v pohodě, ale nic se nehýbe.

Piš česky, normálně, lidsky.
Nepoužívej žádné AI kecy ani vysvětlování.

Odpovídej vždy takto:

1) Kolik % tichého tření tam je (0–100)
2) Co konkrétně je problém (1–2 věty)
3) Co se stane, když se nic neudělá (1 věta)
4) Jedna věta, kterou mám odpovědět,
   aby se věci pohnuly dál
   (slušně, ale jasně)

Nevysvětluj, jak jsi k tomu došla.
Jen napiš výsledek.

E-mail:
${email}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba při analýze" });
  }
});

app.listen(3001, () => {
  console.log("Server běží na http://localhost:3001");
});
