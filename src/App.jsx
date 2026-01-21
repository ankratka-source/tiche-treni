import { useState } from "react";
import "./App.css";

function App() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeEmail = async () => {
    setLoading(true);
    setError(null);
    setResult("");

    try {
      const response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: emailText })
      });

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError("Něco se pokazilo. Zkus to znovu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Tiché tření – analyzátor e-mailů</h1>
      <p className="subtle">
        Vlož e-mail a zjisti, kde se komunikace tváří v pohodě, ale nikam nevede.
      </p>

      <textarea
        placeholder="Vlož sem e-mail…"
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
      />

      <button onClick={analyzeEmail} disabled={loading || !emailText}>
        {loading ? "Analyzuji…" : "Analyzovat"}
      </button>

      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}

      {result && (
        <div className="result">
          <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;



