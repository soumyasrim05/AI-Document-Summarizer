import { useEffect, useState } from "react";

function History({ onSelectSummary }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/history")
      .then((response) => response.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error(error));
  }, []);


  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this summary?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/history/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setHistory((prevHistory) =>
       prevHistory.filter((item) => item.id !== id)
    );
    } else {
      alert("Failed to delete summary.");
    }
  } catch (error) {
    console.error(error);
    alert("Error deleting summary.");
  }
};

  return (
    <div className="history-box">
      <h2>📚 Previous Summaries</h2>

      {history.length === 0 ? (
        <p>No summaries yet.</p>
      ) : (
        history.map((item) => (
  <div key={item.id} className="history-item">

    <div
      className="history-content"
      onClick={() => onSelectSummary(item)}
    >
      <strong>{item.filename}</strong>

      <br />

      {new Date(item.created_at).toLocaleString()}
    </div>

    <button
      className="delete-btn"
      onClick={() => handleDelete(item.id)}
    >
      🗑
    </button>

  </div>
))
      )}
    </div>
  );
}

export default History;