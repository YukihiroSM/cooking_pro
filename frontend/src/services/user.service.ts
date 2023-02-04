import HttpService from './http.service';
import { CreateIngredient, User } from '../types';
import { BACKEND_KEYS } from '../consts';

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
    return this.get({ url: `user/${id}${BACKEND_KEYS.USER_INGREDIENTS}` });
  }

  getUserPossibleMeals(id: string, params: URLSearchParams) {
    return this.get({
      url: `user/${id}${BACKEND_KEYS.USER_POSSIBLE_MEALS}?${params}`,
    });
  }

  createUserIngredient(id: string, ingredient: CreateIngredient) {
    return this.post({
      url: `user/${id}${BACKEND_KEYS.CREATE_USER_INGREDIENT}`,
      data: ingredient,
    });
  }
}

export const userService = new UserService();
