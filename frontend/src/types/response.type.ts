import { CreateIngredient, IngredientsByCategory } from './ingredient.type';

import { AxiosError } from 'axios';
import { Meal } from './meal.type';
import { Category } from './category.type';

type AxiosResponse = {
  message: string;
};

type Response = {
  id: string;
  token: string;
};

type MealsResponseData = {
  data: Meal[] | undefined;
  metadata: {
    total: number;
  };
};

interface NavItem {
  label: string;
  id?: string;
  children?: NavItem[];
}

interface NavItemFilter extends NavItem {
  value: string;
}

type IngredientByCategoryResponse = {
  name: string;
  id: string;
  category: string;
};

interface IMutationResponse {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: AxiosError<AxiosResponse, any> | null | undefined | AxiosResponse;
}

interface IUserIngredientsResponse extends IMutationResponse {
  data: IngredientsByCategory[] | undefined;
}

interface ISingleMealResponse extends IMutationResponse {
  data: Meal | undefined;
}

interface IAllMealsResponse extends IMutationResponse {
  data: MealsResponseData | undefined;
}

interface IRandomMealsResponse extends IMutationResponse {
  data: Meal[] | undefined;
}

interface ICategoriesAndIngredientsResponse extends IMutationResponse {
  data: NavItem[] | undefined;
}

export type {
  AxiosResponse,
  Response,
  IUserIngredientsResponse,
  ISingleMealResponse,
  IAllMealsResponse,
  MealsResponseData,
  IRandomMealsResponse,
  ICategoriesAndIngredientsResponse,
  NavItem,
  IngredientByCategoryResponse,
  NavItemFilter,
};
