function SummaryBox({ summary }) {
  return (
    <div className="summary-box">
      <h2>Summary</h2>

      {summary ? (
        <p>{summary}</p>
      ) : (
        <p>Your summarized document will appear here.</p>
      )}
    </div>
  );
}

export default SummaryBox;