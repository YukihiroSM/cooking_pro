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
} from '../types';

import { REACT_QUERY_KEYS } from '../consts';
import { queryClient } from '../App';

const useUserData = (id: string | undefined): IUserIngredientsResponse => {
  let ingredients: IUserIngredientsResponse;

  if (!id) {
    ingredients = {
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: { message: 'Unauthorized' },
      data: undefined,
    };
  } else {
    ingredients = useQuery<
      IngredientsByCategory[],
      AxiosError<AxiosResponse, any> | null
    >([REACT_QUERY_KEYS.USER_INGREDIENTS], () => getUserIngredients(id));
  }

  return ingredients;
};

const useCreateIngredient = (id: string | undefined) => {
  let createIngredient;
  if (!id) {
    createIngredient = {
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: { message: 'Unauthorized' },
      data: undefined,
    };
  } else {
    createIngredient = useMutation<
      IngredientsByCategory,
      AxiosError<AxiosResponse, any> | undefined,
      CreateIngredient
    >((ingredient) => createUserIngredient(id, ingredient), {
      onSuccess: (ingredient: IngredientsByCategory) => {
        queryClient.setQueryData(
          [REACT_QUERY_KEYS.USER_INGREDIENTS],
          (currentIngredients: IngredientsByCategory[] = []) =>
            [...currentIngredients, ingredient] as IngredientsByCategory[]
        );
      },
    });
  }

  return createIngredient;
};

export const useUser = () => {
  const [error, setError] = useState<
    AxiosError<AxiosResponse, any> | undefined
  >();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [storageUser, setStorageUser] = useLocalStorage<LocalStorageUser>(
    'cooking-app-user',
    {
      id: undefined,
      token: undefined,
    }
  );

  const { id } = storageUser;

  const getUserIngredients: IUserIngredientsResponse = useUserData(id);
  const createUserIngredient = useCreateIngredient(id);

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
    getUserIngredients,
    createUserIngredient,
    error,
    isError,
    isLoading,
    isSuccess,
  };
};
