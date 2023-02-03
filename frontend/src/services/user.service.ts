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
    return this.get({ url: `${BACKEND_KEYS.GET_USER_INGREDIENTS}${id}` });
  }

  createUserIngredient(id: string, ingredient: CreateIngredient) {
    return this.post({
      url: `${BACKEND_KEYS.CREATE_USER_INGREDIENT}${id}`,
      data: ingredient,
    });
  }

  // --------- additional task --------- //
  // createUserMeal(id: string, meal: Meal) {
  //   return this.post({
  //     url: `${BACKEND_KEYS.CREATE_USER_MEAL}${id}`,
  //     data: meal,
  //   });
  // }
}

export const userService = new UserService();
