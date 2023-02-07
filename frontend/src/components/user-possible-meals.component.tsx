import { useEffect } from 'react';

import { useToast, Stack, Container } from '@chakra-ui/react';

import { useUserPossibleMeals } from '../hooks';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';
import { PaginationComponent } from './pagination.component';

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
        description: error?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isError]);

  return (
    <Container bg={'light'} maxW={'full'} px={20} py={10}>
      {isLoading && <Loader />}
      <Stack
        direction={'column'}
        spacing={10}
        maxWidth={'100wv'}
        w={'full'}
        px={20}
        py={10}
        m={0}
      >
        {meals && <FilteredMealsComponent meals={meals} />}
        {total && <PaginationComponent total={total} />}
      </Stack>
    </Container>
  );
};
