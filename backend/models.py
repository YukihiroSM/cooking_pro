from pydantic import BaseModel

class LoginItem(BaseModel):
    username: str
    password: str


class TestItem(BaseModel):
    token: str


class AddUserIngredient(BaseModel):
    token: str
    ingredient_id: str