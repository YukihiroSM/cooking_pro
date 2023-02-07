import hashlib
import pickle

import requests
from bson.objectid import ObjectId
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

import jwt_auth
import utils
from constants import MEAL_API_BASE_URL
from schemas import AuthItem, UserIngredientCreation

router = APIRouter(prefix="/api/user")


@router.post("/login")
@router.options("/login")
async def login_user(login_data: AuthItem, request: Request):
    user_query = jsonable_encoder(login_data)
    username_query = {"username": user_query["username"]}
    user = request.app.database.users.find_one(username_query)
    if user:
        if jwt_auth.verify_password(user["password"], user_query["password"]):
            encoded_jwt = jwt_auth.get_encoded_jwt(user_query)
            set_jwt = {"$set": {"token": encoded_jwt}}
            request.app.database.users.update_one(user_query, set_jwt)
            return JSONResponse({'token': encoded_jwt, "id": str(user["_id"])},
                                status_code=200)
        else:
            return JSONResponse({'message': 'Login failed. Wrong password.'}, status_code=400)
    else:
        return JSONResponse({'message': 'Login failed. User not found.'}, status_code=404)


@router.post("/register")
@router.options("/register")
async def register_user(register_data: AuthItem, request: Request):
    user_query = jsonable_encoder(register_data)
    existing_user = request.app.database.users.find_one({"username": user_query["username"]})
    if existing_user:
        return {"message": "User already exists"}

    hashed_password = hashlib.sha256(user_query["password"].encode()).hexdigest()
    encoded_jwt = jwt_auth.get_encoded_jwt(user_query)

    user_query["password"] = hashed_password
    user_query["token"] = encoded_jwt
    user_query["ingredients"] = pickle.dumps([])
    user_query["meals"] = pickle.dumps([])

    request.app.database.users.insert_one(user_query)
    user = request.app.database.users.find_one(user_query)
    return {'token': encoded_jwt, "id": str(user.get("_id"))}


@router.post("/logout")
@router.options("/logout")
async def logout_user(request: Request):
    authorization = jwt_auth.get_authorisation(request)
    if authorization:
        try:
            decoded_jwt = jwt_auth.decode_jwt(authorization)
            user_query = {"username": decoded_jwt["username"]}
            request.app.database.users.update_one(user_query, {"$unset": {"token": ""}})
            return {"token": decoded_jwt}
        except Exception:
            return JSONResponse({"message": "Logout failed"}, status_code=500)
    else:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)


@router.post("/{user_id}/create_ingredient")
async def get_user_ingredients(request: Request, user_id: str, ingredient: UserIngredientCreation):
    token = jwt_auth.get_authorisation(request)
    if token is None:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)

    user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return JSONResponse({"message": "User not found!"}, status_code=404)
    existing_ingredient = request.app.database.ingredients.find_one({"_id": ingredient.id})
    ingredients = pickle.loads(user.get("ingredients"))
    new_ingredient = {
        "id": f"{existing_ingredient.get('_id')}",
        "label": existing_ingredient.get("name"),
        "category": existing_ingredient.get("category", "").replace("_", " ").capitalize(),
        "measure": ingredient.measure
    }
    for usr_ingredient in ingredients:
        if usr_ingredient.get("id") == new_ingredient.get("id"):
            return JSONResponse({"message": "Ingredient already exists!"}, status_code=400)

    ingredients.insert(0, dict(new_ingredient))
    set_ingredients = {"$set": {"ingredients": pickle.dumps(ingredients)}}
    request.app.database.users.update_one({"_id": ObjectId(user_id)}, set_ingredients)
    return JSONResponse(
        dict(new_ingredient)
    )


@router.get("/{user_id}/ingredients")
async def get_user_ingredients(request: Request, user_id: str, page: int = 0, perPage: int = 12):
    token = jwt_auth.get_authorisation(request)
    if token is None:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)

    user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return JSONResponse({"message": "User not found!"}, status_code=404)

    ingredients = pickle.loads(user.get("ingredients"))
    returnable_ingredients = ingredients[page * perPage: (page + 1) * perPage]
    return JSONResponse({"data": returnable_ingredients, "metadata": {"total": len(ingredients)}})


@router.delete("/{user_id}/delete_ingredient/{ingredient_id}")
async def delete_user_ingredient(request: Request, user_id: str, ingredient_id: str):
    token = jwt_auth.get_authorisation(request)
    if token is None:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)

    user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return JSONResponse({"message": "User not found!"}, status_code=404)

    ingredients = pickle.loads(user.get("ingredients"))
    ingredient_to_delete = None
    for ingredient in ingredients:
        if ingredient.get("id") == ingredient_id:
            ingredient_to_delete = ingredient
            ingredients.remove(ingredient)
            set_ingredients = {"$set": {"ingredients": pickle.dumps(ingredients)}}
            request.app.database.users.update_one({"_id": ObjectId(user_id)}, set_ingredients)
            return JSONResponse(ingredient_to_delete, status_code=200)
    return JSONResponse({"message": "Ingredient not found!"}, status_code=404)


@router.get("/{user_id}/possible_meals")
def get_possible_meals(request: Request, user_id: str, page: int = 0, perPage: int = 12):
    token = jwt_auth.get_authorisation(request)
    if token is None:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)

    user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return JSONResponse({"message": "User not found!"}, status_code=404)

    ingredients = pickle.loads(user.get("ingredients"))
    user_ingredients_names = [ingredient.get("label") for ingredient in ingredients]
    suitable_meals = []
    for user_ingredient in user_ingredients_names:
        url = f"{MEAL_API_BASE_URL}/filter.php?i={user_ingredient}"
        response = requests.get(url)
        if response.status_code == 200:
            meals = response.json().get("meals")
            if meals is not None:
                for short_meal in meals:
                    meal_url = f"{MEAL_API_BASE_URL}/lookup.php?i={short_meal.get('idMeal')}"
                    meal_response = requests.get(meal_url)
                    if meal_response.status_code == 200:
                        meal = meal_response.json().get("meals")[0]
                        meal_ingredients = []
                        for i in range(1, 21):
                            ingredient = meal.get(f"strIngredient{i}")
                            if ingredient is not None:
                                meal_ingredients.append(ingredient)
                        if sum(item.lower() in meal_ingredients for item in user_ingredients_names) >= 2:
                            if utils.build_meal(meal) not in suitable_meals:
                                suitable_meals.append(utils.build_meal(meal))
                        else:
                            continue
    return JSONResponse({"data": suitable_meals[page * perPage: (page + 1) * perPage], "metadata": {"total": len(suitable_meals)}})
