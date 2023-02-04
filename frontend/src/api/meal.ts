import { URLSearchParams } from 'url';
import { mealService } from '../services';

const getCategoriesAndIngredients = async () => {
  const { data } = await mealService.getCategoriesAndIngredients();
  return data;
};

const getMealsByIngredients = async (params: URLSearchParams) => {
  const { data } = await mealService.getMealsByIngredients(params);
  return data;
};

const getMealsByCategory = async (
  category: string,
  params: URLSearchParams
) => {
  const { data } = await mealService.getMealsByCategory(category, params);
  return data;
};

const getRandomMeals = async () => {
  const { data } = await mealService.getRandomMeals();
  return data;
};

const getSingleMeal = async (id: string) => {
  const { data } = await mealService.getSingleMeal(id);
  return data;
};

export {
  getMealsByIngredients,
  getMealsByCategory,
  getRandomMeals,
  getSingleMeal,
  getCategoriesAndIngredients,
};
