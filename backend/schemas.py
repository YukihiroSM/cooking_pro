from pydantic import BaseModel
from typing import List


class AuthItem(BaseModel):
    username: str
    password: str


class TestItem(BaseModel):
    token: str


class AddUserIngredient(BaseModel):
    token: str
    ingredient_id: str


class Meal(BaseModel):
    id: str
    name: str
    category: str
    area: str
    instructions: str
    image: str
    video: str
    ingredients: List[str]
    measures: List[str]


class Category(BaseModel):
    id: str
    name: str
    description: str


class DemoMeal(BaseModel):
    id: str
    name: str
