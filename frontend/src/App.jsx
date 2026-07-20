import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import UploadBox from "./components/UploadBox";
import SummaryBox from "./components/SummaryBox";
import History from "./components/History";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summaryLength, setSummaryLength] = useState("medium");
  const [summary, setSummary] = useState("");
  const [docInfo, setDocInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch history from backend
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load history when app starts
  useEffect(() => {
    fetchHistory();
  }, []);

  // Generate Summary
  const handleGenerate = async () => {
    if (!selectedFile) {
      alert("Please choose a document first.");
      return;
    }

    setLoading(true);
    setSummary("");

    const formData = new FormData();

    formData.append("file", selectedFile);

    formData.append(
     "summary_length",
      summaryLength
    );


    try {
      const response = await fetch("http://127.0.0.1:8000/summarize", {
  
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.detail || "Failed to summarize.");
      }
      const data = await response.json();

      setSummary(data.summary);
      setDocInfo(data);

      // Refresh history after saving
      await fetchHistory();

    } catch (error) {
      console.error(error);
      alert("❌ Failed to upload the file.");
    } finally {
      setLoading(false);
    }
  };

  // Load summary from history
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

<div className="app">

    <Header />

    <div className="workspace">

        <aside className="sidebar">

            <History
                history={history}
                setHistory={setHistory}
                onSelectSummary={handleHistorySelect}
            />

        </aside>

        <main className="content">

            <UploadBox
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              summaryLength={summaryLength}
              setSummaryLength={setSummaryLength}
            />

            <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={loading}
            >
                {loading
                    ? "Generating Summary..."
                    : "Generate Summary"}
            </button>

            {loading && (
                <div className="loading-container">

                    <div className="spinner"></div>

                    <p className="loading-text">
                        Generating your summary...
                    </p>

                </div>
            )}

            <SummaryBox
              summary={summary}
              docInfo={docInfo}
              summaryLength={summaryLength}
          />

        </main>

    </div>

</div>

);

}

export default App;