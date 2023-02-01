import { URLSearchParams } from 'url';

import HttpService from './http.service';

import { BACKEND_KEYS } from '../../consts/app-keys.const';

class MealService extends HttpService {
  getMealsByCategory(params: URLSearchParams) {
    return this.get({
      url: `${BACKEND_KEYS.GET_MEALS_BY_CATEGORY}?${params}`,
    });
  }

  getMealsByIngredient(params: URLSearchParams) {
    return this.get({
      url: `${BACKEND_KEYS.GET_MEALS_BY_INGREDIENT}?${params}`,
    });
  }

  getRandomMeal() {
    return this.get({ url: BACKEND_KEYS.GET_RANDOM_MEAL });
  }

  getSingleMeal(id: string) {
    return this.get({ url: `${BACKEND_KEYS.GET_SINGLE_MEAL}${id}` });
  }
}

export const mealService = new MealService();
