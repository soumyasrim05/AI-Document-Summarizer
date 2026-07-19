# 📄 AI Document Summarizer

An AI-powered document summarization application that extracts text from PDF and DOCX files and generates concise summaries using NLP models.

The project was built from scratch to gain hands-on experience in full-stack development, REST APIs, AI integration, and deployment.

---

## 🚀 Features

- 📄 Upload PDF and DOCX documents
- 🔍 Extract text from uploaded documents
- 🤖 Generate AI-powered summaries using NLP models
- 🎚️ Choose summary length
- 📊 Display document information
- ⬇️ Download generated summaries
- 🌐 Deployed Streamlit version for live demo
- ⚛️ React frontend with FastAPI backend architecture

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- HTML
- CSS
- JavaScript

### Backend
- FastAPI
- Python
- Uvicorn

### Tools
- Git
- GitHub
- VS Code

### AI / NLP
- Hugging Face Transformers
- PyTorch
- T5-small model

### Deployment
- Streamlit Cloud

---

## 📂 Project Structure

```text
AI-DOC-SUMMARIZER
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── main.py
│   ├── database.py
│   └── models.py
│
├── streamlit-app
│   ├── app.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
---
## ✅ Completed

- React + Vite frontend development
- FastAPI backend development
- PDF and DOCX text extraction
- AI-based document summarization
- Summary length selection
- Summary download functionality
- Document history management
- Streamlit deployment for live demo

---

## ▶️ How to Run

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate

pip install fastapi uvicorn

uvicorn main:app --reload
```

### Streamlit Version

```bash
cd streamlit-app

pip install -r requirements.txt

streamlit run app.py


## 🎯 Project Goal

The goal of this project is to build a complete AI-powered document summarization application while learning full-stack development concepts, backend APIs, React fundamentals, and AI integration.

---

## 👩‍💻 Author

**Soumya Sri Masani**

Built with ❤️ while learning Full Stack Development.



## 🌐 Live Demo

A lightweight deployed version of the summarizer is available here:

https://ai-document-summarizer-05.streamlit.app/

## 💻 Original Application

The full-stack version was built using React + FastAPI with a custom dashboard interface.