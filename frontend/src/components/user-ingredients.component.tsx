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
import {
  Ingredient,
  NavItemFilter,
  CreateIngredient,
  NavItem,
  Notification,
} from '../types';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  UpDownIcon,
} from '@chakra-ui/icons';
import { USER_INGREDIENTS_PARAMS } from '../consts';
import { sortByLabel } from '../utils';
import { PaginationComponent } from './pagination.component';
import { NotificationComponent } from './notification.component';

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
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  const [filtered, setFiltered] = useState<Ingredient[]>();
  const [sort, setSort] = useState<TableSort>({
    param: 'label',
    value: 0,
  });

  const {
    deleteIngredientMutation,
    createIngredientMutation,
    isError: isErrorMutation,
    error: errorMutation,
    isSuccessCreate,
    isSuccessDelete,
    isLoadingCreate,
    isLoadingDelete,
  } = useUserIngredient();
  const {
    isLoading,
    isError,
    error,
    data = { data: undefined, metadata: { total: undefined } },
  } = useUserIngredients();
  const {
    isLoading: isLoadingNav,
    isError: isErrorNav,
    error: errorNav,
    data: navItems,
  } = useCategoriesAndIngredients();

  const { data: ingredients, metadata } = data;

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
    ingredients && setFiltered(ingredients);
  }, [ingredients]);

  useEffect(() => {
    (isError || isErrorNav || isErrorMutation) &&
      setNotification({
        status: 'error',
        error: error || errorNav || errorMutation || undefined,
      });
  }, [isError, isErrorNav, isErrorMutation]);

  useEffect(() => {
    isSuccessDelete &&
      setNotification({
        status: 'success',
        success: 'Ingredient deleted!',
      });
  }, [isSuccessDelete]);

  useEffect(() => {
    isSuccessCreate &&
      setNotification({
        status: 'success',
        success: 'Ingredient added!',
      });
  }, [isSuccessCreate]);

  const icon =
    sort.value === -1 ? (
      <ChevronDownIcon ml={1} w={4} h={4} />
    ) : sort.value === 1 ? (
      <ChevronUpIcon ml={1} w={4} h={4} />
    ) : (
      <UpDownIcon ml={1} w={4} h={4} />
    );

  return (
    <Container
      minW={'none'}
      bg={'white'}
      maxW={'100vw'}
      m={0}
      px={{ sm: 5, md: 10 }}
      py={10}
    >
      {notification && <NotificationComponent notification={notification} />}
      {isLoading && <Loader />}
      <CreateIngredientComponent
        isLoadingCreate={isLoadingCreate}
        isLoadingDelete={isLoadingDelete}
        isLoadingNav={isLoadingNav}
        navItems={navItems}
        toast={toast}
        createIngredientMutation={createIngredientMutation}
      />

      {filtered && (
        <TableContainer w={'full'} my={5}>
          <Table size='md' variant='simple' colorScheme='orange'>
            <Thead textStyle={'body2Semi'} fontSize={{ sm: 'lg', md: 'xl' }}>
              <Tr>
                {USER_INGREDIENTS_PARAMS.map((param: string) => (
                  <Td
                    px={{ sm: 4, md: 6 }}
                    py={{ sm: 2, md: 4 }}
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
                  <Td px={{ sm: 4, md: 6 }} py={{ sm: 2, md: 4 }}>
                    {ingredient.category}
                  </Td>
                  <Td px={{ sm: 4, md: 6 }} py={{ sm: 2, md: 4 }}>
                    {ingredient.label}
                  </Td>
                  <Td px={{ sm: 4, md: 6 }} py={{ sm: 2, md: 4 }} isNumeric>
                    {ingredient.measure}
                  </Td>
                  <Td
                    px={{ sm: 4, md: 6 }}
                    py={{ sm: 2, md: 4 }}
                    w={10}
                    textAlign={'right'}
                  >
                    <IconButton
                      type='submit'
                      isLoading={isLoadingDelete}
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
      <PaginationComponent total={metadata?.total || 0} />
    </Container>
  );
};

const CreateIngredientComponent = ({
  createIngredientMutation,
  toast,
  isLoadingNav,
  navItems,
  isLoadingCreate,
}: any) => {
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

  useEffect(() => {
    setOptionsCategories(
      navItems
        ?.find((item: NavItem) => item.label === 'Ingredients')
        ?.children?.map((item: NavItem) => ({ ...item, value: item.label }))
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

  return (
    <Container maxW={'none'} m={0} p={0}>
      <form onSubmit={handleCreateIngredient}>
        <Grid
          columnGap={10}
          templateColumns={{ sm: 'none', md: 'repeat(2, 3fr) 5fr 1fr' }}
          templateRows={{ sm: 'repeat(4, 1fr)', md: 'none' }}
        >
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
                  isDisabled={!ingredient?.id}
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
                <Button
                  ml={5}
                  display={{ sm: 'block', md: 'none' }}
                  isDisabled={
                    !ingredient?.id ||
                    !ingredient?.measure ||
                    !ingredient?.quantity
                  }
                  isLoading={isLoadingCreate}
                  type='submit'
                  transition={'all .5s ease'}
                  fontSize={'md'}
                  fontWeight={600}
                  color={'white'}
                  bg={'attention.dark'}
                  _hover={{
                    bg: 'attention.light',
                  }}
                >
                  Add ingredient
                </Button>
              </Flex>
            </Box>
          </GridItem>
          <GridItem display={{ sm: 'none', md: 'block' }}>
            <Flex h={'full'} align={'flex-end'} justify={'flex-end'}>
              <Button
                isDisabled={
                  !ingredient?.id ||
                  !ingredient?.measure ||
                  !ingredient?.quantity
                }
                isLoading={isLoadingCreate}
                type='submit'
                transition={'all .5s ease'}
                fontSize={'md'}
                fontWeight={600}
                color={'white'}
                bg={'attention.dark'}
                _hover={{
                  bg: 'attention.light',
                }}
              >
                Add ingredient
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      </form>
      <Divider mt={2} />
    </Container>
  );
};
