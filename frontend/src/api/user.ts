import { CreateIngredient, User } from '../types';
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

const getUserPossibleMeals = async (id: string, params: URLSearchParams) => {
  const { data } = await userService.getUserPossibleMeals(id, params);
  return data;
};

const createUserIngredient = async (
  id: string,
  ingredient: CreateIngredient
) => {
  const { data } = await userService.createUserIngredient(id, ingredient);
  return data;
};

export {
  registerUser,
  loginUser,
  getUserIngredients,
  createUserIngredient,
  getUserPossibleMeals,
};
