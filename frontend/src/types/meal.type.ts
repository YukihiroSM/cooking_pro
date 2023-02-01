import { Ingredient } from './ingredient.type';

type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strIngredients: Ingredient[];
  strMeasures: string[];
};

export type { Meal };
