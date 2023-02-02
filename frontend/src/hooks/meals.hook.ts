/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-confusing-arrow */
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useSearchParams, useParams } from 'react-router-dom';

import { AxiosError } from 'axios';

import {
  getMealsByFilter,
  getRandomMeals,
  getSingleMeal,
  getCategoriesAndIngredients,
} from '../api/meal';

import { REACT_QUERY_KEYS } from '../consts/app-keys.const';

import {
  AxiosResponse,
  CategoriesAndIngredients,
  IAllMealsResponse,
  ICategoriesAndIngredientsResponse,
  IRandomMealsResponse,
  ISingleMealResponse,
  Meal,
  MealsResponseData,
  Params,
} from '../types';

const useSingleMeal = () => {
  const { mealID } = useParams<Params>();
  let singleMeal: ISingleMealResponse;
  if (!mealID) {
    singleMeal = {
      isLoading: false,
      isError: false,
      isSuccess: false,
      error: { message: 'Unknown error' },
      data: undefined,
    };
  } else {
    singleMeal = useQuery<Meal, AxiosError<AxiosResponse, any> | null>(
      [REACT_QUERY_KEYS.SINGLE_MEAL],
      () => getSingleMeal(mealID)
    );
  }
  return singleMeal;
};

const useAllMeals = () => {
  const [trigger, setTrigger] = useState<number>(Date.now());
  const [searchParams] = useSearchParams();

  const allMeals: IAllMealsResponse = useQuery<
    MealsResponseData,
    AxiosError<AxiosResponse, any> | null
  >([REACT_QUERY_KEYS.ALL_MEALS, trigger], () =>
    getMealsByFilter(searchParams)
  );
  return { allMeals, setTrigger };
};

const useRandomMeals = () => {
  const randomMeals: IRandomMealsResponse = useQuery<
    Meal[],
    AxiosError<AxiosResponse, any> | null
  >([REACT_QUERY_KEYS.RANDOM_MEAL], getRandomMeals);
  return randomMeals;
};

const useCategoriesAndIngredients = () => {
  const categoriesAndIngredients: ICategoriesAndIngredientsResponse = useQuery<
    CategoriesAndIngredients,
    AxiosError<AxiosResponse, any> | null
  >([REACT_QUERY_KEYS.CATEGORIES_AND_INGREDIENTS], getCategoriesAndIngredients);
  return categoriesAndIngredients;
};

export const useMeal = () => {
  const singleMeal = useSingleMeal();
  const { allMeals, setTrigger } = useAllMeals();
  const randomMeals = useRandomMeals();
  const categoriesAndIngredients = useCategoriesAndIngredients();

  return {
    singleMeal,
    allMeals,
    randomMeals,
    categoriesAndIngredients,
    setTrigger,
  };
};
