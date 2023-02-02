from typing import List

from entity.Ingredient import Ingredient


class Meal(object):
    def __init__(self, id, name, category, area, instructions, ingredients: List[Ingredient]):
        self.id = id
        self.name = name
        self.category = category
        self.area = area
        self.instructions = instructions
        self.ingredients = ingredients


