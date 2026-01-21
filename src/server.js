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
