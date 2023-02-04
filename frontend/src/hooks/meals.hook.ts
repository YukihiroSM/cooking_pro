import { useQuery } from '@tanstack/react-query';

import { useSearchParams, useParams } from 'react-router-dom';

import { AxiosError } from 'axios';

import {
  getRandomMeals,
  getSingleMeal,
  getCategoriesAndIngredients,
  getMealsByIngredients,
  getMealsByCategory,
} from '../api/meal';

import { REACT_QUERY_KEYS } from '../consts/app-keys.const';

import {
  AxiosResponse,
  NavItem,
  IAllMealsResponse,
  ICategoriesAndIngredientsResponse,
  IRandomMealsResponse,
  ISingleMealResponse,
  Meal,
  MealsResponseData,
  Params,
} from '../types';

const error = {
  isLoading: false,
  isError: true,
  isSuccess: false,
  error: { message: 'Something went wrong...' },
  data: undefined,
};

const skip = {
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
  data: undefined,
};

export const useSingleMeal = (): ISingleMealResponse => {
  const { mealID } = useParams<Params>();
  return !mealID
    ? error
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useQuery<Meal, AxiosError<AxiosResponse, any> | null>(
        [REACT_QUERY_KEYS.SINGLE_MEAL, mealID],
        () => getSingleMeal(mealID)
      );
};

export const useMealsByIngredients = (): IAllMealsResponse => {
  const [searchParams] = useSearchParams();
  return useQuery<MealsResponseData, AxiosError<AxiosResponse, any> | null>(
    [REACT_QUERY_KEYS.MEALS_BY_INGREDIENTS, searchParams.get('ingredients')],
    () => getMealsByIngredients(searchParams)
  );
};

export const useMealsByCategory = (
  carouselCategory: string | undefined
): IAllMealsResponse => {
  const [searchParams] = useSearchParams();
  const { category } = useParams<Params>();
  return !carouselCategory
    ? skip
    : !category
    ? error
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useQuery<MealsResponseData, AxiosError<AxiosResponse, any> | null>(
        [REACT_QUERY_KEYS.MEALS_BY_CATEGORY, category, carouselCategory],
        () => getMealsByCategory(category || carouselCategory, searchParams)
      );
};

export const useRandomMeals = (): IRandomMealsResponse => {
  return useQuery<Meal[], AxiosError<AxiosResponse, any> | null>(
    [REACT_QUERY_KEYS.RANDOM_MEAL],
    getRandomMeals
  );
};

export const useCategoriesAndIngredients =
  (): ICategoriesAndIngredientsResponse => {
    return useQuery<NavItem[], AxiosError<AxiosResponse, any> | null>(
      [REACT_QUERY_KEYS.CATEGORIES_AND_INGREDIENTS],
      getCategoriesAndIngredients
    );
  };
