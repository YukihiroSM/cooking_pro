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

import { PREVENT_BUG, REACT_QUERY_KEYS } from '../consts/app-keys.const';

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
import { NumberParam, StringParam, useQueryParam } from 'use-query-params';
import { MyIngredientsParam } from '../utils';

export const useSingleMeal = (): ISingleMealResponse => {
  const { mealID } = useParams<Params>();
  return useQuery<Meal, AxiosError<AxiosResponse, any> | null>(
    [REACT_QUERY_KEYS.SINGLE_MEAL, mealID],
    () => getSingleMeal(mealID || PREVENT_BUG)
  );
};

export const useMealsByIngredients = (): IAllMealsResponse => {
  const [searchParams] = useSearchParams();
  const [ingredients] = useQueryParam('ingredients', MyIngredientsParam);
  const [page] = useQueryParam('page', NumberParam);
  const [perPage] = useQueryParam('perPage', NumberParam);
  return useQuery<MealsResponseData, AxiosError<AxiosResponse, any> | null>(
    [REACT_QUERY_KEYS.MEALS_BY_INGREDIENTS, ingredients, page, perPage],
    () => getMealsByIngredients(searchParams)
  );
};

export const useMealsByCategory = (): IAllMealsResponse => {
  const [searchParams] = useSearchParams();
  const [category] = useQueryParam('category', StringParam);
  const [page] = useQueryParam('page', NumberParam);
  const [perPage] = useQueryParam('perPage', NumberParam);
  return useQuery<MealsResponseData, AxiosError<AxiosResponse, any> | null>(
    [REACT_QUERY_KEYS.MEALS_BY_CATEGORY, category, page, perPage],
    () => getMealsByCategory(category || 'Breakfast', searchParams)
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
