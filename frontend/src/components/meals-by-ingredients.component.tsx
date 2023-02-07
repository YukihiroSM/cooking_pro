import { useEffect, useState } from 'react';

import { useQueryParam } from 'use-query-params';

import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

import {
  Stack,
  useToast,
  FormLabel,
  Box,
  FormControl,
  Container,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import { useCategoriesAndIngredients, useMealsByIngredients } from '../hooks';
import { Meal, NavItem, NavItemFilter, SortBy } from '../types';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';
import { PaginationComponent } from './pagination.component';

import { MyIngredientsParam } from '../utils';

const animatedComponents = makeAnimated();

export const MealsByIngredientsComponent = () => {
  const [filtered, setFiltered] = useState<Meal[] | undefined>();
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
  const toast = useToast();

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
    data: dataAll = { data: undefined, metadata: { total: 0 } },
  } = useMealsByIngredients();
  const { data: meals, metadata } = dataAll;
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
    if (isErrorNav || isErrorAll) {
      toast({
        title: 'Something went wrong...',
        description:
          errorAll?.response?.data?.message ||
          errorNav?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isErrorNav, isErrorAll]);

  return (
    <Container bg={'light'} maxW={'full'} px={20} py={10}>
      {(isLoadingNav || isLoadingAll) && <Loader />}
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
          <Grid columnGap={10} templateColumns={'1fr repeat(2, 3fr)'}>
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
                <FormLabel>Choose category</FormLabel>
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
                  Choose recipe <strong>by ingredients</strong>
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
                    if ('remove-value') {
                      ingredients &&
                        ingredients.length > 1 &&
                        setIngredients(
                          ingredients?.filter(
                            (ingredient) => ingredient !== removedValue.label
                          )
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
        {filtered && <FilteredMealsComponent meals={filtered} />}
        {total && <PaginationComponent total={total} />}
      </Stack>
    </Container>
  );
};
