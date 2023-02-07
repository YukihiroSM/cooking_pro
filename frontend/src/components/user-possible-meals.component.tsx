import { useEffect, useState } from 'react';

import Select, { SingleValue } from 'react-select';

import { Container, Box, FormControl, FormLabel } from '@chakra-ui/react';

import { useUserPossibleMeals } from '../hooks';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';
import { PaginationComponent } from './pagination.component';
import { SORT_BY_OPTIONS } from '../consts';
import { Meal, Notification, SortBy } from '../types';
import { sortByComplexity } from '../utils';
import { NotificationComponent } from './notification.component';

export const UserPossibleMealsComponent = () => {
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  const [filtered, setFiltered] = useState<Meal[] | undefined>();

  const {
    isLoading,
    isError,
    error,
    data = { data: undefined, metadata: { total: undefined } },
  } = useUserPossibleMeals();
  const { data: meals, metadata } = data;

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
    if (!isLoading && !filtered?.length && !meals?.length) {
      setNotification({
        status: 'info',
      });
    }
  }, [filtered]);

  useEffect(() => {
    if (isError) {
      setNotification({
        status: 'error',
        error: error || undefined,
      });
    }
  }, [isError]);

  return (
    <Container bg={'light'} maxW={'full'} px={{ sm: 5, md: 10 }} py={10}>
      {notification && <NotificationComponent notification={notification} />}
      {isLoading && <Loader />}
      <Container maxW={'none'} m={0} p={0}>
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
      </Container>
      {filtered && <FilteredMealsComponent meals={filtered} />}
      <PaginationComponent total={metadata?.total || 0} />
    </Container>
  );
};
