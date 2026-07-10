import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import UploadBox from "./components/UploadBox";
import SummaryBox from "./components/SummaryBox";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert("Please choose a document first.");
      return;
    }

    alert(`Generating summary for: ${selectedFile.name}`);
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
      >
        Generate Summary
      </button>

      <SummaryBox />

    </div>
  );
}

export default App;