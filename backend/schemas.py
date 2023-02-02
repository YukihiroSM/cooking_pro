from pydantic import BaseModel
from typing import List


class LoginItem(BaseModel):
    username: str
    password: str


class TestItem(BaseModel):
    token: str


class AddUserIngredient(BaseModel):
    token: str
    ingredient_id: str


class Ingredient(BaseModel):
    name: str
    measure: str


class Meal(BaseModel):
    id: int
    name: str
    category: str
    area: str
    instructions: str
    image: str
    video: str
    ingredients: List[Ingredient]


class Category(BaseModel):
    id: int
    name: str
    description: str

