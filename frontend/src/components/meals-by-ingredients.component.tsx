import { useEffect, useState } from 'react';

import { useQueryParam } from 'use-query-params';

import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

import {
  useToast,
  FormLabel,
  Box,
  FormControl,
  Container,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import { useCategoriesAndIngredients, useMealsByFilter } from '../hooks';
import { Meal, NavItem, NavItemFilter, Notification, SortBy } from '../types';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';
import { PaginationComponent } from './pagination.component';

import { SORT_BY_OPTIONS } from '../consts';
import { sortByComplexity } from '../utils';

import { MyIngredientsParam } from '../utils';
import { NotificationComponent } from './notification.component';

const animatedComponents = makeAnimated();

export const MealsByIngredientsComponent = () => {
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  const [filtered, setFiltered] = useState<Meal[] | undefined>([]);
  const [ingredients, setIngredients] = useQueryParam(
    'ingredients',
    MyIngredientsParam
  );
  const [optionsCategories, setOptionsCategories] = useState<
    NavItemFilter[] | undefined
  >(undefined);
  const [optionsIngredients, setOptionsIngredients] = useState<
    NavItemFilter[] | undefined
  >(undefined);
  const [ingredientsCategory, setIngredientsCategory] =
    useState<NavItemFilter>();

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
    setOptionsCategories(
      navItems
        ?.find((item) => item.label === 'Ingredients')
        ?.children?.map((item) => ({ ...item, value: item.label }))
    );
  }, [navItems]);

  useEffect(() => {
    setOptionsIngredients(
      ingredientsCategory?.children?.map((item) => ({
        ...item,
        value: item.label,
      }))
    );
  }, [ingredientsCategory]);

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
          <Grid
            columnGap={10}
            templateColumns={{ sm: 'none', md: 'repeat(3, 1fr)' }}
            templateRows={{ sm: 'repeat(3, 1fr)', md: 'none' }}
          >
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
              <Box>
                <FormLabel>Choose category *</FormLabel>
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
                  name='ingredients-by-category'
                  options={optionsCategories}
                  placeholder='Select ingredients category...'
                  closeMenuOnSelect
                  onChange={(newValue: SingleValue<NavItemFilter>) =>
                    setIngredientsCategory(newValue as NavItemFilter)
                  }
                />
              </Box>
            </GridItem>
            <GridItem>
              <Box>
                <FormLabel>
                  Choose ingredient <strong>by ingredients</strong>
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
                  isDisabled={
                    isLoadingNav || isLoadingAll || !ingredientsCategory
                  }
                  isMulti
                  name='ingredients'
                  options={optionsIngredients}
                  placeholder='Select some ingredients...'
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  defaultValue={
                    {
                      label: ingredients && ingredients[0],
                      value: ingredients && ingredients[0],
                    } as NavItemFilter
                  }
                  onChange={(
                    newValue: MultiValue<NavItem>,
                    { action, removedValue }: any
                  ) => {
                    if (action === 'remove-value') {
                      const filtered = ingredients?.filter(
                        (ingredient) => ingredient !== removedValue.label
                      );
                      setIngredients(
                        filtered && ingredients?.length === 1
                          ? [...filtered, ...ingredients]
                          : filtered
                      );
                    }
                    if (action === 'clear') {
                      setIngredients(ingredients?.slice(0, 1));
                    }
                    if (action === 'select-option') {
                      setIngredients(
                        newValue.map((item: NavItem) => item.label)
                      );
                    }
                  }}
                />
              </Box>
            </GridItem>
          </Grid>
        </FormControl>
      </Container>
      {filtered && <FilteredMealsComponent meals={filtered} />}
      <PaginationComponent total={metadata?.total || 0} />
    </Container>
  );
};
