import "./SummaryBox.css";
import { jsPDF } from "jspdf";
function SummaryBox({ summary, docInfo, summaryLength }) {

  const downloadSummary = () => {

  const pdf = new jsPDF();


  pdf.setFontSize(20);
  pdf.text(
    "AI Document Summarizer",
    20,
    25
  );


  pdf.setFontSize(12);

  let y = 45;


  if (docInfo) {

    pdf.text(
      `File: ${docInfo.filename}`,
      20,
      y
    );

    y += 10;


    pdf.text(
      `Size: ${docInfo.file_size} KB`,
      20,
      y
    );

    y += 10;


    pdf.text(
      `Words: ${docInfo.word_count}`,
      20,
      y
    );

    y += 10;


    pdf.text(
        `Pages: ${docInfo.page_count}`,
        20,
        y
      );

      y += 10;


      pdf.text(
        `Summary Type: ${
          summaryLength.charAt(0).toUpperCase() +
          summaryLength.slice(1)
        }`,
        20,
        y
      );

      y += 20;

  }


  pdf.setFontSize(16);

  pdf.text(
    "Generated Summary",
    20,
    y
  );


  y += 12;


  pdf.setFontSize(12);


  const points = summary
  .split(". ")
  .filter(point => point.trim() !== "");


points.forEach((point) => {

  const bulletPoint = `• ${point}`;

  const lines = pdf.splitTextToSize(
    bulletPoint,
    170
  );


  pdf.text(
    lines,
    20,
    y
  );


  y += lines.length * 7;

});


  pdf.save(
    "AI_Summary_Report.pdf"
  );

};

  const copySummary = () => {
  navigator.clipboard.writeText(summary);

  alert("✅ Summary copied to clipboard!");
  };


const formatSummary = (text) => {

  if (!text) return [];

  return text
    .split(". ")
    .filter(sentence => sentence.trim() !== "")
    .map(sentence => sentence.trim());

};
const formattedSummary = formatSummary(summary);

return (
  <div className="summary-card">

    <div className="summary-top">

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

        <div className="info-item">
          <strong>File</strong>
          <span>{docInfo.filename}</span>
        </div>

        <div className="info-item">
          <strong>Size</strong>
          <span>{docInfo.file_size} KB</span>
        </div>

        <div className="info-item">
          <strong>Words</strong>
          <span>{docInfo.word_count}</span>
        </div>

        <div className="info-item">
          <strong>Characters</strong>
          <span>{docInfo.character_count}</span>
        </div>

        <div className="info-item">
          <strong>Pages</strong>
          <span>{docInfo.page_count}</span>
        </div>

      </div>

    )}

    <div className="summary-content">

  {summary ? (

    <div>

      <h3 className="summary-heading">
        📌 Key Points
      </h3>


      <ul className="summary-list">

        {formattedSummary.map((point, index) => (

          <li key={index}>
            {point}
          </li>

        ))}

      </ul>

    </div>

  ) : (

    <p>
      Your summarized document will appear here.
    </p>

  )}

</div>

  </div>
);
}

export default SummaryBox;