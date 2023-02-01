import { URLSearchParams } from 'url';
import { mealService } from './services/meal.service';

const getMealsByCategory = async (params: URLSearchParams) => {
  const { data } = await mealService.getMealsByCategory(params);
  return data;
};

const getMealsByIngredient = async (params: URLSearchParams) => {
  const { data } = await mealService.getMealsByIngredient(params);
  return data;
};

const getRandomMeal = async () => {
  const { data } = await mealService.getRandomMeal();
  return data;
};

const getSingleMeal = async (id: string) => {
  const { data } = await mealService.getSingleMeal(id);
  return data;
};

export {
  getMealsByCategory,
  getMealsByIngredient,
  getRandomMeal,
  getSingleMeal,
};
