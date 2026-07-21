import "./History.css";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function History({ history, setHistory, onSelectSummary }) {
  
const [searchTerm, setSearchTerm] = useState("");



  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this summary?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/history/${id}`, {
    method: "DELETE"
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
      <input
       type="text"
       placeholder="🔍 Search summaries..."
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
       className="search-input"
     />

      {history.length === 0 ? (
        <p>No summaries yet.</p>
      ) : (
        history
         .filter((item) =>
         item.filename.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item) => (
  <div key={item.id} className="history-item">

   <div
  className="history-content"
  onClick={() => onSelectSummary(item)}
>
  <h4>{item.filename}</h4>

  <p>
    {new Date(item.created_at).toLocaleString()}
  </p>
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