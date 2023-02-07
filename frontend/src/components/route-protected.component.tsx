import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';
import { useLocalStorage } from '../hooks';
import { LocalStorageUser } from '../types';

import { ROUTER_KEYS } from '../consts';

export const ProtectedRoute = ({ children }: any) => {
  const [{ id, token }] = useLocalStorage<LocalStorageUser>(
    'cooking-app-user',
    {
      id: undefined,
      token: undefined,
    }
  );

  if (!token || !id) {
    return <Navigate to={ROUTER_KEYS.USER_LOGIN} replace />;
  }

  return children || <Outlet />;
};
