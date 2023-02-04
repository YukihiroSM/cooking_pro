type CreateIngredient = {
  id: string;
};

type Ingredient = {
  name: string;
  id: string;
};

type IngredientsByCategory = {
  category: string;
  ingredient: Ingredient[];
};

export type { CreateIngredient, Ingredient, IngredientsByCategory };
