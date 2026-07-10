function UploadBox({ selectedFile, setSelectedFile }) {

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="upload-box">

      <h2>📄 Upload Document</h2>

      <p>Drag & Drop your file here</p>

      <p>OR</p>

      <input
        type="file"
        id="fileInput"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        hidden
      />

      <button
        onClick={() =>
          document.getElementById("fileInput").click()
        }
      >
        Choose File
      </button>

      {selectedFile && (
        <p>
          <strong>Selected File:</strong>{" "}
          {selectedFile.name}
        </p>
      )}

    </div>
  );
}

export default UploadBox;