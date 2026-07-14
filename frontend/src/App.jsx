import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import UploadBox from "./components/UploadBox";
import SummaryBox from "./components/SummaryBox";
import History from "./components/History";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [docInfo, setDocInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert("Please choose a document first.");
      return;
    }

    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", selectedFile);

  try {
   const response = await fetch("http://127.0.0.1:8000/summarize", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  console.log(data);

  setSummary(data.summary);
  setDocInfo(data);

} catch (error) {
  console.error(error);
  alert("❌ Failed to upload the file.");
} finally {
  setLoading(false);
}

  };

  const handleHistorySelect = (item) => {
   setSummary(item.summary);

   setDocInfo({
    filename: item.filename,
    word_count: item.word_count,
    character_count: item.character_count,
    page_count: item.page_count,
  });
};

  return (
    <div className="container">

      <Header />

      <UploadBox
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />

    <button
     className="generate-btn"
     onClick={handleGenerate}
     disabled={loading}
>
     {loading ? "Generating Summary..." : "Generate Summary"}
   </button>

{loading && (
  <div className="loading-container">
    <div className="spinner"></div>

    <p className="loading-text">
      Generating your summary...
      <br />
      This may take a few seconds.
    </p>
  </div>
)}

<SummaryBox
  summary={summary}
  docInfo={docInfo}
  
/>

<History onSelectSummary={handleHistorySelect} />
    </div>
  );
}

export default App;