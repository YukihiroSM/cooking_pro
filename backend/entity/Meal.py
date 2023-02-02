from typing import List

from pydantic import BaseModel

from entity.Ingredient import Ingredient


class Meal(BaseModel):
    id: int
    name: str
    category: str
    area: str
    instructions: str
    image: str
    video: str
    ingredients: List[Ingredient]


