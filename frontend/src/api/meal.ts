import { URLSearchParams } from 'url';
import { mealService } from '../services';

const getCategoriesAndIngredients = async () => {
  const { data } = await mealService.getCategoriesAndIngredients();
  return data;
};

const getMealsByFilter = async (params: URLSearchParams) => {
  const { data } = await mealService.getMealsByFilter(params);
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
  getMealsByFilter,
  getRandomMeals,
  getSingleMeal,
  getCategoriesAndIngredients,
};
