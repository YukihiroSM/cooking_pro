from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from schemas import RecipeItem

router = APIRouter(prefix="/api/recipes")


@router.get("/")
async def get_recipe_by_meal_id(meal_id: str, request: Request):
    meal = request.app.database.meals.find_one({"id": meal_id})
    if not meal:
        return JSONResponse({"message": "Meal was not found."}, 404)
    recipe = RecipeItem(
        instructions=meal["instructions"],
        ingredients=meal["ingredients"],
        measures=["measures"]
    )
    return JSONResponse({"message": "Meal was found.", "recipe": recipe}, 200)

# @router.post("/create")
# async def create_recipe(recipe: RecipeItem, request: Request):
#     recipe_query = jsonable_encoder(recipe)
#
#     meal = request.app.database..insert_one(meal_query)
#     print(meal.inserted_id)
#     return JSONResponse({"message": "Meal was created successfully."}, 201)
