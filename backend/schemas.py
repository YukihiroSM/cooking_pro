from typing import List, Union

from pydantic import BaseModel


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
    category: Union[str, None]
    area: Union[str, None]
    instructions: Union[str, None]
    image: Union[str, None]
    video: Union[str, None]
    ingredients: Union[List[str], None]
    measures: Union[List[str], None]


class Category(BaseModel):
    id: str
    name: str
    description: str


class DemoMeal(BaseModel):
    id: str
    name: str


class MealsResponse(BaseModel):
    data: List[Union[Meal, DemoMeal]]


class UserIngredientCreation(BaseModel):
    id: str
    measure: str


class UserIngredient(BaseModel):
    id: str
    label: str
    category: str
    measure: str

    def __dict__(self):
        return {
            "id": self.id,
            "label": self.label,
            "category": self.category,
            "measure": self.measure
        }
