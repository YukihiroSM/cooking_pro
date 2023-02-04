import { useEffect } from 'react';

import { useToast } from '@chakra-ui/react';

import { useUserPossibleMeals } from '../hooks';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';

export const UserPossibleMealsComponent = () => {
  const toast = useToast();

  const {
    isLoading,
    isError,
    error,
    data = { data: undefined, metadata: { total: 0 } },
  } = useUserPossibleMeals();

  const { data: meals, metadata } = data;
  const { total } = metadata;

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Something went wrong...',
        description: error?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isError]);

  return (
    <>
      {isLoading && <Loader />}
      {meals && <FilteredMealsComponent total={total} meals={meals} />}
    </>
  );
};
