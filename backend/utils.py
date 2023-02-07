import csv

import requests
from fastapi.encoders import jsonable_encoder

import schemas
from constants import MEAL_API_BASE_URL


def initialise_ingredients(collection):
    with open("ingredient_categories.csv", "r") as f_handler:
        data = csv.reader(f_handler)
        for _id, row in enumerate(data):
            if _id == 0:
                continue
            try:
                collection.insert_one({"_id": row[0], "name": row[1], "category": row[2]})
            except Exception:
                return False
    return True


def collect_ingredients_measures(collection):
    pass
    # ingredients = [ingredient for ingredient in collection.distinct("name")]
    # print(len(ingredients))
    # for ingredient in ingredients:
    #     ingr_measure = None
    #     url = f"{MEAL_API_BASE_URL}/filter.php?i={ingredient}"
    #     response = requests.get(url)
    #     if response.ok:
    #         data = response.json().get("meals")
    #         if data is None:
    #             continue
    #         for meal_item in data:
    #             meal_id = meal_item.get("idMeal")
    #             url = f"{MEAL_API_BASE_URL}/lookup.php?i={meal_id}"
    #             response = requests.get(url)
    #             if response.ok:
    #                 meal_data = response.json().get("meals")
    #                 if meal_data is None:
    #                     continue
    #                 item = meal_data[0]
    #                 meal = build_meal(item)
    #                 try:
    #                     ingr_id = meal.get("ingredients").index(ingredient)
    #                 except ValueError:
    #                     continue
    #                 else:
    #                     ingr_measure = meal.get("measures")[ingr_id]
    #                     break
    #     if ingr_measure is None:
    #         ingr_measure = "N/A"
    #     print(f"{ingredient} - {ingr_measure}")

                # collection.update_one({"name": ingredient}, {"$addToSet": {"measure": measure}})



def collect_ingredients_categories(collection):
    categories = collection.distinct("category")
    ingredients_by_categories = []
    for category in categories:
        pretty_category = category.replace("_", " ").capitalize()
        category_obj = {
            "label": pretty_category,
            "children": []
        }
        ingredients = collection.find({"category": category})
        for ingredient in ingredients:
            ingredient_obj = {
                "id": ingredient.get("_id"),
                "label": ingredient.get("name")
            }
            category_obj["children"].append(ingredient_obj)
        ingredients_by_categories.append(category_obj)
    return ingredients_by_categories


def build_meal(data):
    ingredients = []
    measures = []
    for key in data.keys():
        if key.startswith("strIngredient") and data[key]:
            ingredients.append(data[key])
            measures.append(data["strMeasure" + key.replace("strIngredient", "")])
    meal = schemas.Meal(
        id=data.get("idMeal", None),
        name=data.get("strMeal", None),
        category=data.get("strCategory", None),
        area=data.get("strArea", None),
        instructions=data.get("strInstructions", None),
        image=data.get("strMealThumb", None),
        video=parse_video(data.get("strYoutube", None)),
        ingredients=ingredients,
        measures=measures
    )

    return jsonable_encoder(meal)


def parse_video(link: str):
    if link is None:
        return None
    key = link[link.find("=") + 1:]
    return f"https://www.youtube.com/embed/{key}?autoplay=1&mute=1"


def build_category(category):
    category = schemas.Category(
        id=category["idCategory"],
        name=category["strCategory"],
        description=category["strCategoryDescription"]
    )
    return jsonable_encoder(category)
