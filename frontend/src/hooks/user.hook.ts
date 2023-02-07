import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  loginUser,
  registerUser,
  getUserIngredients,
  createUserIngredient,
  getUserPossibleMeals,
  deleteUserIngredient,
} from '../api/user';
import { useLocalStorage } from './localStorage.hook';

import {
  User,
  AxiosResponse,
  LocalStorageUser,
  Response,
  IUserIngredientsResponse,
  MealsResponseData,
  IAllMealsResponse,
  CreateIngredient,
  Ingredient,
  IngredientByCategoryResponse,
} from '../types';

import { PREVENT_BUG, REACT_QUERY_KEYS } from '../consts';
import { queryClient } from '../App';
import { useSearchParams } from 'react-router-dom';

export const useUserIngredients = (): IUserIngredientsResponse => {
  const [{ id }] = useLocalStorage<LocalStorageUser>('cooking-app-user', {
    id: undefined,
    token: undefined,
  });
  return useQuery<
    IngredientByCategoryResponse,
    AxiosError<AxiosResponse, any> | null
  >([REACT_QUERY_KEYS.USER_INGREDIENTS], () =>
    getUserIngredients(id || 'invalid id to prevent bug')
  );
};

export const useUserPossibleMeals = (): IAllMealsResponse => {
  const [{ id }] = useLocalStorage<LocalStorageUser>('cooking-app-user', {
    id: undefined,
    token: undefined,
  });
  const [searchParams] = useSearchParams();
  return useQuery<MealsResponseData, AxiosError<AxiosResponse, any> | null>(
    [REACT_QUERY_KEYS.USER_POSSIBLE_MEALS],
    () => getUserPossibleMeals(id || PREVENT_BUG, searchParams)
  );
};

export const useUserIngredient = () => {
  const [error, setError] = useState<
    AxiosError<AxiosResponse, any> | undefined
  >();
  const [action, setAction] = useState<string>('');
  const [isError, setIsError] = useState<Boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [{ id }] = useLocalStorage<LocalStorageUser>('cooking-app-user', {
    id: undefined,
    token: undefined,
  });

  const createIngredient = useMutation<
    Ingredient,
    AxiosError<AxiosResponse, any> | undefined,
    CreateIngredient
  >((ingredient) => createUserIngredient(id || PREVENT_BUG, ingredient), {
    onSuccess: (ingredient: Ingredient) => {
      queryClient.setQueryData(
        [REACT_QUERY_KEYS.USER_INGREDIENTS],
        (
          { data, metadata }: IngredientByCategoryResponse = {
            data: [],
            metadata: { total: 0 },
          }
        ) =>
          ({
            data: [...(data as Ingredient[]), ingredient],
            metadata: { total: metadata.total + 1 },
          } as IngredientByCategoryResponse)
      );
    },
  });

  const deleteIngredient = useMutation<
    Ingredient,
    AxiosError<AxiosResponse, any> | undefined,
    string
  >((ingredientID) => deleteUserIngredient(id || PREVENT_BUG, ingredientID), {
    onSuccess: ({ id }: Ingredient) => {
      queryClient.setQueryData(
        [REACT_QUERY_KEYS.USER_INGREDIENTS],
        (
          { data, metadata }: IngredientByCategoryResponse = {
            data: [],
            metadata: { total: 0 },
          }
        ) =>
          ({
            data: data?.filter(
              (ingredient: Ingredient) => ingredient.id !== id
            ),
            metadata: { total: metadata.total - 1 },
          } as IngredientByCategoryResponse)
      );
    },
  });

  const {
    mutate: mutateDelete,
    isError: isErrorDelete,
    isSuccess: isSuccessDelete,
    error: errorDelete,
    isLoading: isLoadingDelete,
  } = deleteIngredient;
  const {
    mutate: mutateCreate,
    isSuccess: isSuccessCreate,
    isError: isErrorCreate,
    error: errorCreate,
    isLoading: isLoadingCreate,
  } = createIngredient;

  const deleteIngredientMutation = (ingredientID: string) => {
    mutateDelete(ingredientID);
  };

  const createIngredientMutation = (ingredient: CreateIngredient) => {
    mutateCreate(ingredient);
  };

  useEffect(() => {
    setIsError(isErrorCreate || isErrorDelete);
    setError(errorCreate || errorDelete || undefined);
  }, [isErrorCreate, isErrorDelete]);

  useEffect(() => {
    setIsSuccess(isSuccessDelete || isSuccessCreate);
    setAction(isSuccessCreate ? 'create' : 'delete');
  }, [isSuccessCreate, isSuccessDelete]);

  useEffect(() => {
    setIsLoading(isLoadingCreate || isLoadingDelete);
  }, [isLoadingCreate, isLoadingDelete]);

  return {
    deleteIngredientMutation,
    createIngredientMutation,
    isLoading,
    isError,
    isSuccess,
    error,
    action,
  };
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
