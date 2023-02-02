import React, { useState, useEffect } from 'react';

import {
  Stack,
  Text,
  Box,
  Image,
  Tabs,
  TabList,
  Tab,
  Link,
} from '@chakra-ui/react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper';

import { Meal } from '../types';

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

const meals: Meal[] = Array(10).fill(meal);

export const CarouselComponent = () => {
  const [category, setCategory] = useState<string>('all');
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);

  const handleChangeCategory = (index: number) => {
    switch (index) {
      case 0:
        setCategory('all');
        break;
      case 1:
        setCategory('breakfast');
        break;
      case 2:
        setCategory('vegan');
        break;
      case 3:
        setCategory('dessert');
        break;
      default:
        setCategory('all');
        break;
    }
  };

  useEffect(() => {
    console.log(category);
    // filter meals here
    setFilteredMeals([]);
  }, [category]);

  return (
    <Stack
      bg={'light'}
      px={{ base: 20 }}
      py={{ base: 14 }}
      h={'full'}
      direction={'column'}
      alignItems={'center'}
      w={'full'}
    >
      <Text textStyle={'h1Semi'}>Our recommendations</Text>
      <Tabs
        py={{ base: 4 }}
        onChange={handleChangeCategory}
        variant='soft-rounded'
        colorScheme='orange'
      >
        <TabList>
          <Tab value={'all'}>All</Tab>
          <Tab value={'breakfast'}>Breakfast</Tab>
          <Tab value={'vegan'}>Vegan</Tab>
          <Tab value={'dessert'}>Dessert</Tab>
        </TabList>
      </Tabs>
      <Swiper
        slidesPerView={4}
        grabCursor={true}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Navigation]}
        className='mySwiper'
        navigation={true}
      >
        {meals.map((meal) => (
          <SwiperSlide>
            <Stack bg={'light'} spacing={2}>
              <Box
                rounded={'2xl'}
                h={'25rem'}
                boxShadow={'lg'}
                overflow={'hidden'}
                as={Link}
                href={`meals/single-meal/${meal.idMeal}`}
                textDecoration={'none'}
              >
                <Image
                  alt={'Random meal'}
                  align={'center'}
                  fit={'cover'}
                  h={'100%'}
                  src={meal.strMealThumb}
                />
              </Box>
              <Text
                as={Link}
                href={`meals/single-meal/${meal.idMeal}`}
                textDecoration={'none'}
                h={'6rem'}
                textStyle={'body2'}
              >
                {meal.strMeal}
              </Text>
            </Stack>
          </SwiperSlide>
        ))}
      </Swiper>
    </Stack>
  );
};
