import requests

from fastapi import APIRouter

from constants.constants import BASE_URL
from entity.Category import Category

from entity.Ingredient import Ingredient
from entity.Meal import Meal

router = APIRouter(prefix="/api/v1/meals")


@router.get("/random")
async def getRandomMeal():
    url = BASE_URL + "/random.php"
    response = requests.get(url)
    data = response.json()["meals"][0]
    return buildMeal(data)


@router.get("/categories")
async def getAllCategories():
    name = "categories"
    url = BASE_URL + f"/{name}.php"
    response = requests.get(url)
    data = response.json()[name]
    categories = []
    for category in data:
        categories.append(buildCategory(category))
    return categories


def buildCategory(category):
    return Category(
        category["idCategory"],
        category["strCategory"],
        category["strCategoryDescription"]
    )


@router.get("/")
async def getRandomMeals():
    # FIXME move key to .env files
    url = "https://www.themealdb.com/api/json/v2/9973533/randomselection.php"
    response = requests.get(url)
    data = response.json()["meals"]
    meals = []
    for m in data:
        meal = buildMeal(m)
        meals.append(meal)
    return meals


# TODO move to MealService
def buildMeal(data):
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
