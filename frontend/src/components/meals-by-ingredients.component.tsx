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
} from '@chakra-ui/react';

import { useCategoriesAndIngredients, useMealsByIngredients } from '../hooks';
import { NavItem, NavItemFilter } from '../types';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';
import { PaginationComponent } from './pagination.component';
import { MyIngredientsParam } from '../utils';

const animatedComponents = makeAnimated();

export const MealsByIngredientsComponent = () => {
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
          <Stack w={'full'} direction={'row'} align={'flex-end'}>
            <Box w={'full'}>
              <FormLabel>
                Choose ingredient <strong>by category</strong>
              </FormLabel>
              <Select
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: 'silver',
                    primary: '#DD6B20',
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
            <Box w={'full'}>
              <FormLabel>Choose ingredients</FormLabel>
              <Select
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: 'silver',
                    primary: '#DD6B20',
                  },
                })}
                isSearchable
                isDisabled={isLoadingNav || isLoadingAll}
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
                    setIngredients(newValue.map((item: NavItem) => item.label));
                  }
                }}
              />
            </Box>
          </Stack>
        </FormControl>
        {meals && <FilteredMealsComponent meals={meals} />}
        {total && <PaginationComponent total={total} />}
      </Stack>
    </Container>
  );
};
