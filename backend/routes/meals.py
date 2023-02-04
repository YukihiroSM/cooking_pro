from http.client import HTTPException
from typing import List

import requests
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from utils import collect_ingredients_categories
from constants import MEAL_API_BASE_URL
from schemas import Meal, Category, DemoMeal

router = APIRouter(prefix="/api/meals")


class Metadata(BaseModel):
    total: int


class MealsResponse(BaseModel):
    data: List[Meal]
    metadata: Metadata


def get_meals_response(meals: List[Meal]) -> JSONResponse:
    metadata = Metadata(total=len(meals))
    meals_response = jsonable_encoder(
        MealsResponse(data=meals, metadata=metadata)
    )
    return JSONResponse(meals_response)


@router.get("/")
async def getFilteredMealsByCategory(category: str = None, area: str = None):
    if not is_filter_query_valid(category, area) and category is None:
        user_ingredients = "garlic,salt"  # FIXME
        return get_filtered_by_ingredients(user_ingredients)
        # return JSONResponse({"message": "Query is not valid."}, status_code=400)
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
    return get_meals_response(meals)


def is_filter_query_valid(category: str, area: str):
    return category is not area


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
    return get_meals_response(meals)


class Message(BaseModel):
    message: str


@router.get("/filtered")
async def get_filtered(ingredients: str):
    if ingredients is None:
        return JSONResponse({"message": "Bad request"}, status_code=400)
    return get_filtered_by_ingredients(ingredients)


def get_filtered_by_ingredients(ingredients: str):
    url = f"{MEAL_API_BASE_URL}/filter.php?i={ingredients}"
    response = requests.get(url)
    data = response.json().get("meals")
    if data is None:
        return JSONResponse({"message": "Meals were not found"}, status_code=204)
    meals = []
    for item in data:
        meal = DemoMeal(
            id=item["idMeal"],
            name=item["strMeal"]
        )
        meals.append(jsonable_encoder(meal))
    return get_meals_response(meals)


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