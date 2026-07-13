function SummaryBox({ summary, docInfo }) {

  const downloadSummary = () => {
  const element = document.createElement("a");

  const file = new Blob([summary], {
    type: "text/plain",
  });

  element.href = URL.createObjectURL(file);
  element.download = "Summary.txt";

  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
};

  const copySummary = () => {
  navigator.clipboard.writeText(summary);

  alert("✅ Summary copied to clipboard!");
  };

  return (
    <div className="summary-box">
      <div className="summary-header">
       <h2>Summary</h2>

      {summary && (
    <div className="action-buttons">
    <button
      className="copy-btn"
      onClick={copySummary}
    >
      📋 Copy
    </button>

    <button
      className="download-btn"
      onClick={downloadSummary}
    >
      ⬇ Download
    </button>
  </div>
)}
</div>

      {docInfo && (
        <div className="document-info">
          <h3>Document Information</h3>

          <p><strong>📄 File Name:</strong> {docInfo.filename}</p>
          <p><strong>📦 File Size:</strong> {docInfo.file_size} KB</p>
          <p><strong>📝 Word Count:</strong> {docInfo.word_count}</p>
          <p><strong>🔤 Characters:</strong> {docInfo.character_count}</p>
          <p><strong>📑 Pages:</strong> {docInfo.page_count}</p>

          <hr />
        </div>
      )}

      {summary ? (
        <p>{summary}</p>
      ) : (
        <p>Your summarized document will appear here.</p>
      )}
    </div>
  );
}

export default SummaryBox;