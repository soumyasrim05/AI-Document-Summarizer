import streamlit as st
from transformers import pipeline
from docx import Document
from io import BytesIO
import fitz


st.set_page_config(
    page_title="AI Document Summarizer",
    page_icon="📄"
)


@st.cache_resource
def load_model():
    return pipeline(
        "summarization",
        model="t5-small"
    )


def extract_text(file):
    if file.name.lower().endswith(".pdf"):
        pdf = fitz.open(stream=file.read(), filetype="pdf")

        text = ""

        for page in pdf:
            text += page.get_text()

        return text

    elif file.name.lower().endswith(".docx"):
        document = Document(BytesIO(file.read()))

        return "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        )

    return ""


def split_text(text, max_words=400):
    words = text.split()

    chunks = []

    for i in range(0, len(words), max_words):
        chunks.append(
            " ".join(words[i:i + max_words])
        )

    return chunks


st.title("📄 AI Document Summarizer")

st.write(
    "Upload a PDF or DOCX file and generate an AI summary."
)


uploaded_file = st.file_uploader(
    "Choose a document",
    type=["pdf", "docx"]
)


summary_length = st.selectbox(
    "Summary Length",
    ["short", "medium", "detailed"]
)


if uploaded_file:

    st.success(
        f"Selected: {uploaded_file.name}"
    )


    if st.button("Generate Summary"):

        with st.spinner("Generating summary..."):

            text = extract_text(uploaded_file)

            if not text:
                st.error(
                    "Could not extract text."
                )

            else:

                summarizer = load_model()

                chunks = split_text(text)

                summaries = []

                for chunk in chunks:

                    result = summarizer(
                        chunk,
                        max_length=120,
                        min_length=30,
                        do_sample=False
                    )

                    summaries.append(
                        result[0]["summary_text"]
                    )


                final_summary = " ".join(
                    summaries
                )


                st.subheader(
                    "Summary"
                )

                st.write(
                    final_summary
                )


                st.download_button(
                    "Download Summary",
                    final_summary,
                    file_name="summary.txt"
                )