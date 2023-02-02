import React from 'react';

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
  Link,
} from '@chakra-ui/react';
import { Meal } from '../types';

const meal: Meal = {
  idMeal: '53012',
  strMeal: 'Gigantes Plaki',
  strCategory: 'Vegetarian',
  strArea: 'Greek',
  strInstructions:
    'Soak the beans overnight in plenty of water. Drain, rinse, then place in a pan covered with water. Bring to the boil, reduce the heat, then simmer for approx 50 mins until slightly tender but not soft. Drain, then set aside.\r\n\r\nHeat oven to 180C/160C fan/gas 4. Heat the olive oil in a large frying pan, tip in the onion and garlic, then cook over a medium heat for 10 mins until softened but not browned. Add the tomato purée, cook for a further min, add remaining ingredients, then simmer for 2-3 mins. Season generously, then stir in the beans. Tip into a large ovenproof dish, then bake for approximately 1 hr, uncovered and without stirring, until the beans are tender. The beans will absorb all the fabulous flavours and the sauce will thicken. Allow to cool, then scatter with parsley and drizzle with a little more olive oil to serve.',
  strMealThumb:
    'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
  strYoutube: 'https://www.youtube.com/watch?v=e-2K2iyPASA',
  strIngredients: ['Butter Beans', 'Olive Oil', 'Onion', 'Garlic Clove'],
  strMeasures: ['400g', '3 tbs', '1 chopped', '2 chopped'],
};

const meals: Meal[] = Array(10).fill(meal);

export const SingleMealComponent = () => {
  return (
    <>
      <Grid
        borderBottom={0.5}
        borderColor={'black'}
        borderStyle={'solid'}
        templateColumns='repeat(2, 1fr)'
        w={'100vw'}
      >
        <GridItem as={Flex} justifyContent={'center'} alignItems={'center'}>
          <Stack>
            <Text textStyle={'display2'}>{meal.strMeal}</Text>
            <Divider />
            <SimpleGrid fontSize={'1.25rem'} mt={2} columns={2} spacing={2}>
              <Text fontWeight={'bold'}>Category</Text>
              <Text>{meal.strCategory}</Text>
              <Text fontWeight={'bold'}>Area</Text>
              <Text>{meal.strArea}</Text>
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
              src={meal.strMealThumb}
            />
          </Box>
        </GridItem>
      </Grid>
      <Grid
        templateColumns={'repeat(2, 1fr)'}
        templateRows={'2fr, 1fr'}
        w={'100vw'}
      >
        <GridItem>
          <Stack ml={'5rem'} my={'2rem'}>
            <Text textStyle={'body1Semi'}>Instructions</Text>
            <Divider />
            <Text textStyle={'body2'}>{meal.strInstructions}</Text>
          </Stack>
        </GridItem>
        <GridItem
          my={'5.5rem'}
          px={10}
          as={Flex}
          justifyContent={'center'}
          alignItems={'flex-start'}
        >
          <Box
            as='iframe'
            src={`${meal.strYoutube.replace(
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
            {/* <Divider maxWidth={'20rem'} /> */}
            {meal.strIngredients.map((ingredient, index) => (
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
            <Text textStyle={'body1Semi'}>Measures</Text>
            {/* <Divider maxWidth={'20rem'} /> */}
            {meal.strMeasures.map((measure, index) => (
              <Text
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
        <Text textStyle={'h1Semi'}>More of {meal.strCategory}</Text>
        <Grid
          px={20}
          templateColumns={'repeat(2, 1fr)'}
          templateRows={'repeat(4, 1fr)'}
          w={'100vw'}
        >
          {meals.slice(0, 8).map((meal) => (
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
                  href={`meals/single-meal/${meals[0].idMeal}`}
                ></Box>
                <Image
                  alt={'Random meal'}
                  align={'center'}
                  fit={'cover'}
                  w={'full'}
                  src={meal.strMealThumb}
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
                {meal.strMeal}
              </Text>
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </>
  );
};
