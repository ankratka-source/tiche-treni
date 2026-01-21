import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const INSTRUCTIONS = `
Jsi moje asistentka pro pracovní e-mailovou komunikaci (vendori, klienti, interní tým).
Tvůj úkol je odhalit tzv. “tiché tření” – situace, kdy e-mail zní zdvořile a v pohodě,
ale ve skutečnosti se nic nehýbe (odkládání, mlžení, nejasná zodpovědnost, vyhýbání se rozhodnutí).

Piš česky, lidsky, stručně, prakticky.
Nepiš žádné AI fráze ani vysvětlování.
Buď profesionální, ale přímá.

Vrať vždy přesně tuto strukturu:
1) Tiché tření: X/100
2) Co drhne: (1–2 věty)
3) Riziko odkladu: (1 věta)
4) Doporučená věta do odpovědi: (1 věta – profesionální, asertivní, lidská)
5) Mini-dotaz pro vyjasnění: (1 krátká otázka, která posune další krok)

Pravidla:
- Doporučená věta musí posunout věc dopředu (deadline / další krok / kdo rozhodne).
- Mini-dotaz je jedna věta, jedna otázka.
- Pokud text obsahuje citlivé údaje, nijak je nezvýrazňuj ani neopakuj víc, než je nutné.
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
