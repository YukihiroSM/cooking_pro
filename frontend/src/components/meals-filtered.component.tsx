import React, { useEffect, useState } from 'react';

import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select as ChakraSelect,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useToast,
  FormControl,
  FormLabel,
  Box,
} from '@chakra-ui/react';

import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  TelegramIcon,
  TelegramShareButton,
} from 'react-share';
import { useMeal, useSetSearchParams } from '../hooks';
import { Meal, NavItem } from '../types';
import { Loader } from './loader.component';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { ROUTER_KEYS } from '../consts';
import { NAV_ITEMS, templateMeals } from '../templateData';

interface NavItemFilter extends NavItem {
  value: string;
}

const animatedComponents = makeAnimated();

export const FilteredMealsComponent = () => {
  const toast = useToast();
  const { allMeals, setTrigger, categoriesAndIngredients } = useMeal();
  const { params, trigger, searchParams, setParam, resetParams } =
    useSetSearchParams();
  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    data: dataAll = { data: templateMeals, metadata: { total: 1 } }, // remove this
  } = allMeals;
  const {
    isLoading: isLoadingNav,
    isError: isErrorNav,
    error: errorNav,
    data: navItems = NAV_ITEMS,
  } = categoriesAndIngredients;
  const { data: meals, metadata } = dataAll;
  const { total } = metadata;

  const [ingredientsCategoriesOptions, setIngredientsCategoriesOptions] =
    useState<NavItemFilter[] | undefined>(undefined);
  const [recipesCategoriesOptions, setRecipesCategoriesOptions] = useState<
    NavItemFilter[] | undefined
  >(undefined);
  const [ingredientsCategory, setIngredientsCategory] =
    useState<NavItemFilter>();
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(false);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);

  const singleMealUrl = `${window.location.hostname}/meals/single-meal/`;

  useEffect(() => {
    setCanNextPage(params.page !== total);
    setCanPreviousPage(params.page !== 0);
    setTrigger(trigger);
  }, [trigger]);

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

  useEffect(() => {
    setIngredientsCategoriesOptions(
      navItems
        ?.find((item) => item.label === 'Ingredients')
        ?.children?.map((item) => ({ ...item, value: item.label }))
    );
    setRecipesCategoriesOptions(
      navItems
        ?.find((item) => item.label === 'Recipes')
        ?.children?.map((item) => ({ ...item, value: item.label }))
    );
  }, [navItems]);

  return (
    <>
      {/* {(isLoadingAll || isLoadingNav) && <Loader />} */}
      <Stack
        direction={'column'}
        spacing={10}
        maxWidth={'100wv'}
        w={'full'}
        px={20}
        py={10}
        bg={'light'}
      >
        <FormControl p={4}>
          <Stack mb={4} align={'flex-end'} w={'full'} direction={'row'}>
            <Box w={'full'}>
              <FormLabel>
                Choose <strong>recipe</strong> by category
              </FormLabel>
              <Select
                name='recipe-by-category'
                options={recipesCategoriesOptions}
                placeholder='Select recipes category...'
                closeMenuOnSelect={true}
                defaultValue={
                  searchParams.get('category')
                    ? [
                        {
                          label: searchParams.get('category'),
                          value: searchParams.get('category'),
                        } as NavItemFilter,
                      ]
                    : undefined
                }
                onChange={(newValue: SingleValue<NavItemFilter>) => {
                  resetParams();
                  setParam('category', newValue?.label as string);
                }}
              />
            </Box>
            <Button
              onClick={() => {
                resetParams();
                setParam('category', 'Breakfast');
                setParam('page', 0);
                setParam('perPage', 10);
              }}
              colorScheme={'red'}
              w={20}
            >
              Reset
            </Button>
          </Stack>
          <Stack w={'full'} direction={'row'}>
            <Box w={'full'}>
              <FormLabel>
                Choose <strong>ingredient</strong> by category
              </FormLabel>
              <Select
                name='ingredients-by-category'
                options={ingredientsCategoriesOptions}
                placeholder='Select ingredients category...'
                closeMenuOnSelect={true}
                defaultValue={
                  ingredientsCategoriesOptions &&
                  ingredientsCategoriesOptions[0]
                }
                onChange={(newValue: SingleValue<NavItemFilter>) =>
                  setIngredientsCategory(newValue as NavItemFilter)
                }
              />
            </Box>
            <Box w={'full'}>
              <FormLabel>Choose ingredient</FormLabel>
              <Select
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
                  searchParams.get('ingredient')
                    ? [
                        {
                          label: searchParams.get('ingredient'),
                          value: searchParams.get('ingredient'),
                        } as NavItem,
                      ]
                    : undefined
                }
                onChange={(newValue: MultiValue<NavItem>) => {
                  resetParams();
                  setParam(
                    'ingredient',
                    newValue.map((item) => item.label)
                  );
                }}
              />
            </Box>
          </Stack>
        </FormControl>
        <Flex
          justify={'space-between'}
          rowGap={10}
          align={'center'}
          flexWrap={'wrap'}
        >
          {meals &&
            meals.map((meal) => (
              <Card maxW='sm'>
                <CardBody>
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    fit={'cover'}
                    borderRadius='lg'
                  />
                  <Stack mt='6' spacing='3'>
                    <Stack>
                      <Heading textStyle={'display2'}>{meal?.name}</Heading>
                      <SimpleGrid
                        fontSize={'1.25rem'}
                        mt={2}
                        columns={2}
                        spacing={2}
                      >
                        <Text fontWeight={'bold'}>Category</Text>
                        <Text>{meal?.category}</Text>
                        <Text fontWeight={'bold'}>Area</Text>
                        <Text>{meal?.area}</Text>
                      </SimpleGrid>
                    </Stack>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup
                    w={'full'}
                    as={Flex}
                    justifyContent={'space-between'}
                    spacing='2'
                  >
                    <Button
                      as={Link}
                      href={`/meals/single-meal/${meal.id}`}
                      variant='solid'
                      bg={'attention.dark'}
                      color={'white'}
                      _hover={{
                        textDecoration: 'none',
                        bg: 'attention.light',
                      }}
                    >
                      Read more
                    </Button>
                    <ButtonGroup>
                      <FacebookShareButton
                        children={<FacebookIcon size={32} round={true} />}
                        url={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                          `${singleMealUrl}${meal.id}`
                        )}`}
                      />
                      <PinterestShareButton
                        description={meal.name}
                        media={meal.image}
                        children={<PinterestIcon size={32} round={true} />}
                        url={`http://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                          `${singleMealUrl}${meal.id}`
                        )}&media=${encodeURIComponent(
                          meal.image
                        )}&description=${meal.name}`}
                      />
                      <TelegramShareButton
                        children={<TelegramIcon size={32} round={true} />}
                        url={`https://t.me/share/url?url=${encodeURIComponent(
                          `${singleMealUrl}${meal.id}`
                        )}&text=${encodeURIComponent(meal.name)}`}
                      />
                    </ButtonGroup>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            ))}
        </Flex>
        <Flex
          fontSize={'lg'}
          justifyContent='space-between'
          mx={20}
          alignItems='center'
        >
          <Flex>
            <Tooltip label='First Page'>
              <IconButton
                aria-label='pagination-first-page'
                onClick={() => setParam('page', 0)}
                isDisabled={!canPreviousPage}
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
              />
            </Tooltip>
            <Tooltip label='Previous Page'>
              <IconButton
                aria-label='pagination-previous-page'
                onClick={() => setParam('page', params.page - 1)}
                isDisabled={!canPreviousPage}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex alignItems='center'>
            <Text flexShrink='0' mr={8}>
              Page{' '}
              <Text fontWeight='bold' as='span'>
                {params.page + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight='bold' as='span'>
                {total + 1}
              </Text>
            </Text>
            <Text flexShrink='0'>Go to page:</Text>{' '}
            <NumberInput
              ml={2}
              mr={8}
              w={28}
              min={1}
              max={total + 1}
              onChange={(value) => {
                const page = value ? Number(value) - 1 : 0;
                setParam('page', page);
              }}
              value={params.page + 1}
            >
              <NumberInputField fontSize={'lg'} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <ChakraSelect
              fontSize={'lg'}
              w={32}
              value={params.perPage}
              onChange={(e) => {
                setParam('perPage', Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </ChakraSelect>
          </Flex>

          <Flex>
            <Tooltip label='Next Page'>
              <IconButton
                aria-label='pagination-last-page'
                onClick={() => setParam('page', params.page + 1)}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            </Tooltip>
            <Tooltip label='Last Page'>
              <IconButton
                aria-label='pagination-next-page'
                onClick={() => setParam('page', total)}
                isDisabled={!canNextPage}
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};
