import requests

from fastapi import APIRouter

from constants.constants import BASE_URL

from entity.Ingredient import Ingredient
from entity.Meal import Meal

router = APIRouter(prefix="/meals")


@router.get("/random")
async def getRandomMeal():
    url = BASE_URL + "/random.php"
    response = requests.get(url)
    data = response.json()["meals"][0]
    ingredients = []
    for key in data.keys():
        if key.startswith("strIngredient") and data[key]:
            ingredient = Ingredient(
                data[key],
                data["strMeasure" + key.replace("strIngredient", "")]
            )
            ingredients.append(ingredient)
    return Meal(
        data["idMeal"],
        data["strMeal"],
        data["strCategory"],
        data["strArea"],
        data["strInstructions"],
        ingredients
    )


