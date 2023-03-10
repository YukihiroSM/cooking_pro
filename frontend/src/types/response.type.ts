import { Ingredient } from './ingredient.type';

import { AxiosError } from 'axios';
import { Meal } from './meal.type';

type Notification = {
  status: 'info' | 'warning' | 'success' | 'error' | 'loading' | undefined;
  error?: AxiosError<AxiosResponse, any> | undefined;
  success?: string;
};

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
  measure?: string;
  id?: string;
  children?: NavItem[];
}

interface NavItemFilter extends NavItem {
  value: string;
}

type IngredientByCategoryResponse = {
  data: Ingredient[] | undefined;
  metadata: { total: number };
};

interface IMutationResponse {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: AxiosError<AxiosResponse, any> | null | undefined;
}

interface IUserIngredientsResponse extends IMutationResponse {
  data: IngredientByCategoryResponse | undefined;
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
  Notification,
};
