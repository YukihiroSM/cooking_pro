from http.client import HTTPException
from typing import List

import requests
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from utils import collect_ingredients_categories
from constants import MEAL_API_BASE_URL
from schemas import Meal, Category, DemoMeal

router = APIRouter(prefix="/api/meals")


@router.get("/")
def get_root():
    return True


@router.get("/random")
async def get_random_meal():
    url = f"{MEAL_API_BASE_URL}/random.php"
    response = requests.get(url)
    data = response.json().get("meals")[0]
    return JSONResponse(build_meal(data))



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
async def get_filtered_meals_by_area(area: str):
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
async def get_all_categories():
    url = f"{MEAL_API_BASE_URL}/categories.php"
    response = requests.get(url)
    data = response.json().get("categories")
    categories = []
    for item in data:
        category = build_category(item)
        categories.append(category)
    return JSONResponse(categories)


def build_category(category):
    category = Category(
        id=category["idCategory"],
        name=category["strCategory"],
        description=category["strCategoryDescription"]
    )
    return jsonable_encoder(category)


@router.get("/random")
async def get_random_meals():
    url = f"{MEAL_API_BASE_URL}/randomselection.php"
    response = requests.get(url)
    data = response.json().get("meals")
    meals = []
    for item in data:
        meal = build_meal(item)
        meals.append(meal)
    return JSONResponse(meals)


@router.get("/filtered")
async def get_filtered(ingredients: str):
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


@router.get("/categories_and_ingredients")
def get_meals_ingredients_categories(request: Request):
    collection = request.app.database.ingredients
    ingredients = collect_ingredients_categories(collection)
    url = f"{MEAL_API_BASE_URL}/categories.php"
    response = requests.get(url)
    data = response.json().get("categories")
    categories = []
    for category in data:
        categories.append({"label": category.get("strCategory")})
    result = [
        {"label": "Recipes", "children": categories},
        {"label": "Ingredients", "children": ingredients}
    ]
    return JSONResponse(result)


@router.get("/{meal_id}")
async def get_meal_by_id(meal_id: int):
    url = f"{MEAL_API_BASE_URL}/lookup.php?i={meal_id}"
    response = requests.get(url)
    data = response.json().get("meals")
    if data is None or len(data) == 0:
        return JSONResponse({"message": "Meal with this ID does not exist!"}, status_code=404)
    meal = build_meal(data[0])
    return JSONResponse(meal)


# TODO move to MealService
def build_meal(data):
    ingredients = []
    measures = []
    for key in data.keys():
        if key.startswith("strIngredient") and data[key]:
            ingredients.append(data[key])
            measures.append(data["strMeasure" + key.replace("strIngredient", "")])
    meal = Meal(
        id=data["idMeal"],
        name=data["strMeal"],
        category=data["strCategory"],
        area=data["strArea"],
        instructions=data["strInstructions"],
        image=data["strMealThumb"],
        video=parse_video(data["strYoutube"]),
        ingredients=ingredients,
        measures=measures
    )
    return jsonable_encoder(meal)


def parse_video(link: str):
    key = link[link.find("=") + 1:]
    return f"https://www.youtube.com/embed/{key}?autoplay=1&mute=1"