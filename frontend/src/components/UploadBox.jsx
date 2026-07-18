import { useState } from "react";
import "./UploadBox.css";

function UploadBox({
  selectedFile,
  setSelectedFile,
    summaryLength,
    setSummaryLength
  }) {

  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);


  const handleFileSelect = (file) => {

  if (file) {

    setSelectedFile(file);

    if (file.type === "application/pdf") {

      const url = URL.createObjectURL(file);

      setPreviewUrl(url);

    } else {

      setPreviewUrl(null);

    }

  }

};


const handleFileChange = (event) => {

  handleFileSelect(event.target.files[0]);

};


const handleDragOver = (event) => {

  event.preventDefault();

  setDragging(true);

};


const handleDragLeave = () => {

  setDragging(false);

};


const handleDrop = (event) => {

  event.preventDefault();

  setDragging(false);

  handleFileSelect(event.dataTransfer.files[0]);

};

return (

  <div
    className={`upload-box ${dragging ? "drag-active" : ""}`}

    onDragOver={handleDragOver}

    onDragLeave={handleDragLeave}

    onDrop={handleDrop}
  >

    <div className="upload-icon">
      📄
    </div>


    <h2>
      Upload Document
    </h2>


    <p className="upload-text">
      Drag & Drop your file here
    </p>


    <div className="divider">
      <span>or</span>
    </div>


    <input
      type="file"
      id="fileInput"
      accept=".pdf,.doc,.docx"
      onChange={handleFileChange}
      hidden
    />



    <div className="summary-options">

    <h3>
      Summary Length
    </h3>

    <div className="length-buttons">

        {["short", "medium", "detailed"].map((option) => (

            <button
                key={option}
                className={
                    summaryLength === option
                    ? "active-length"
                    : ""
                }
                onClick={() => setSummaryLength(option)}
            >
                {option}
            </button>

        ))}

    </div>

</div>


    <button
      className="choose-btn"
      onClick={() =>
        document.getElementById("fileInput").click()
      }
    >
      Choose File
    </button>


    {selectedFile && (

      <p className="selected-file">
        {selectedFile.name}
      </p>

    )}

    {previewUrl && (

  <div className="pdf-preview">

    <h3>
      Document Preview
    </h3>

    <iframe
      src={previewUrl}
      title="PDF Preview"
    />

  </div>

)}


  </div>
);

}

export default UploadBox;