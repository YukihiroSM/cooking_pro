from typing import List, Union

import requests
from bson import ObjectId
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

import jwt_auth
import schemas
import utils
from constants import MEAL_API_BASE_URL
from schemas import Meal, DemoMeal

router = APIRouter(prefix="/api/meals")


@router.post("/{user_id}/create")
async def create_meal(user_id: str, meal: Meal, request: Request):
    token = jwt_auth.get_authorisation(request)
    if token is None:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)

    user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return JSONResponse({"message": "User not found!"}, status_code=404)

    meal.user_id = user_id
    meal_query = jsonable_encoder(meal)

    meal = request.app.database.meals.insert_one(meal_query)
    return JSONResponse({"message": "Meal was created successfully.", "meal": meal}, 201)


@router.get("/{user_id}/mine")
async def find_my_meals(user_id: str, request: Request):
    token = jwt_auth.get_authorisation(request)
    if token is None:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)

    user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return JSONResponse({"message": "User not found!"}, status_code=404)

    meals = list(request.app.database.meals.find({"user_id": user_id}))
    return JSONResponse({
        "message": "Got meals successfully.",
        "meals": meals
    }, 200)


def get_meals_response(meals: List[Union[Meal, DemoMeal]]) -> JSONResponse:
    meals_response = jsonable_encoder(
        schemas.MealsResponse(data=meals)
    )
    return JSONResponse(meals_response)


@router.get("/")
async def get_filtered_meals_by_category(category: str = None, area: str = None):
    if not is_filter_query_valid(category, area) and category is None:
        user_ingredients = "garlic,salt"  # FIXME
        return get_filtered_by_ingredients(user_ingredients)
    url = f"{MEAL_API_BASE_URL}/filter.php?c={category}"
    response = requests.get(url)
    data = response.json().get("meals")
    meals = []
    for item in data:
        meal = DemoMeal(
            id=item["idMeal"],
            name=item["strMeal"],
        )
        meals.append(jsonable_encoder(meal))
    return meals


def is_filter_query_valid(category: str, area: str):
    return category is not area


@router.get("/categories")
async def get_all_categories():
    url = f"{MEAL_API_BASE_URL}/categories.php"
    response = requests.get(url)
    data = response.json().get("categories")
    categories = []
    for item in data:
        category = utils.build_category(item)
        categories.append(category)
    return JSONResponse(categories)


@router.get("/random")
async def get_random_meals():
    url = f"{MEAL_API_BASE_URL}/randomselection.php"
    response = requests.get(url)
    data = response.json().get("meals")
    meals = []
    for item in data:
        meal = utils.build_meal(item)
        meals.append(meal)
    return JSONResponse(meals, status_code=200)


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
        meal = schemas.DemoMeal(
            id=item["idMeal"],
            name=item["strMeal"]
        )
        meals.append(jsonable_encoder(meal))
    return JSONResponse(meals, status_code=200)


@router.get("/categories_and_ingredients")
async def get_meals_ingredients_categories(request: Request):
    collection = request.app.database.ingredients
    ingredients = utils.collect_ingredients_categories(collection)
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


@router.get("/filter")
async def filter_meals(request: Request, ingredients: Union[str, None] = None, category: Union[str, None] = None,
                       page: int = 0, perPage: int = 12):
    if ingredients:
        url = f"{MEAL_API_BASE_URL}/filter.php?i={ingredients}"
    elif category:
        url = f"{MEAL_API_BASE_URL}/filter.php?c={category}"

    elif category and ingredients:
        return JSONResponse({"message": "Bad request. Need to specify only one of parameters: [category, ingredients]"},
                            status_code=400)
    else:
        return JSONResponse({"message": "Bad request. Need to specify one of parameters: [category, ingredients]"},
                            status_code=400)

    response = requests.get(url)
    data = response.json().get("meals")
    if data is None:
        return JSONResponse({"message": "Meals were not found"}, status_code=204)

    data_to_process = data[page * perPage: (page + 1) * perPage]
    meals = []
    for item in data_to_process:
        meal_url = f"{MEAL_API_BASE_URL}/lookup.php?i={item.get('idMeal')}"
        meal_resp = requests.get(meal_url)
        meal = meal_resp.json().get("meals")
        formatted_meal = utils.build_meal(meal[0])
        meals.append(formatted_meal)
    resp = {
        "data": meals,
        "metadata": {"total": len(data)}
    }
    return JSONResponse(resp, status_code=200)


@router.get("/{meal_id}")
async def get_meal_by_id(meal_id: int):
    url = f"{MEAL_API_BASE_URL}/lookup.php?i={meal_id}"
    response = requests.get(url)
    data = response.json().get("meals")
    if data is None or len(data) == 0:
        return JSONResponse({"message": "Meal with this ID does not exist!"}, status_code=404)
    meal = utils.build_meal(data[0])
    return JSONResponse(meal)
