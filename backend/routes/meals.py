from http.client import HTTPException
from typing import List

import requests
from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from constants import MEAL_API_BASE_URL
from schemas import Ingredient, Meal, Category

router = APIRouter(prefix="/api/meals")


@router.get("/random")
async def getRandomMeal():
    url = f"{MEAL_API_BASE_URL}/random.php"
    response = requests.get(url)
    data = response.json().get("meals")[0]
    return JSONResponse(buildMeal(data))


class DemoMeal(BaseModel):
    id: int
    name: str


@router.get("/by_category")
async def getFilteredMealsByCategory(category: str):
    url = f"{MEAL_API_BASE_URL}/filter.php?c={category}"
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


@router.get("/by_area")
async def getFilteredMealsByArea(area: str):
    url = f"{MEAL_API_BASE_URL}/filter.php?a={area}"
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
    url = f"{MEAL_API_BASE_URL}/categories.php"
    response = requests.get(url)
    data = response.json().get("categories")
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


@router.get("/random")
async def getRandomMeals():
    # FIXME move key to .env files
    url = f"{MEAL_API_BASE_URL}/randomselection.php"
    response = requests.get(url)
    data = response.json().get("meals")
    numberOfMeals = 4
    meals = []
    for item in data:
        if len(meals) >= numberOfMeals:
            break
        meal = buildMeal(item)
        meals.append(meal)
    return JSONResponse(meals)


@router.get("/single/{mealID}")
async def getRandomMeals(mealID: int):
    # FIXME move key to .env files
    url = f"{MEAL_API_BASE_URL}/lookup.php?i={mealID}"
    response = requests.get(url)
    data = response.json().get("meals")
    if len(data) == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    meal = buildMeal(data[0])
    return JSONResponse(meal)


@router.get("/filtered")
async def getFiltered(ingredients: str):
    if ingredients is None:
        raise HTTPException(status_code=400, detail="Bad request")
    url = f"{MEAL_API_BASE_URL}/filter.php?i={ingredients}"
    response = requests.get(url)
    data = response.json().get("meals")
    if data is None:
        raise HTTPException(status_code=204, detail="Meals were not found")
    meals = []
    for item in data:
        meal = DemoMeal(
            id=item["idMeal"],
            name=item["strMeal"]
        )
        meals.append(jsonable_encoder(meal))
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
