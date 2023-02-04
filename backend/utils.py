import csv


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

