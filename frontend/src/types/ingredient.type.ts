type CreateIngredient = {
  id: string;
  measure: string;
};

type Ingredient = {
  id: string;
  label: string;
  category: string;
  measure: string;
};

export type { CreateIngredient, Ingredient };
