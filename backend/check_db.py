from database import SessionLocal
from models import Summary

db = SessionLocal()

summaries = db.query(Summary).all()

for summary in summaries:
    print("=" * 50)
    print(f"ID: {summary.id}")
    print(f"Filename: {summary.filename}")
    print(f"Word Count: {summary.word_count}")
    print(f"Created: {summary.created_at}")
    print(f"Summary: {summary.summary[:100]}...")
    print("=" * 50)

db.close()