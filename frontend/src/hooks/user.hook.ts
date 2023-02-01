/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-confusing-arrow */
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { useMutation } from '@tanstack/react-query';

import { loginUser, registerUser } from '../api/user';
import { useLocalStorage } from './localStorage.hook';

import { User, AxiosResponse, LocalStorageUser, Response } from '../types';

export function useUser() {
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
}
