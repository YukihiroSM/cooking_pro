import { useEffect, useState } from 'react';

import Select, { SingleValue } from 'react-select';

import {
  FormLabel,
  Box,
  FormControl,
  Container,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import { useCategoriesAndIngredients, useMealsByFilter } from '../hooks';
import { Meal, NavItemFilter, Notification, SortBy } from '../types';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';
import { PaginationComponent } from './pagination.component';
import { sortByComplexity } from '../utils';
import { SORT_BY_OPTIONS } from '../consts';
import { StringParam, useQueryParam } from 'use-query-params';
import { NotificationComponent } from './notification.component';

export const MealsByCategoryComponent = () => {
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  const [category, setCategory] = useQueryParam('category', StringParam);
  const [filtered, setFiltered] = useState<Meal[] | undefined>([]);
  const [options, setOptions] = useState<NavItemFilter[] | undefined>(
    undefined
  );

  const {
    isLoading: isLoadingNav,
    isError: isErrorNav,
    error: errorNav,
    data: navItems,
  } = useCategoriesAndIngredients();

  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    data: dataAll = { data: undefined, metadata: { total: undefined } },
  } = useMealsByFilter();
  const { data: meals, metadata } = dataAll;

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
    if (!isLoadingNav && !isLoadingAll && !filtered?.length && !meals?.length) {
      setNotification({
        status: 'info',
      });
    }
  }, [filtered, isLoadingAll, meals]);

  useEffect(() => {
    setOptions(
      navItems
        ?.find((item) => item.label === 'Ingredients')
        ?.children?.map((item) => ({ ...item, value: item.label }))
    );
  }, [navItems]);

  useEffect(() => {
    if (isErrorNav || isErrorAll) {
      setNotification({
        status: 'error',
        error: errorNav || errorAll || undefined,
      });
    }
  }, [isErrorNav, isErrorAll]);

  return (
    <Container bg={'light'} maxW={'full'} px={{ sm: 5, md: 10 }} py={10}>
      {notification && <NotificationComponent notification={notification} />}
      {(isLoadingNav || isLoadingAll) && <Loader />}
      <Container maxW={'none'} m={0} p={0}>
        <FormControl>
          <Grid columnGap={10} templateColumns={'repeat(2, 1fr)'}>
            <GridItem>
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
                  isDisabled={isLoadingNav || isLoadingAll}
                  name='ingredients-sorting-method'
                  options={SORT_BY_OPTIONS}
                  placeholder='Sort by...'
                  closeMenuOnSelect
                  onChange={handleSortingMethod}
                />
              </Box>
            </GridItem>
            <GridItem>
              <Box w={'full'}>
                <FormLabel>
                  Choose recipe <strong>by category</strong>
                </FormLabel>
                <Select
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: 'silver',
                      primary: 'orange',
                    },
                  })}
                  isSearchable
                  isDisabled={isLoadingNav || isLoadingAll}
                  name='recipe-by-category'
                  options={options}
                  placeholder='Select recipes category...'
                  closeMenuOnSelect={true}
                  defaultValue={
                    {
                      label: category,
                      value: category,
                    } as NavItemFilter
                  }
                  onChange={(newValue: SingleValue<NavItemFilter>) => {
                    setCategory(newValue?.label);
                  }}
                />
              </Box>
            </GridItem>
          </Grid>
        </FormControl>
      </Container>
      {filtered && <FilteredMealsComponent meals={filtered} />}
      {metadata?.total && <PaginationComponent total={metadata?.total || 0} />}
    </Container>
  );
};
