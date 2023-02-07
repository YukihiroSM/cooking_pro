import React, { useEffect, useState } from 'react';

import Select, { SingleValue } from 'react-select';

import {
  Container,
  TableContainer,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  useToast,
  IconButton,
  Box,
  FormLabel,
  Grid,
  GridItem,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Button,
  Divider,
  Badge,
} from '@chakra-ui/react';

import {
  useCategoriesAndIngredients,
  useUserIngredient,
  useUserIngredients,
} from '../hooks';
import { Loader } from './loader.component';
import { Ingredient, NavItemFilter, CreateIngredient } from '../types';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  UpDownIcon,
} from '@chakra-ui/icons';
import { USER_INGREDIENTS_PARAMS } from '../consts';
import { sortByLabel } from '../utils';
import { PaginationComponent } from './pagination.component';

type TableSort = {
  value: number;
  param: string;
};

type MeasureQuantity = {
  quantity?: number | string;
};

type ChosenIngredient = CreateIngredient & MeasureQuantity;

export const UserIngredientsComponent = () => {
  const toast = useToast();
  const [filtered, setFiltered] = useState<Ingredient[]>();
  const [optionsCategories, setOptionsCategories] = useState<
    NavItemFilter[] | undefined
  >(undefined);
  const [optionsIngredients, setOptionsIngredients] = useState<
    NavItemFilter[] | undefined
  >(undefined);
  const [ingredientsCategory, setIngredientsCategory] =
    useState<NavItemFilter>();
  const [ingredient, setIngredient] = useState<ChosenIngredient | undefined>(
    undefined
  );
  const [measure, setMeasure] = React.useState(0);
  const [sort, setSort] = useState<TableSort>({
    param: 'label',
    value: 0,
  });

  const {
    deleteIngredientMutation,
    createIngredientMutation,
    isLoading: isLoadingMutation,
    isError: isErrorMutation,
    isSuccess: isSuccessMutation,
    error: errorMutation,
    action,
  } = useUserIngredient();
  const {
    isLoading,
    isError,
    error,
    data = { data: undefined, metadata: { total: 0 } },
  } = useUserIngredients();
  const {
    isLoading: isLoadingNav,
    isError: isErrorNav,
    error: errorNav,
    data: navItems,
  } = useCategoriesAndIngredients();

  const { data: ingredients, metadata } = data;
  const { total } = metadata;

  const handleCreateIngredient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, measure, quantity } = ingredient as ChosenIngredient;
    if (id && measure && quantity)
      createIngredientMutation({
        id: ingredient?.id as string,
        measure: `${ingredient?.quantity} ${ingredient?.measure}`,
      });
    else
      toast({
        title: 'Invalid data',
        description: 'Enter valid ingredient data, please',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
  };

  const handleChangeMeasure = (quantity: any) => {
    const { id, measure } = ingredient as CreateIngredient;
    setMeasure(quantity);
    quantity && setIngredient({ id, measure, quantity });
  };

  const handleChangeSort = (currParam: string) => {
    setSort({
      param: currParam,
      value:
        currParam !== sort.param || sort.value === 0
          ? -1
          : sort.value === -1
          ? 1
          : 0,
    });
  };

  const handleChangeFilter = () => {
    switch (sort.value) {
      case 0:
        setFiltered(ingredients && [...ingredients]);
        break;
      case 1:
        ingredients &&
          setFiltered(
            sortByLabel<Ingredient>([...ingredients], sort.param)?.reverse()
          );
        break;
      case -1:
        ingredients &&
          setFiltered(sortByLabel<Ingredient>([...ingredients], sort.param));
        break;
    }
  };

  useEffect(() => {
    handleChangeFilter();
  }, [sort]);

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
    ingredients && setFiltered(ingredients);
  }, [ingredients]);

  useEffect(() => {
    if (isError || isErrorNav || isErrorMutation) {
      toast({
        title: 'Something went wrong...',
        description:
          error?.response?.data?.message ||
          errorNav?.response?.data?.message ||
          errorMutation?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
    if (isSuccessMutation) {
      toast({
        title:
          action === 'create'
            ? 'Ingredient created!'
            : action === 'delete' && 'Ingredient deleted!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isError, isErrorNav, isErrorMutation, isSuccessMutation]);

  const icon =
    sort.value === -1 ? (
      <ChevronDownIcon ml={1} w={4} h={4} />
    ) : sort.value === 1 ? (
      <ChevronUpIcon ml={1} w={4} h={4} />
    ) : (
      <UpDownIcon ml={1} w={4} h={4} />
    );

  return (
    <Container bg={'white'} maxW={'100vw'} m={0} px={40} py={10}>
      <Flex direction={'column'} mb={5}>
        <form onSubmit={handleCreateIngredient}>
          <Grid columnGap={10} templateColumns={'repeat(2, 3fr) 5fr 1fr'}>
            <GridItem>
              <Box w={'full'}>
                <FormLabel>Category</FormLabel>
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
                  isDisabled={isLoadingNav}
                  name='category'
                  id='category'
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
              <Box w={'full'}>
                <FormLabel>Ingredient</FormLabel>
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
                  isDisabled={isLoadingNav || !ingredientsCategory}
                  name='ingredient'
                  id='ingredient'
                  options={optionsIngredients}
                  placeholder='Select ingredient...'
                  closeMenuOnSelect
                  onChange={(newValue: SingleValue<NavItemFilter>) => {
                    const { id, measure } = newValue as ChosenIngredient;
                    id &&
                      measure &&
                      setIngredient({
                        id,
                        measure: measure,
                        quantity: ingredient?.quantity,
                      });
                  }}
                />
              </Box>
            </GridItem>
            <GridItem>
              <Box w={'full'}>
                <FormLabel>Measure</FormLabel>
                <Flex alignItems={'center'}>
                  <NumberInput
                    name='measure'
                    id='measure'
                    focusBorderColor={'orangeDefault'}
                    colorScheme={'orange'}
                    allowMouseWheel
                    maxW='100px'
                    mr='2rem'
                    value={measure}
                    onChange={handleChangeMeasure}
                  >
                    <NumberInputField
                      disabled={!ingredient?.id}
                      min={0.1}
                      borderColor={'hsl(0, 0%, 80%)'}
                      h={'2.4rem'}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    isDisabled={!ingredient?.id}
                    colorScheme={'orange'}
                    flex='1'
                    focusThumbOnChange={false}
                    value={measure}
                    onChange={handleChangeMeasure}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize='32px' children={measure} />
                  </Slider>
                  <Flex
                    ml={5}
                    h={'full'}
                    direction={'row'}
                    align={'flex-end'}
                    justify={'space-between'}
                  >
                    <Badge textAlign={'center'} minW={10}>
                      {ingredient?.measure || 'quantity'}
                    </Badge>
                  </Flex>
                </Flex>
              </Box>
            </GridItem>
            <GridItem>
              <Flex h={'full'} align={'flex-end'} justify={'flex-end'}>
                <Button
                  isDisabled={
                    !ingredient?.id ||
                    !ingredient?.measure ||
                    !ingredient?.quantity
                  }
                  isLoading={
                    action === 'create' && isLoadingMutation ? true : false
                  }
                  type='submit'
                  transition={'.5s ease all'}
                  fontSize={'md'}
                  fontWeight={600}
                  color={'white'}
                  bg={'attention.dark'}
                  _hover={{
                    bg: 'attention.light',
                  }}
                >
                  Create
                </Button>
              </Flex>
            </GridItem>
          </Grid>
        </form>
        <Divider mt={2} />
      </Flex>
      {isLoading || (isLoadingMutation && action === 'delete' && <Loader />)}
      {filtered && (
        <TableContainer w={'full'}>
          <Table size='md' variant='simple' colorScheme='orange'>
            <Thead textStyle={'body2Semi'}>
              <Tr>
                {USER_INGREDIENTS_PARAMS.map((param: string) => (
                  <Td
                    key={param}
                    w={20}
                    cursor={'pointer'}
                    isNumeric={param === 'Measure'}
                    onClick={() => handleChangeSort(param.toLowerCase())}
                  >
                    {param === 'Label' ? 'Ingredient' : param}
                    {sort.param === param.toLowerCase() ? (
                      icon
                    ) : (
                      <UpDownIcon ml={1} w={4} h={4} />
                    )}
                  </Td>
                ))}
                <Td align='center'></Td>
              </Tr>
            </Thead>
            <Tbody textStyle={'body2'} fontSize={'lg'}>
              {filtered?.map((ingredient: Ingredient) => (
                <Tr key={ingredient.id}>
                  <Td>{ingredient.category}</Td>
                  <Td>{ingredient.label}</Td>
                  <Td isNumeric>{ingredient.measure}</Td>
                  <Td w={10} textAlign={'center'}>
                    <IconButton
                      onClick={() => deleteIngredientMutation(ingredient.id)}
                      size={'md'}
                      colorScheme={'orange'}
                      aria-label='Delete ingredient'
                      icon={<DeleteIcon />}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      {!total && <PaginationComponent total={total} />}
    </Container>
  );
};
