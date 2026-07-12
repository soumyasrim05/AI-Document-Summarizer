from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from io import BytesIO
from transformers import pipeline
import fitz



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL_NAME = "sshleifer/distilbart-cnn-12-6"

summarizer = pipeline(
    "summarization",
    model=MODEL_NAME
)

def split_text(text, max_chunk_size=1000):
    """
    Split long text into smaller chunks without breaking words.
    """
    words = text.split()
    chunks = []
    current_chunk = []

    for word in words:
        current_chunk.append(word)

        if len(" ".join(current_chunk)) >= max_chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

@app.get("/")
def home():
    return {"message": "Backend is running!"}


@app.post("/summarize")
async def summarize(file: UploadFile = File(...)):
    # Read uploaded file into memory
    file_bytes = await file.read()

    # Extract text based on file type
    if file.filename.lower().endswith(".docx"):
     document = Document(BytesIO(file_bytes))
     text = "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    )

    elif file.filename.lower().endswith(".pdf"):
      pdf = fitz.open(stream=file_bytes, filetype="pdf")
      text = ""

      for page in pdf:
        text += page.get_text()

    else:
     return {
        "error": "Unsupported file type. Please upload a DOCX or PDF file."
    }
    
    

    # Split document into chunks
    chunks = split_text(text)

    summaries = []

    for chunk in chunks:
      result = summarizer(
        chunk,
        max_length=120,
        min_length=30,
        do_sample=False
    )

    summaries.append(result[0]["summary_text"])

   # Summarize the summaries again if needed
    if len(summaries) > 1:
      combined = " ".join(summaries)

      result = summarizer(
        combined,
        max_length=150,
        min_length=50,
        do_sample=False
    )

      final_summary = result[0]["summary_text"]
    
    else:
      final_summary = summaries[0]


    return { 
      "filename": file.filename,
      "summary": final_summary
}

    

    