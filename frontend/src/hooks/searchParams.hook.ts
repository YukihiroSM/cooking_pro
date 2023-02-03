import { useEffect, useMemo, useState } from 'react';
import { URLSearchParams } from 'url';
import { useSearchParams } from 'react-router-dom';
import { debounce } from '../utils';

export function useSetSearchParams() {
  const defaultParams = {
    category: '',
    ingredient: '',
    userID: '',
    page: 0,
    perPage: 10,
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<any>(defaultParams);
  const [trigger, setTrigger] = useState<number>(Date.now());

  const setParam = (key: string, value: number | string) => {
    searchParams.set(key.toString(), value.toString());
    params[key] = value;
    setParams({ ...params });
  };

  const resetParams = () => {
    searchParams.delete('category');
    searchParams.delete('ingredient');
    searchParams.delete('userID');
    setParams(defaultParams);
  };

  const updateParams = useMemo(
    () =>
      debounce((p: URLSearchParams) => {
        setSearchParams(p);
        setTrigger(Date.now());
      }),
    []
  );

  useEffect(() => {
    updateParams(searchParams);
  }, [params]);

  return {
    params,
    trigger,
    setParam,
    resetParams,
  };
}
