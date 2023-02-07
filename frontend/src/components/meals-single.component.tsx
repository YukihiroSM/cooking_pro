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
import { useMealsByFilter, useSingleMeal, useUserIngredients } from '../hooks';
import { Loader } from './loader.component';
import { StringParam, useQueryParam } from 'use-query-params';
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
    isError: isErrorAll,
    error: errorAll,
    data: dataMealsBeCategory = { data: undefined, metadata: { total: null } },
  } = useMealsByFilter();
  const { data: dataUser = { data: undefined, metadata: { total: 0 } } } =
    useUserIngredients();
  const { data: userIngredients } = dataUser;
  const { data: meals } = dataMealsBeCategory;

  const scrollDown = () => {
    window.scrollTo({
      top: instructionsSection.current.offsetTop - 125,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    meal && setCarouselCategory(meal.category);
  }, [meal]);

  useEffect(() => {
    userIngredients &&
      setAvailableIngredients(storeRequiredIngredients(userIngredients));
  }, [userIngredients]);

  useEffect(() => {
    if (isErrorSingle || isErrorAll) {
      toast({
        title: 'Something went wrong...',
        description:
          errorSingle?.response?.data?.message ||
          errorAll?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isErrorSingle, isErrorAll]);

  return (
    <>
      {isLoadingSingle ? (
        <Loader />
      ) : (
        <Container minW={'none'} m={0} p={0} maxW={'100vw'}>
          <Box
            zIndex={49}
            position={'absolute'}
            left={0}
            bottom={24}
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
          <Stack direction={'column'} spacing={0}>
            <Grid
              position={'relative'}
              h={'calc(100vh - 6.3rem)'}
              borderBottom={0.5}
              borderColor={'black'}
              borderStyle={'solid'}
              templateColumns={{ sm: 'none', md: 'repeat(2, 1fr)' }}
              templateRows={{ md: 'none', sm: 'repeat(2, 1fr)' }}
              w={'100vw'}
            >
              <GridItem
                as={Flex}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Stack maxWidth={'25rem'}>
                  <Text textStyle={{ sm: 'h1Semi', md: 'display2' }}>
                    {meal?.name}
                  </Text>
                  <Divider />
                  <SimpleGrid
                    fontSize={{ sm: 'xl', md: '2xl' }}
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
                <Box h={'full'}>
                  <Image
                    alt={meal?.name}
                    align={'center'}
                    fit={'cover'}
                    h={'full'}
                    w={'full'}
                    src={meal?.image}
                  />
                </Box>
              </GridItem>
            </Grid>
            <Grid
              py={{ sm: 5, md: 10 }}
              ref={instructionsSection}
              bg={'light'}
              templateColumns={{ sm: 'none', md: 'repeat(2, 1fr)' }}
              templateRows={{ md: 'none', sm: 'repeat(2, 1fr)' }}
              w={'100vw'}
              px={{ sm: 5, md: 20 }}
            >
              <GridItem>
                <Stack>
                  <Text textStyle={{ sm: 'body2Semi', md: 'body1Semi' }}>
                    Instructions{' '}
                  </Text>
                  <Divider />
                  <Text
                    h={'15em'}
                    overflowY={'scroll'}
                    fontSize={{ sm: 'xl', md: '2xl' }}
                  >
                    {meal?.instructions}
                  </Text>
                  <Text
                    fontWeight={'thin'}
                    fontSize={{ sm: 'sx', md: 'sm' }}
                    as={'span'}
                  >
                    * You might need to scroll the instructions text to read
                    more.
                  </Text>
                </Stack>
              </GridItem>
              <GridItem
                pl={{ sm: 'none', md: 20 }}
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
              py={{ sm: 5, md: 10 }}
              pt={{ sm: 'none', md: 10 }}
              px={{ sm: 5, md: 20 }}
              bg={'light'}
              templateColumns={{
                md: userIngredients ? '1fr 2fr 1fr' : 'repeat(2, 1fr)',
                sm: userIngredients ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
              }}
              w={'100vw'}
            >
              <GridItem>
                <Stack>
                  <Text
                    textAlign={'left'}
                    textStyle={{ sm: 'body2Semi', md: 'body1Semi' }}
                  >
                    Ingredients
                  </Text>
                  {meal?.ingredients.map((ingredient, index) => (
                    <Text
                      key={`${index}-${ingredient}`}
                      borderBottom={0.5}
                      borderColor={'orange'}
                      borderStyle={'solid'}
                      fontSize={{ sm: 'xl', md: '2xl' }}
                    >
                      {`${index + 1}) ${ingredient}`}
                    </Text>
                  ))}
                </Stack>
              </GridItem>
              {availableIngredients && (
                <GridItem>
                  <Stack>
                    <Text
                      px={{ sm: 2, md: 'none' }}
                      textStyle={{ sm: 'body2Semi', md: 'body1Semi' }}
                    >
                      Available
                    </Text>
                    {meal?.ingredients.map((ingredient, index) => {
                      const availableValue: string =
                        availableIngredients[ingredient] || '0';
                      const requiredValue: string = formatNumber(
                        meal?.measures[index]
                      );
                      return (
                        <Grid
                          px={{ sm: 2, md: 'none' }}
                          key={`${index}-${ingredient}`}
                          templateColumns={{ sm: '2fr 1fr', md: '3fr 1fr' }}
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
                            mr={{ sm: 2, md: 5 }}
                            size={{ sm: 'sm', md: 'md' }}
                            max={Number(requiredValue)}
                            value={Number(availableValue)}
                          />
                          <Text fontSize={{ sm: 'xl', md: '2xl' }}>
                            {`${availableValue} / ${requiredValue}`}
                          </Text>
                        </Grid>
                      );
                    })}
                  </Stack>
                </GridItem>
              )}
              <GridItem>
                <Stack>
                  <Text
                    pl={availableIngredients ? 'none' : 10}
                    textStyle={{ sm: 'body2Semi', md: 'body1Semi' }}
                  >
                    Measures
                  </Text>
                  {meal?.measures.map((measure, index) => (
                    <Text
                      pl={availableIngredients ? 'none' : 10}
                      key={`${index}-${measure}`}
                      borderBottom={0.5}
                      borderColor={'orange'}
                      borderStyle={'solid'}
                      fontSize={{ sm: 'xl', md: '2xl' }}
                    >
                      {availableIngredients ? formatString(measure) : measure}
                    </Text>
                  ))}
                </Stack>
              </GridItem>
            </Grid>
            <Stack py={{ sm: 5, md: 10 }} direction={'column'} align={'center'}>
              <Text textStyle={{ sm: 'body1Semi', md: 'h1Semi' }}>
                More of {meal?.category}
              </Text>
              <Grid
                px={{ sm: 5, md: 20 }}
                templateColumns={'repeat(2, 1fr)'}
                templateRows={'repeat(4, 1fr)'}
                w={'100vw'}
              >
                {meals &&
                  meals.slice(0, 8).map((meal) => (
                    <GridItem key={meal.id} position={'relative'}>
                      <Box w={'full'} h={'auto'}>
                        <Box
                          transition={'all .5s ease'}
                          position={'absolute'}
                          zIndex={2}
                          shadow={'innerBasic'}
                          _hover={{
                            shadow: 'innerHovered',
                          }}
                          w={'full'}
                          h={'full'}
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
                        textStyle={{ sm: 'body1Semi', md: 'h1Semi' }}
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
