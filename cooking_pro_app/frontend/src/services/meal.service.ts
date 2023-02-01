import { URLSearchParams } from 'url';

import HttpService from './http.service';

import { BACKEND_KEYS } from '../consts/app-keys.const';

class MealService extends HttpService {
  getCategoriesAndIngredients() {
    return this.get({
      url: BACKEND_KEYS.GET_CATEGORIES_AND_INGREDIENTS,
    });
  }

  getMealsByFilter(params: URLSearchParams) {
    return this.get({
      url: `${BACKEND_KEYS.GET_MEALS_BY_FILTER}?${params}`,
    });
  }

  getRandomMeal() {
    return this.get({ url: BACKEND_KEYS.GET_RANDOM_MEAL });
  }

  getSingleMeal(id: string) {
    return this.get({ url: `${BACKEND_KEYS.GET_SINGLE_MEAL}${id}` });
  }

  getUserMealsByIngredients(id: string) {
    return this.get({
      url: `${BACKEND_KEYS.GET_USER_MEALS_BY_INGREDIENTS}${id}`,
    });
  }
}

export const mealService = new MealService();
