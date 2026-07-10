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
     const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await fetch("http://127.0.0.1:8000/summarize", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    alert(
      `✅ ${data.message}\n\nFile: ${data.filename}\nType: ${data.content_type}`
    );
  } catch (error) {
    console.error(error);
    alert("❌ Failed to upload the file.");
  }

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