from http.client import HTTPException
from typing import List

import requests
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from utils import collect_ingredients_categories
from constants import MEAL_API_BASE_URL
from schemas import AuthItem
import jwt_auth
import hashlib

router = APIRouter(prefix="/api/user")

@router.post("/login")
@router.options("/login")
async def login_user(login_data: AuthItem, request: Request):
    user_query = jsonable_encoder(login_data)
    user = request.app.database.collection.find_one(user_query)
    if user:
        if jwt_auth.verify_password(user_query["password"], user["password"]):
            encoded_jwt = jwt_auth.get_encoded_jwt(user_query)
            set_jwt = {"$set": {"token": encoded_jwt}}
            request.app.database.collection.update_one(user_query, set_jwt)
            return {'token': encoded_jwt, "username": user_query["username"]}
        else:
            return {'message': 'Login failed. Wrong password.'}
    else:
        return {'message': 'Login failed. No such user.'}


@router.post("/register")
@router.options("/register")
async def register_user(register_data: AuthItem, request: Request):
    user_query = jsonable_encoder(register_data)
    existing_user = request.app.database.collection.find_one({"username": user_query["username"]})
    if existing_user:
        return {"message": "User already exists"}
    
    hashed_password = hashlib.sha256(user_query["password"].encode()).hexdigest()
    encoded_jwt = jwt_auth.get_encoded_jwt(user_query)

    user_query["password"] = hashed_password
    user_query["token"] = encoded_jwt
    user_query["ingredients"] = ''
    user_query["meals"] = ''

    request.app.database.collection.insert_one(user_query)
    return {'token': encoded_jwt, "username": user_query["username"], "message": "User registered successfully"}


@router.post("/logout")
@router.options("/logout")
async def logout_user(request: Request):
    authorization = request.headers.get("Authorization")
    if authorization:
        try:
            decoded_jwt = jwt_auth.decode_jwt(authorization)
            user_query = {"username": decoded_jwt["username"]}
            request.app.database.collection.update_one(user_query, {"$unset": {"token": ""}})
            return {"token": decoded_jwt, "message": "User logged out successfully"}
        except Exception:
            return {"message": "Logout failed"}
    else:
        return {"message": "No authorization found"}

