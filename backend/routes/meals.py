import requests
from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from constants.constants import BASE_URL
from entity.Category import Category
from entity.Ingredient import Ingredient
from entity.Meal import Meal

router = APIRouter(prefix="/api/v1/meals")


@router.get("/random")
async def getRandomMeal():
    url = BASE_URL + "/random.php"
    response = requests.get(url)
    data = response.json().get("meals")[0]
    return JSONResponse(buildMeal(data))


class DemoMeal(BaseModel):
    id: int
    name: str


@router.get("/")
async def getFilteredMealsByCategory(category: str):
    url = BASE_URL + "/filter.php?c=" + category
    response = requests.get(url)
    data = response.json().get("meals")
    meals = []
    for item in data:
        meal = DemoMeal(
            id=item["idMeal"],
            name=item["strMeal"]
        )
        meals.append(jsonable_encoder(meal))
    return JSONResponse(meals)


@router.get("/")
async def getFilteredMealsByArea(area: str):
    url = BASE_URL + "/filter.php?a=" + area
    response = requests.get(url)
    data = response.json().get("meals")
    meals = []
    for item in data:
        meal = DemoMeal(
            id=item["idMeal"],
            name=item["strMeal"]
        )
        meals.append(jsonable_encoder(meal))
    return JSONResponse(meals)


@router.get("/categories")
async def getAllCategories():
    name = "categories"
    url = BASE_URL + f"/{name}.php"
    response = requests.get(url)
    data = response.json().get(name)
    categories = []
    for item in data:
        category = buildCategory(item)
        categories.append(category)
    return JSONResponse(categories)


def buildCategory(category):
    category = Category(
        id=category["idCategory"],
        name=category["strCategory"],
        description=category["strCategoryDescription"]
    )
    return jsonable_encoder(category)


@router.get("/random10")  # FIXME fix endpoint
async def getRandomMeals():
    # FIXME move key to .env files
    url = "https://www.themealdb.com/api/json/v2/9973533/randomselection.php"
    response = requests.get(url)
    data = response.json().get("meals")
    meals = []
    for item in data:
        meal = buildMeal(item)
        meals.append(meal)
    return JSONResponse(meals)


# TODO move to MealService
def buildMeal(data):
    ingredients = []
    for key in data.keys():
        if key.startswith("strIngredient") and data[key]:
            ingredient = Ingredient(
                name=data[key],
                measure=data["strMeasure" + key.replace("strIngredient", "")]
            )
            ingredients.append(ingredient)
    meal = Meal(
        id=data["idMeal"],
        name=data["strMeal"],
        category=data["strCategory"],
        area=data["strArea"],
        instructions=data["strInstructions"],
        image=data["strMealThumb"],
        video=data["strYoutube"],
        ingredients=ingredients
    )
    return jsonable_encoder(meal)
