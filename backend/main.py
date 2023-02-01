import pymongo.errors
from fastapi import FastAPI
import jwt
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

from routes import meals
from routes import ingredients

SECRET_KEY = "my_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800
dummy_user = {
    "username": "test",
    "password": "test",
}
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


class LoginItem(BaseModel):
    username: str
    password: str


class TestItem(BaseModel):
    token: str


@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient('mongodb://mongoadmin:bdung@127.0.0.1:27017')
    app.database = app.mongodb_client["users"]
    user = {"username": "test", "password": "test", "name": "hellllloooooo!!!", "token": ""}
    try:
        app.database.create_collection("users")
    except pymongo.errors.CollectionInvalid:
        pass
    app.collection = app.database.get_collection("users")
    app.collection.insert_one(user)
    user = app.collection.find_one({"username": "test"})
    print(f"test_user: {user}")
    print("Connected to the MongoDB database!")


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()


@app.get("/ping")
def ping():
    return "ok"


@app.options("/login")
@app.post("/login")
async def login_user(login_item: LoginItem):
    data = jsonable_encoder(login_item)
    user_name = data['username']
    password = data['password']
    user_query = {"username": user_name, "password": password}
    user = app.collection.find_one(user_query)
    if user:
        encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        set_jwt = {"$set": {"token": encoded_jwt}}
        app.collection.update_one(user_query, set_jwt)
        return {'token': encoded_jwt, "username": user_name}
    else:
        return {'message': 'Login failed'}


@app.post("/test_sending_token")
@app.options("/test_sending_token")
def test_token(request: TestItem):
    data = jsonable_encoder(request)
    token = data["token"]
    user = app.collection.find_one({"token": token})
    print(user)
