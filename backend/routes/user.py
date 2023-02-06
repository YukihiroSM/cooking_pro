from http.client import HTTPException
from typing import List
from fastapi.responses import JSONResponse
import requests
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from utils import collect_ingredients_categories
from constants import MEAL_API_BASE_URL
from bson.objectid import ObjectId
from schemas import AuthItem, UserIngredientCreation, UserIngredient
import jwt_auth
import hashlib
import pickle
import constants

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
def get_user_ingredients(request: Request, user_id: str, ingredient: UserIngredientCreation):
    token = jwt_auth.get_authorisation(request)
    if token is None:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)

    user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return JSONResponse({"message": "User not found!"}, status_code=404)
    existing_ingredient = request.app.database.ingredients.find_one({"_id": ingredient.id})
    ingredients = pickle.loads(user.get("ingredients"))
    new_ingredient = {
        "id": f"{existing_ingredient.get('_id')} - {user_id}",
        "label": existing_ingredient.get("name"),
        "category": existing_ingredient.get("category"),
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
def get_user_ingredients(request: Request, user_id: str, page: int = 0, perPage: int = 12):
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
def delete_user_ingredient(request: Request, user_id: str, ingredient_id: str):
    token = jwt_auth.get_authorisation(request)
    if token is None:
        return JSONResponse({"message": "User not authorised!"}, status_code=401)

    user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        return JSONResponse({"message": "User not found!"}, status_code=404)

    ingredients = pickle.loads(user.get("ingredients"))
    for ingredient in ingredients:
        if ingredient.get("id") == ingredient_id:
            ingredients.remove(ingredient)
            set_ingredients = {"$set": {"ingredients": pickle.dumps(ingredients)}}
            request.app.database.users.update_one({"_id": ObjectId(user_id)}, set_ingredients)
            return JSONResponse({"message": "Ingredient deleted!"}, status_code=200)

    return JSONResponse({"message": "Ingredient not found!"}, status_code=404)


# @router.get("/{user_id}/meals")
# def get_possible_meals(request: Request, user_id: str, page: int=0, perPage: int=12):
#     token = jwt_auth.get_authorisation(request)
#     if token is None:
#         return JSONResponse({"message": "User not authorised!"}, status_code=401)
#
#     user = request.app.database.users.find_one({"_id": ObjectId(user_id)})
#     if user is None:
#         return JSONResponse({"message": "User not found!"}, status_code=404)
#
#     ingredients = pickle.loads(user.get("ingredients"))
#     ingredients_names = ",".join([ingredient.get("label") for ingredient in ingredients])
