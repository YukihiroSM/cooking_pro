from pydantic import BaseModel


class Category(BaseModel):
    id: int
    name: str
    description: str

