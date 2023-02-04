import { useEffect, useState } from 'react';

import { ArrayParam, useQueryParam, withDefault } from 'use-query-params';

import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

import {
  Stack,
  useToast,
  FormLabel,
  Box,
  FormControl,
  Button,
} from '@chakra-ui/react';

import { useCategoriesAndIngredients, useMealsByIngredients } from '../hooks';
import { NavItem, NavItemFilter } from '../types';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';

const MyIngredientsParam = withDefault(ArrayParam, []);
const animatedComponents = makeAnimated();

export const MealsByIngredientsComponent = () => {
  const [ingredients, setIngredients] = useQueryParam(
    'ingredients',
    MyIngredientsParam
  );
  const [optionsCategories, setOptionsCategories] = useState<
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
        ?.find((item) => item.label === 'Recipes')
        ?.children?.map((item) => ({ ...item, value: item.label }))
    );
  }, [navItems]);

  useEffect(() => {
    if (isErrorNav || isErrorAll) {
      toast({
        title: 'Something went wrong...',
        description: errorAll?.message || errorNav?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isErrorNav, isErrorAll]);

  return (
    <>
      {(isLoadingNav || isLoadingAll) && <Loader />}
      <FormControl>
        <Stack w={'full'} direction={'row'}>
          <Box w={'full'}>
            <FormLabel>
              Choose <strong>ingredient</strong> by category
            </FormLabel>
            <Select
              isDisabled={isLoadingNav || isLoadingAll}
              name='ingredients-by-category'
              options={optionsCategories}
              placeholder='Select ingredients category...'
              closeMenuOnSelect={true}
              defaultValue={
                optionsCategories
                  ? ({
                      label: optionsCategories[0].label,
                      value: optionsCategories[0].label,
                    } as NavItemFilter)
                  : undefined
              }
              onChange={(newValue: SingleValue<NavItemFilter>) =>
                setIngredientsCategory(newValue as NavItemFilter)
              }
            />
          </Box>
          <Box w={'full'}>
            <FormLabel>Choose ingredient</FormLabel>
            <Select
              isDisabled={isLoadingNav || isLoadingAll}
              isMulti
              name='ingredients'
              options={ingredientsCategory?.children?.map((item) => ({
                ...item,
                value: item.label,
              }))}
              placeholder='Select some ingredients...'
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={
                {
                  label: ingredients[0],
                  value: ingredients[0],
                } as NavItemFilter
              }
              onChange={(newValue: MultiValue<NavItem>) => {
                setIngredients(newValue.map((item: NavItem) => item.label));
              }}
            />
          </Box>
          <Button
            isDisabled={isLoadingNav || isLoadingAll}
            onClick={() => {
              setIngredients([ingredients[0]]);
            }}
            colorScheme={'red'}
            w={20}
          >
            Reset
          </Button>
        </Stack>
      </FormControl>
      {meals && <FilteredMealsComponent total={total} meals={meals} />}
    </>
  );
};
