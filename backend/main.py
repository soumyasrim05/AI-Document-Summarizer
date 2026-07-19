from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from docx import Document
from io import BytesIO
from transformers import pipeline
import fitz
from database import engine
from models import Base
from database import SessionLocal
from models import Summary


Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL_NAME = "t5-small"

summarizer = None

def get_summarizer():
    global summarizer

    if summarizer is None:
        summarizer = pipeline(
            task="summarization",
            model=MODEL_NAME,
            framework="pt",
            device=-1,
        )

    return summarizer

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
async def summarize(
    file: UploadFile = File(...),
    summary_length: str = Form("medium")
):
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
     page_count = "N/A"

    elif file.filename.lower().endswith(".pdf"):
      pdf = fitz.open(stream=file_bytes, filetype="pdf")
      page_count = len(pdf)
      text = ""

      for page in pdf:
        text += page.get_text()

    else:
     raise HTTPException(
        status_code=400,
        detail="Unsupported file type. Please upload a DOCX or PDF file."
    )


    if summary_length == "short":
        max_length = 80
        min_length = 20

    elif summary_length == "detailed":
        max_length = 180
        min_length = 60

    else:
        max_length = 120
        min_length = 30


    
    # Split document into chunks
    chunks = split_text(text)

    summaries = []

    for chunk in chunks:
      result = get_summarizer()(
      chunk,
      max_length=max_length,
      min_length=min_length,
      do_sample=False
    )


      summaries.append(result[0]["summary_text"])

   # Summarize the summaries again if needed

    if not summaries:
     raise HTTPException(
        status_code=400,
        detail="Could not extract text from document."
    )

    if len(summaries) > 1:
      combined = " ".join(summaries)

      result = get_summarizer()(
       combined,
       max_length=max_length,
       min_length=min_length,
       do_sample=False
      )

      final_summary = result[0]["summary_text"]
    
    else:
      final_summary = summaries[0]

    
    word_count = len(text.split())

    character_count = len(text)

    file_size = len(file_bytes)

    db = SessionLocal()

    new_summary = Summary(
    filename=file.filename,
    summary=final_summary,
    word_count=word_count,
    character_count=character_count,
    page_count=page_count
)

    db.add(new_summary)
    db.commit()
    db.close()


    return {
    "filename": file.filename,
    "summary": final_summary,
    "word_count": word_count,
    "character_count": character_count,
    "file_size": round(file_size / 1024, 2),   # KB
    "page_count": page_count
}

    



@app.get("/history")
def get_history():
    db = SessionLocal()

    summaries = db.query(Summary).order_by(Summary.created_at.desc()).all()

    history = []

    for item in summaries:
        history.append({
            "id": item.id,
            "filename": item.filename,
            "summary": item.summary,
            "word_count": item.word_count,
            "character_count": item.character_count,
            "page_count": item.page_count,
            "created_at": item.created_at
        })

    db.close()

    return history


@app.delete("/history/{summary_id}")
def delete_summary(summary_id: int):
    db = SessionLocal()

    summary = db.query(Summary).filter(Summary.id == summary_id).first()

    if not summary:
        db.close()
        raise HTTPException(status_code=404, detail="Summary not found")

    db.delete(summary)
    db.commit()
    db.close()

    return JSONResponse(
        content={"message": "Summary deleted successfully"}
    )
 
    
