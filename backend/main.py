from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from io import BytesIO
from transformers import pipeline


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

    # Open DOCX document
    document = Document(BytesIO(file_bytes))

    # Extract all paragraphs
    text = "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
        )
    

    # Split the document into chunks
    chunks = split_text(text)
    # Summarize each chunk
    summaries = []

    for chunk in chunks:

     result = summarizer(
        chunk,
        max_length=150,
        min_length=40,
        do_sample=False
    )
    summaries.append(result[0]["summary_text"])

    # Combine all summaries
    final_summary = "\n\n".join(summaries)


    return { 
    "filename": file.filename,
    "summary": final_summary
}

    

    