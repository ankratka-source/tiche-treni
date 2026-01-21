import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const INSTRUCTIONS = `
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
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Použij POST" });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Chybí text e-mailu." });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: INSTRUCTIONS,
      input: `E-mail:\n${email}`,
      temperature: 0.3,
    });

    const text =
      (response.output_text && response.output_text.trim()) ||
      "Bez odpovědi (zkus znovu).";

    return res.status(200).json({ result: text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Chyba při analýze." });
  }
}
