import React, { useEffect } from 'react';

import {
  Box,
  Grid,
  Image,
  GridItem,
  Text,
  Stack,
  SimpleGrid,
  Divider,
  Link,
  useToast,
} from '@chakra-ui/react';
import { useMeal } from '../hooks';
import { Meal } from '../types';
import { Loader } from './loader.component';

const meal = {
  idMeal: '53012',
  strMeal: 'Gigantes Plaki',
  strCategory: 'Vegetarian',
  strArea: 'Greek',
  strInstructions:
    'Soak the beans overnight in plenty of water. Drain, rinse, then place in a pan covered with water. Bring to the boil, reduce the heat, then simmer for approx 50 mins until slightly tender but not soft. Drain, then set aside.\r\n\r\nHeat oven to 180C/160C fan/gas 4. Heat the olive oil in a large frying pan, tip in the onion and garlic, then cook over a medium heat for 10 mins until softened but not browned. Add the tomato purée, cook for a further min, add remaining ingredients, then simmer for 2-3 mins. Season generously, then stir in the beans. Tip into a large ovenproof dish, then bake for approximately 1 hr, uncovered and without stirring, until the beans are tender. The beans will absorb all the fabulous flavours and the sauce will thicken. Allow to cool, then scatter with parsley and drizzle with a little more olive oil to serve.',
  strMealThumb:
    'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
  strTags: null,
  strYoutube: 'https://www.youtube.com/watch?v=e-2K2iyPASA',
  strIngredients: ['Butter Beans', 'Olive Oil', 'Onion', 'Garlic Clove'],
  strMeasures: ['400g', '3 tbs', '1 chopped', '2 chopped'],
};

const templateMeals: Meal[] = Array(4).fill(meal);

export const HeroComponent = () => {
  const toast = useToast();
  const { randomMeals } = useMeal();

  const {
    isLoading,
    isError,
    error,
    data: meals = templateMeals,
  } = randomMeals;

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Something went wrong...',
        description: error?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isError]);
  return (
    <>
      {/* {isLoading && <Loader />} */}
      <Grid
        templateColumns='repeat(2, 1fr)'
        w={'100vw'}
        px={{ base: 20 }}
        py={{ base: 20 }}
        gap={10}
      >
        <GridItem
          key={meals && meals[0].idMeal}
          bottom={0}
          mt={'auto'}
          position={'sticky'}
        >
          <Stack spacing={4}>
            <Box
              rounded={'2xl'}
              h={'40rem'}
              boxShadow={'2xl'}
              overflow={'hidden'}
              as={Link}
              href={`/meals/single-meal/${meals && meals[0].idMeal}`}
            >
              <Image
                alt={'Random meal'}
                align={'center'}
                fit={'cover'}
                h={'100%'}
                src={meals && meals[0].strMealThumb}
              />
            </Box>
            <Text
              as={Link}
              href={`/meals/single-meal/${meals && meals[0].idMeal}`}
              textDecoration={'none'}
              textStyle={'h1Semi'}
            >
              {meals && meals[0].strMeal}
            </Text>
          </Stack>
        </GridItem>
        <GridItem>
          <Grid templateRows='repeat(3, 1fr)' gap={5}>
            {meals &&
              meals.slice(1).map((meal) => (
                <GridItem key={meal.idMeal}>
                  <Stack direction={'row'} spacing={4}>
                    <Box
                      rounded={'2xl'}
                      h={'25rem'}
                      w={'20rem'}
                      boxShadow={'2xl'}
                      overflow={'hidden'}
                      as={Link}
                      href={`/meals/single-meal/${meal.idMeal}`}
                    >
                      <Image
                        alt={'Random meal'}
                        align={'center'}
                        fit={'cover'}
                        h={'100%'}
                        src={meal.strMealThumb}
                      />
                    </Box>
                    <Box>
                      <Text
                        as={Link}
                        href={`/meals/single-meal/${meal.idMeal}`}
                        textStyle={'body1Semi'}
                      >
                        {meal.strMeal}
                      </Text>
                      <Divider />
                      <SimpleGrid
                        fontSize={'1.25rem'}
                        mt={2}
                        columns={2}
                        spacing={2}
                      >
                        <Text fontWeight={'bold'}>Category</Text>
                        <Text>{meal.strCategory}</Text>
                        <Text fontWeight={'bold'}>Area</Text>
                        <Text>{meal.strArea}</Text>
                      </SimpleGrid>
                    </Box>
                  </Stack>
                </GridItem>
              ))}
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
};
