import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SecondPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
    const [phrase, setPhrase] = useState("");
    const [phrases, setPhrases] = useState([]);

    // Submit a new phrase to the serverless API
    const submitPhrase = async () => {
        if (!name || !phrase) return; // simple validation

        try {
            const res = await fetch("/api/phrases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phrase }),
            });

            const data = await res.json();
            if (data.ok) {
                setName("");
                setPhrase("");
                loadPhrases(); // automatically reload after submitting
            } else {
                alert("Failed to submit phrase");
                console.error(data);
            }
        } catch (err) {
            console.error("Error submitting phrase:", err);
            alert("Error submitting phrase — check console");
        }
    };

    // Load phrases from the serverless API
    const loadPhrases = async () => {
        try {
            const res = await fetch("/api/phrases");
            const data = await res.json();

            if (!Array.isArray(data)) {
                console.error("API returned:", data);
                alert("API error — check console");
                return;
            }

            setPhrases(data);
        } catch (err) {
            console.error("Error loading phrases:", err);
            alert("Error loading phrases — check console");
        }
    };

  return (
    <div>
      <h1>Second Page</h1>
            <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
                placeholder="Your phrase"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
            />
            <br />

            <button onClick={submitPhrase}>Submit</button>
            <button onClick={loadPhrases} style={{ marginLeft: 10 }}>
                Load Phrases
            </button>

            <ul>
                {phrases.map((p, i) => (
                    <li key={i}>
                        <strong>{p.name}:</strong> {p.phrase}
                    </li>
                ))}
            </ul>

      <button onClick={() => navigate("/")}>
        Return Home
      </button>
    </div>
  );
}

export default SecondPage;
