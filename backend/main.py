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
    
    # Limit input length for the model
    text = text[:3000]

    result = summarizer(
    text,
    max_length=150,
    min_length=40,
    do_sample=False
)

    return {
    "filename": file.filename,
    "summary": result[0]["summary_text"]
}