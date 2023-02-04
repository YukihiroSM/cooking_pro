import pymongo.errors
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import jwt_auth
from schemas import AuthItem
from routes import meals, ingredients, user
import utils
import os
import certifi

ca = certifi.where()

SECRET_KEY = "my_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800

app = FastAPI()
app.include_router(ingredients.router)
app.include_router(meals.router)
app.include_router(user.router)
#
# origins = [
#     "http://localhost.tiangolo.com",
#     "https://localhost.tiangolo.com",
#     "http://localhost",
#     "http://localhost:8000",
#     "http://localhost:3000",
#     "http://127.0.0.1"
#     "http://127.0.0.1:8000"
#     "http://127.0.0.1:3000"
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_db_client():
    if os.environ.get("ENVIRONMENT") == "development":
        app.mongodb_client = MongoClient('mongodb://mongoadmin:bdung@dkrcomp-mongo:27017')
    else:
        app.mongodb_client = MongoClient(
            'mongodb+srv://cooking-db-admin:lh5zLcAz3HYIOwWD@cookingprocluster.jwyfoeq.mongodb.net/?retryWrites=true&w=majority',
            tlsCAFile=ca
        )
    app.database = app.mongodb_client.cooking_db
    try:
        app.database.create_collection("users")
    except pymongo.errors.CollectionInvalid:
        pass

    try:
        app.database.create_collection("ingredients")

    except pymongo.errors.CollectionInvalid:
        pass

    ingredient = app.database.ingredients.find_one({"_id": "1"})
    if not ingredient:
        if not utils.initialise_ingredients(app.database.ingredients):
            print("Unable to write Ingredients entities into DB!")

    print("Connected to the MongoDB database!")


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()


@app.get("/health")
def health():
    return {"status": "ok"}
