from datetime import datetime

from pydantic import BaseModel



class SummaryResponse(BaseModel):
    filename: str
    summary: str
    word_count: int
    character_count: int
    file_size: float
    page_count: int | str


class HistoryResponse(BaseModel):
    id: int
    filename: str
    summary: str
    word_count: int
    character_count: int
    page_count: int | str | None
    created_at: datetime