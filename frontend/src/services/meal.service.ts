import { URLSearchParams } from 'url';

import HttpService from './http.service';

import { BACKEND_KEYS } from '../consts/app-keys.const';

class MealService extends HttpService {
  getCategoriesAndIngredients() {
    return this.get(
      {
        url: BACKEND_KEYS.GET_CATEGORIES_AND_INGREDIENTS,
      },
      false
    );
  }

  getMealsByFilter(params: URLSearchParams) {
    return this.get(
      {
        url: `${BACKEND_KEYS.GET_MEALS_BY_FILTER}?${params}`,
      },
      false
    );
  }

  getRandomMeals() {
    return this.get({ url: BACKEND_KEYS.GET_RANDOM_MEALS }, false);
  }

  getSingleMeal(id: string) {
    return this.get({ url: `${BACKEND_KEYS.GET_SINGLE_MEAL}${id}` }, false);
  }
}

export const mealService = new MealService();
