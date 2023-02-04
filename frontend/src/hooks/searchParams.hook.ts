import { useEffect, useMemo, useState } from 'react';
// import { URLSearchParams } from 'url';
import { useSearchParams } from 'react-router-dom';
import { debounce } from '../utils';
import { SearchParams } from '../types';

export function useSetSearchParams() {
  const defaultParams: SearchParams = {
    page: 0,
    perPage: 10,
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<any>(defaultParams);
  const [trigger, setTrigger] = useState<number>(Date.now());

  const setParam = (
    key: number | string,
    value: number | string | string[] | number[]
  ) => {
    searchParams.set(key.toString(), value.toString());
    params[key] = value;
    setParams({ ...params });
  };

  const resetParams = () => {
    searchParams.delete('category');
    searchParams.delete('ingredient');
    searchParams.delete('userID');
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
    searchParams,
    setParam,
    resetParams,
  };
}
