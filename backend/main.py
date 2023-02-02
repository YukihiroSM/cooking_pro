import pymongo.errors
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import jwt_auth
from models import LoginItem, TestItem
from routes import meals
from routes import ingredients

SECRET_KEY = "my_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800

app = FastAPI()
app.include_router(ingredients.router)
app.include_router(meals.router)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient('mongodb://mongoadmin:bdung@127.0.0.1:27017')
    app.database = app.mongodb_client.cooking_db
    try:
        app.database.create_collection("users")
    except pymongo.errors.CollectionInvalid:
        pass

    try:
        app.database.create_collection("ingredients")
    except pymongo.errors.CollectionInvalid:
        pass

    print("Connected to the MongoDB database!")


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()


@app.options("/login")
@app.post("/login")
async def login_user(login_item: LoginItem):
    user_query = jsonable_encoder(login_item)
    user = app.database.collection.find_one(user_query)
    if user:

        encoded_jwt = jwt_auth.get_encoded_jwt(user_query)
        set_jwt = {"$set": {"token": encoded_jwt}}
        app.database.collection.update_one(user_query, set_jwt)
        return {'token': encoded_jwt, "username": user_query["username"]}
    else:
        return {'message': 'Login failed. No such user.'}


@app.options("/test_sending_token")
@app.post("/test_sending_token")
def test_token(request: TestItem):
    data = jsonable_encoder(request)
    token = data["token"]
    user = app.collection.find_one({"token": token})
    print(user)
