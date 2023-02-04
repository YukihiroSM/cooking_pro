/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-confusing-arrow */
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  loginUser,
  registerUser,
  getUserIngredients,
  createUserIngredient,
  getUserPossibleMeals,
} from '../api/user';
import { useLocalStorage } from './localStorage.hook';

import {
  User,
  AxiosResponse,
  LocalStorageUser,
  Response,
  IngredientsByCategory,
  CreateIngredient,
  IUserIngredientsResponse,
  IngredientByCategoryResponse,
  MealsResponseData,
  IAllMealsResponse,
} from '../types';

import { REACT_QUERY_KEYS } from '../consts';
import { queryClient } from '../App';
import { useSearchParams } from 'react-router-dom';

const error = {
  isLoading: false,
  isError: true,
  isSuccess: false,
  error: { message: 'Unauthorized' },
  data: undefined,
};

export const useUserIngredients = (): IUserIngredientsResponse => {
  const [{ id }] = useLocalStorage<LocalStorageUser>('cooking-app-user', {
    id: undefined,
    token: undefined,
  });
  return !id
    ? error
    : useQuery<IngredientsByCategory[], AxiosError<AxiosResponse, any> | null>(
        [REACT_QUERY_KEYS.USER_INGREDIENTS],
        () => getUserIngredients(id)
      );
};

export const useUserPossibleMeals = (): IAllMealsResponse => {
  const [{ id }] = useLocalStorage<LocalStorageUser>('cooking-app-user', {
    id: undefined,
    token: undefined,
  });
  const [searchParams] = useSearchParams();
  return !id
    ? error
    : useQuery<MealsResponseData, AxiosError<AxiosResponse, any> | null>(
        [REACT_QUERY_KEYS.USER_POSSIBLE_MEALS],
        () => getUserPossibleMeals(id, searchParams)
      );
};

export const useCreateIngredient = () => {
  const [{ id }] = useLocalStorage<LocalStorageUser>('cooking-app-user', {
    id: undefined,
    token: undefined,
  });
  return !id
    ? error
    : useMutation<
        IngredientByCategoryResponse,
        AxiosError<AxiosResponse, any> | undefined,
        CreateIngredient
      >((ingredient) => createUserIngredient(id, ingredient), {
        onSuccess: (ingredient: IngredientByCategoryResponse) => {
          queryClient.setQueryData(
            [REACT_QUERY_KEYS.USER_INGREDIENTS],
            (currentIngredients: IngredientsByCategory[] = []) =>
              [...currentIngredients, ingredient] as IngredientsByCategory[]
          );
        },
      });
};

export const useUser = () => {
  const [error, setError] = useState<
    AxiosError<AxiosResponse, any> | undefined
  >();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [, setStorageUser] = useLocalStorage<LocalStorageUser>(
    'cooking-app-user',
    {
      id: undefined,
      token: undefined,
    }
  );

  const register = useMutation<
    Response,
    AxiosError<AxiosResponse, any> | undefined,
    User
  >(registerUser, {
    onSuccess: (user: Response) => {
      setStorageUser(user);
    },
  });

  const login = useMutation<
    Response,
    AxiosError<AxiosResponse, any> | undefined,
    User
  >(loginUser, {
    onSuccess: (user: Response) => {
      setStorageUser(user);
    },
  });

  const {
    mutate: mutateRegister,
    isLoading: isLoadingRegister,
    isSuccess: isSuccessRegister,
    isError: isErrorRegister,
    error: errorRegister,
  } = register;
  const {
    mutate: mutateLogin,
    isLoading: isLoadingLogin,
    isSuccess: isSuccessLogin,
    isError: isErrorLogin,
    error: errorLogin,
  } = login;

  const registerUserMutation = async (user: User) => {
    mutateRegister(user);
  };

  const loginUserMutation = (user: User) => {
    mutateLogin(user);
  };

  useEffect(() => {
    setIsError(isErrorRegister || isErrorLogin);
    setError(errorRegister || errorLogin || undefined);
  }, [isErrorRegister, isErrorLogin, errorRegister, errorLogin]);

  useEffect(() => {
    setIsLoading(isLoadingLogin || isLoadingRegister);
  }, [isLoadingLogin, isLoadingRegister]);

  useEffect(() => {
    setIsSuccess(isSuccessLogin || isSuccessRegister);
  }, [isSuccessLogin, isSuccessRegister]);

  return {
    registerUserMutation,
    loginUserMutation,
    error,
    isError,
    isLoading,
    isSuccess,
  };
};
