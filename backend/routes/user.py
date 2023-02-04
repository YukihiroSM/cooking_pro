from http.client import HTTPException
from typing import List

import requests
from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from utils import collect_ingredients_categories
from constants import MEAL_API_BASE_URL
from schemas import AuthItem
import jwt_auth

router = APIRouter(prefix="/api/user")


@router.post("/login")
@router.options("/login")
async def login_user(login_item: AuthItem, request: Request):
    user_query = jsonable_encoder(login_item)
    user = request.app.database.collection.find_one(user_query)
    if user:
        encoded_jwt = jwt_auth.get_encoded_jwt(user_query)
        set_jwt = {"$set": {"token": encoded_jwt}}
        request.app.database.collection.update_one(user_query, set_jwt)
        return {'token': encoded_jwt, "username": user_query["username"]}
    else:
        return {'message': 'Login failed. No such user.'}


@router.post("/register")
@router.options("/register")
def login_user(register_data: AuthItem):
    pass
