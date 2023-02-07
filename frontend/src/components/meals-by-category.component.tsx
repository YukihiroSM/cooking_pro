import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import Select, { SingleValue } from 'react-select';

import {
  useToast,
  FormLabel,
  Box,
  FormControl,
  Container,
  Stack,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import { useCategoriesAndIngredients, useMealsByCategory } from '../hooks';
import { Meal, NavItemFilter, SortBy } from '../types';
import { FilteredMealsComponent } from './meals-filtered.component';
import { Loader } from './loader.component';
import { PaginationComponent } from './pagination.component';
import { sortByComplexity } from '../utils';
import { SORT_BY_OPTIONS } from '../consts';

export const MealsByCategoryComponent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { category } = useParams();
  const [filtered, setFiltered] = useState<Meal[] | undefined>();
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
  } = useMealsByCategory();
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
    setFiltered(meals);
  }, [meals]);

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
          <Grid columnGap={10} templateColumns={'1fr 5fr'}>
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
                    navigate(
                      `/meals/category/${newValue?.label}?page=0&perPage=12`,
                      { replace: true }
                    );
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
