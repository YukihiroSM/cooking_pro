import React, { useEffect, useRef, useState } from 'react';

import {
  Grid,
  GridItem,
  Box,
  Image,
  Stack,
  Text,
  Divider,
  SimpleGrid,
  Flex,
  useToast,
  Link,
  Container,
  Progress,
} from '@chakra-ui/react';
import {
  useMealsByCategory,
  useSingleMeal,
  useUserIngredients,
} from '../hooks';
import { Loader } from './loader.component';
import { StringParam, useQueryParam } from 'use-query-params';
import { templateIngredients } from '../templateData';
import { formatNumber, formatString, storeRequiredIngredients } from '../utils';

export const SingleMealComponent = () => {
  const instructionsSection = useRef<HTMLDivElement>(
    null
  ) as React.MutableRefObject<HTMLDivElement>;
  const toast = useToast();
  const [, setCarouselCategory] = useQueryParam('category', StringParam);
  const [availableIngredients, setAvailableIngredients] = useState<any>();

  const {
    isLoading: isLoadingSingle,
    isError: isErrorSingle,
    error: errorSingle,
    data: meal,
  } = useSingleMeal();
  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    data: dataMealsBeCategory = { data: undefined, metadata: { total: null } },
  } = useMealsByCategory();
  const {
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
    data: dataUser = { data: templateIngredients, metadata: { total: 0 } },
  } = useUserIngredients();
  const { data: userIngredients } = dataUser;
  const { data: meals } = dataMealsBeCategory;

  const scrollDown = () => {
    window.scrollTo({
      top: instructionsSection.current.offsetTop - 100,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    meal && setCarouselCategory(meal.category);
  }, [meal]);

  useEffect(() => {
    userIngredients &&
      setAvailableIngredients(storeRequiredIngredients(templateIngredients));
  }, [userIngredients]);

  useEffect(() => {
    if (isErrorSingle || isErrorAll || isErrorUser) {
      toast({
        title: 'Something went wrong...',
        description:
          errorSingle?.response?.data?.message ||
          errorAll?.response?.data?.message ||
          errorUser?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isErrorSingle, isErrorAll, isErrorUser]);

  return (
    <>
      {isLoadingSingle ? (
        <Loader />
      ) : (
        <Container m={0} p={0} maxW={'100vw'}>
          <Stack direction={'column'} spacing={0}>
            <Grid
              position={'relative'}
              h={'calc(100vh - 6.3rem)'}
              borderBottom={0.5}
              borderColor={'black'}
              borderStyle={'solid'}
              templateColumns='repeat(2, 1fr)'
              w={'100vw'}
            >
              <Box
                position={'absolute'}
                left={0}
                bottom={32}
                right={0}
                mx={'auto'}
                id='arrow-scroll-hint'
                className='demo'
                cursor={'pointer'}
              >
                <Link onClick={() => scrollDown()}>
                  <span></span>
                  <span></span>
                  <span></span>
                </Link>
              </Box>
              <GridItem
                as={Flex}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Stack maxWidth={'25rem'}>
                  <Text textStyle={'display2'}>{meal?.name}</Text>
                  <Divider />
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
              </GridItem>
              <GridItem justifyContent={'flex-end'} overflow={'hidden'}>
                <Box>
                  <Image
                    alt={meal?.name}
                    align={'center'}
                    fit={'cover'}
                    w={'full'}
                    h={'full'}
                    src={meal?.image}
                  />
                </Box>
              </GridItem>
            </Grid>
            <Grid
              ref={instructionsSection}
              bg={'light'}
              templateColumns={'repeat(2, 1fr)'}
              w={'100vw'}
            >
              <GridItem>
                <Stack ml={20} my={10}>
                  <Text textStyle={'body1Semi'}>Instructions </Text>
                  <Divider />
                  <Text h={'25rem'} overflowY={'scroll'} textStyle={'body2'}>
                    {meal?.instructions}
                  </Text>
                  <Text fontWeight={'thin'} fontSize={'sm'} as={'span'}>
                    * You might need to scroll the instructions text to read
                    more.
                  </Text>
                </Stack>
              </GridItem>
              <GridItem
                pr={20}
                pl={10}
                as={Flex}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Box
                  title='Video tutorial'
                  as='iframe'
                  src={meal?.video}
                  width='100%'
                  sx={{
                    aspectRatio: '16/9',
                  }}
                />
              </GridItem>
            </Grid>
            <Grid
              px={20}
              bg={'light'}
              templateColumns={
                userIngredients ? '1fr 2fr 1fr' : 'repeat(2, 1fr)'
              }
              w={'100vw'}
            >
              <GridItem>
                <Stack my={'2rem'}>
                  <Text textAlign={'left'} textStyle={'body1Semi'}>
                    Ingredients
                  </Text>
                  {meal?.ingredients.map((ingredient, index) => (
                    <Text
                      key={`${index}-${ingredient}`}
                      borderBottom={0.5}
                      borderColor={'orange'}
                      borderStyle={'solid'}
                      textStyle={'body2'}
                    >
                      {`${index + 1}) ${ingredient}`}
                    </Text>
                  ))}
                </Stack>
              </GridItem>
              {availableIngredients && (
                <GridItem>
                  <Stack my={'2rem'}>
                    <Text textStyle={'body1Semi'}>Available</Text>
                    {meal?.ingredients.map((ingredient, index) => {
                      const availableValue: string =
                        availableIngredients[ingredient] || '0';
                      const requiredValue: string = formatNumber(
                        meal?.measures[index]
                      );
                      return (
                        <Grid
                          key={`${index}-${ingredient}`}
                          templateColumns={'3fr 1fr'}
                          borderBottom={0.5}
                          borderColor={'orange'}
                          borderStyle={'solid'}
                        >
                          <Progress
                            alignSelf={'center'}
                            m={0}
                            p={0}
                            colorScheme='orange'
                            borderRadius={'md'}
                            mr={5}
                            size='md'
                            max={Number(requiredValue)}
                            value={Number(availableValue)}
                          />
                          <Text textStyle={'body2'}>
                            {`${availableValue} / ${requiredValue}`}
                          </Text>
                        </Grid>
                      );
                    })}
                  </Stack>
                </GridItem>
              )}
              <GridItem>
                <Stack my={'2rem'}>
                  <Text textStyle={'body1Semi'}>Measures</Text>
                  {meal?.measures.map((measure, index) => (
                    <Text
                      key={`${index}-${measure}`}
                      borderBottom={0.5}
                      borderColor={'orange'}
                      borderStyle={'solid'}
                      textStyle={'body2'}
                    >
                      {formatString(measure)}
                    </Text>
                  ))}
                </Stack>
              </GridItem>
            </Grid>
            <Stack py={20} direction={'column'} align={'center'}>
              <Text textStyle={'h1Semi'}>More of {meal?.category}</Text>
              <Grid
                px={20}
                templateColumns={'repeat(2, 1fr)'}
                templateRows={'repeat(4, 1fr)'}
                w={'100vw'}
              >
                {meals &&
                  meals.slice(0, 8).map((meal) => (
                    <GridItem key={meal.id} position={'relative'}>
                      <Box w={'full'} h={'auto'}>
                        <Box
                          position={'absolute'}
                          zIndex={2}
                          shadow={'innerBasic'}
                          _hover={{
                            shadow: 'innerHovered',
                          }}
                          w={'full'}
                          h={'640px'}
                          as={Link}
                          href={`/meals/${meal.id}`}
                        ></Box>
                        <Image
                          alt={'Random meal'}
                          align={'center'}
                          fit={'cover'}
                          w={'full'}
                          src={meal.image}
                          zIndex={1}
                        />
                      </Box>
                      <Text
                        zIndex={3}
                        position={'absolute'}
                        ml={'auto'}
                        mr={'auto'}
                        left={0}
                        right={0}
                        bottom={8}
                        textAlign={'center'}
                        color={'light'}
                        textStyle={'h1Semi'}
                      >
                        {meal.name.split(' ').length > 2
                          ? meal.name
                              .replace(/\W/g, ' ')
                              .split(' ')
                              .slice(0, 3)
                              .join(' ')
                          : meal.name}
                      </Text>
                    </GridItem>
                  ))}
              </Grid>
            </Stack>
          </Stack>
        </Container>
      )}
    </>
  );
};
