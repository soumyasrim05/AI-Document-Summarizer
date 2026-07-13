import { useEffect, useState } from "react";

function History({ onSelectSummary }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/history")
      .then((response) => response.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="history-box">
      <h2>📚 Previous Summaries</h2>

      {history.length === 0 ? (
        <p>No summaries yet.</p>
      ) : (
        history.map((item) => (
          <div
           key={item.id}
           className="history-item"
            onClick={() => onSelectSummary(item)}
         >
            <strong>{item.filename}</strong>
            <br />
            <small>
              {new Date(item.created_at).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default History;