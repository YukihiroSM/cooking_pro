import { Ingredient, User } from '../types';
import { userService } from '../services/user.service';

const registerUser = async (user: User) => {
  const { data } = await userService.registerUser(user);
  return data;
};

const loginUser = async (user: User) => {
  const { data } = await userService.loginUser(user);
  return data;
};

const getUserIngredients = async (id: string) => {
  const { data } = await userService.getUserIngredients(id);
  return data;
};

const createUserIngredient = async (id: string, ingredient: Ingredient) => {
  const { data } = await userService.createUserIngredient(id, ingredient);
  return data;
};

// ---- additional task ---- /
// const createUserMeal = async (id: string, meal: Meal) => {
//   const { data } = await userService.createUserMeal(id, meal);
//   return data;
// };

export {
  registerUser,
  loginUser,
  getUserIngredients,
  createUserIngredient,
  // ---- additional task ---- /
  // createUserMeal,
};
