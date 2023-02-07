import { useEffect, useState } from 'react';

import Select, { SingleValue } from 'react-select';

import {
  useToast,
  Stack,
  Container,
  Box,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

import { useUserPossibleMeals } from '../hooks';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';
import { PaginationComponent } from './pagination.component';
import { SORT_BY_OPTIONS } from '../consts';
import { Meal, SortBy } from '../types';
import { sortByComplexity } from '../utils';

export const UserPossibleMealsComponent = () => {
  const toast = useToast();
  const [filtered, setFiltered] = useState<Meal[] | undefined>();

  const {
    isLoading,
    isError,
    error,
    data = { data: undefined, metadata: { total: 0 } },
  } = useUserPossibleMeals();
  const { data: meals, metadata } = data;
  const { total } = metadata;

  const handleSortingMethod = (method: SingleValue<SortBy>) => {
    const { value } = method as SortBy;
    switch (value) {
      case 'random':
        setFiltered([...(meals as Meal[])]);
        break;
      case 'ascending':
        setFiltered(
          sortByComplexity<Meal>([...(meals as Meal[])], 'ascending')
        );
        break;
      case 'descending':
        setFiltered(
          sortByComplexity<Meal>([...(meals as Meal[])], 'descending')
        );
        break;
    }
  };

  useEffect(() => {
    setFiltered(meals);
  }, [meals]);

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
        <FormControl>
          <Box>
            <FormLabel>Choose sorting</FormLabel>
            <Select
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: 'silver',
                  primary: 'orange',
                },
              })}
              isDisabled={isLoading}
              name='ingredients-sorting-method'
              options={SORT_BY_OPTIONS}
              placeholder='Sort by...'
              closeMenuOnSelect
              onChange={handleSortingMethod}
            />
          </Box>
        </FormControl>
        {filtered && <FilteredMealsComponent meals={filtered} />}
        {total && <PaginationComponent total={total} />}
      </Stack>
    </Container>
  );
};
