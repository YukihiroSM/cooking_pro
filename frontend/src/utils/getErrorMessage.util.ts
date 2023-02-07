import { AxiosError } from 'axios';
import { AxiosResponse } from '../types';

export const getErrorMessage = (
  error: AxiosError<AxiosResponse, any> | undefined
): string | undefined => error?.response?.data?.message;
