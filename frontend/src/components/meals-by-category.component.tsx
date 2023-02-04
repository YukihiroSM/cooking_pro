import { useEffect, useState } from 'react';

import { Navigate, useParams } from 'react-router';

import Select, { SingleValue } from 'react-select';

import { useToast, FormLabel, Box, FormControl } from '@chakra-ui/react';

import { useCategoriesAndIngredients, useMealsByCategory } from '../hooks';
import { NavItemFilter } from '../types';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';

export const MealsByCategoryComponent = () => {
  const toast = useToast();
  const { category } = useParams();
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
    data: dataAll = { data: undefined, metadata: { total: 0 } },
  } = useMealsByCategory(undefined);
  const { data: meals, metadata } = dataAll;
  const { total } = metadata;

  useEffect(() => {
    setOptions(
      navItems
        ?.find((item) => item.label === 'Ingredients')
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
        <Box w={'full'}>
          <FormLabel>
            Choose <strong>recipe</strong> by category
          </FormLabel>
          <Select
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
              <Navigate
                to={`meals/category/${newValue}?page=0&perPage=12`}
                replace={true}
              />;
            }}
          />
        </Box>
      </FormControl>
      {meals && <FilteredMealsComponent total={total} meals={meals} />}
    </>
  );
};
