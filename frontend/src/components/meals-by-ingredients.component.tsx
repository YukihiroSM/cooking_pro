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

const decode = (
  arrayStr: (string | null)[] | undefined | null | string
): string[] | undefined => {
  if (typeof arrayStr === 'string') return arrayStr.split(',');
  else return undefined;
};

const MyIngredientsParam = {
  encode: (array: string[] | undefined): string | undefined =>
    array ? array.join(',') : undefined,

  decode: (
    arrayStr: (string | null)[] | undefined | null | string
  ): string[] | undefined => decode(arrayStr),
};

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
      <Container maxW={'full'} px={20} py={10}>
        {(isLoadingNav || isLoadingAll) && <Loader />}
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
            <Box w={'full'}>
              <FormLabel>Choose ingredients</FormLabel>
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
        {meals && <FilteredMealsComponent total={total} meals={meals} />}
      </Container>
    </>
  );
};
