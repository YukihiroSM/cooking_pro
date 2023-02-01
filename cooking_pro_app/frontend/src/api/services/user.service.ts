import HttpService from './http.service';
import { Ingredient, User, Meal } from '../../types';
import { BACKEND_KEYS } from '../../consts';
import { URLSearchParams } from 'url';

class UserService extends HttpService {
  registerUser(user: User) {
    return this.post(
      {
        url: BACKEND_KEYS.REGISTER_USER,
        data: user,
      },
      false
    );
  }

  loginUser(user: User) {
    return this.post({ url: BACKEND_KEYS.LOGIN_USER, data: user }, false);
  }

  getUserIngredients(id: string) {
    return this.get({ url: `${BACKEND_KEYS.GET_USER_INGREDIENTS}${id}` });
  }

  getUserIngredientsByCategory(id: string, params: URLSearchParams) {
    return this.get({
      url: `${BACKEND_KEYS.GET_USER_INGREDIENTS}${id}?${params}`,
    });
  }

  getUserMeals(id: string) {
    return this.get({ url: `${BACKEND_KEYS.GET_USER_MEALS}${id}` });
  }

  createUserIngredient(id: string, ingredient: Ingredient) {
    return this.post({
      url: `${BACKEND_KEYS.CREATE_USER_INGREDIENT}${id}`,
      data: ingredient,
    });
  }

  createUserMeal(id: string, meal: Meal) {
    return this.post({
      url: `${BACKEND_KEYS.CREATE_USER_MEAL}${id}`,
      data: meal,
    });
  }
}

export const userService = new UserService();
