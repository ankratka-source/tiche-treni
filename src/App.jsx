import { useState } from "react";
import "./App.css";

export default function App() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeEmail = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailText }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Něco se pokazilo.");

      setResult(data.result);
    } catch (e) {
      setError(e.message || "Něco se pokazilo.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <h1>Tiché tření</h1>
            <p className="subtle">
              Vlož e-mail. Dostaneš 4 body: % tření, problém, riziko odkladu a jednu větu k odpovědi.
            </p>
          </div>
          <span className="pill">v1</span>
        </div>

        <div className="grid">
          <textarea
            placeholder="Vlož sem e-mail…"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
          />

          <div className="row">
            <button onClick={analyzeEmail} disabled={loading || !emailText.trim()}>
              {loading ? "Analyzuji…" : "Analyzovat"}
            </button>
            <button className="secondary" onClick={copyResult} disabled={!result}>
              Zkopírovat výsledek
            </button>
            <button className="secondary" onClick={() => { setEmailText(""); setResult(""); setError(""); }}>
              Vyčistit
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          {result && (
            <div className="result">
              <pre>{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




