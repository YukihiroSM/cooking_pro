import requests
from constants import MEAL_API_BASE_URL


def initial_ingredients_collection():
    response = requests.get(f"{MEAL_API_BASE_URL}/list.php?i=list")
    if response.ok:
        response_data = response.json()
        for ingredient in response_data["meals"]:
            print(ingredient["strIngredient"])


initial_ingredients_collection()