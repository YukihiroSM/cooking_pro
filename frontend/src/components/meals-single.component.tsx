import React, { useEffect } from 'react';

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
} from '@chakra-ui/react';
import { Meal } from '../types';
import { useMeal, useSetSearchParams } from '../hooks';
import { Loader } from './loader.component';
import { templateMeal, templateMeals } from '../templateData';

export const SingleMealComponent = () => {
  const toast = useToast();
  const { singleMeal, allMeals, setTrigger } = useMeal();
  const { params, trigger, setParam, resetParams } = useSetSearchParams();
  const {
    isLoading: isLoadingSingle,
    isError: isErrorSingle,
    error: errorSingle,
    data: meal = templateMeal,
  } = singleMeal;
  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    data = { data: templateMeals, metadata: { total: 0 } }, // remove this
  } = allMeals;

  const { data: meals } = data;

  useEffect(() => {
    setParam('category', meal.category);
  }, []);

  useEffect(() => {
    setTrigger(trigger);
  }, [trigger]);

  useEffect(() => {
    if (isErrorSingle || isErrorAll) {
      toast({
        title: 'Something went wrong...',
        description: errorSingle?.message || errorAll?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isErrorSingle, isErrorAll]);

  return (
    <>
      {/* {(isLoadingSingle || isLoadingAll) && <Loader />} */}
      <Grid
        borderBottom={0.5}
        borderColor={'black'}
        borderStyle={'solid'}
        templateColumns='repeat(2, 1fr)'
        w={'100vw'}
      >
        <GridItem as={Flex} justifyContent={'center'} alignItems={'center'}>
          <Stack>
            <Text textStyle={'display2'}>{meal?.name}</Text>
            <Divider />
            <SimpleGrid fontSize={'1.25rem'} mt={2} columns={2} spacing={2}>
              <Text fontWeight={'bold'}>Category</Text>
              <Text>{meal?.category}</Text>
              <Text fontWeight={'bold'}>Area</Text>
              <Text>{meal?.area}</Text>
            </SimpleGrid>
          </Stack>
        </GridItem>
        <GridItem>
          <Box>
            <Image
              alt={'Random meal'}
              align={'center'}
              fit={'cover'}
              w={'full'}
              src={meal?.image}
            />
          </Box>
        </GridItem>
      </Grid>
      <Grid
        bg={'light'}
        templateColumns={'repeat(2, 1fr)'}
        templateRows={'2fr, 1fr'}
        w={'100vw'}
      >
        <GridItem>
          <Stack ml={'5rem'} my={'2rem'}>
            <Text textStyle={'body1Semi'}>Instructions</Text>
            <Divider />
            <Text textStyle={'body2'}>{meal?.instructions}</Text>
          </Stack>
        </GridItem>
        <GridItem
          px={10}
          as={Flex}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box
            title='Video tutorial'
            as='iframe'
            src={`${meal?.video.replace(
              'watch?v=',
              'embed/'
            )}?autoplay=1&mute=1`}
            width='100%'
            sx={{
              aspectRatio: '16/9',
            }}
          />
        </GridItem>
        <GridItem>
          <Stack ml={'5rem'} my={'2rem'}>
            <Text textStyle={'body1Semi'}>Ingredients</Text>
            {meal?.ingredients.map((ingredient, index) => (
              <Text
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
        <GridItem>
          <Stack mr={'5rem'} my={'2rem'}>
            <Text px={10} textStyle={'body1Semi'}>
              Measures
            </Text>
            {meal?.measures.map((measure, index) => (
              <Text
                px={10}
                borderBottom={0.5}
                borderColor={'orange'}
                borderStyle={'solid'}
                textStyle={'body2'}
              >{`${index + 1}) ${measure}`}</Text>
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
              <GridItem position={'relative'}>
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
                    href={`/meals/single-meal/${meal.id}`}
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
                  {meal.name}
                </Text>
              </GridItem>
            ))}
        </Grid>
      </Stack>
    </>
  );
};
