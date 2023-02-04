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
  useToast,
} from '@chakra-ui/react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper';

import { Meal } from '../types';
import { useMeal, useSetSearchParams } from '../hooks';
import { Loader } from './loader.component';
import { templateMeals } from '../templateData';

export const CarouselComponent = () => {
  const toast = useToast();
  const { randomMeals, allMeals, setTrigger } = useMeal();
  const { params, trigger, setParam, resetParams } = useSetSearchParams();

  const [meals, setMeals] = useState<Meal[] | undefined>(undefined);

  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    isSuccess: isSuccessAll,
    error: errorAll,
    data: allData = { data: templateMeals, metadata: { total: 0 } }, // remove this
  } = allMeals;
  const {
    isLoading: isLoadingRandom,
    isError: isErrorRandom,
    isSuccess: isSuccessRandom,
    error: errorRandom,
    data: mealsRandom = templateMeals,
  } = randomMeals;

  const { data: mealsByCategory } = allData;

  const handleChangeCategory = (index: number) => {
    switch (index) {
      case 0:
        resetParams();
        setMeals(mealsRandom);
        break;
      case 1:
        setParam('category', 'Breakfast');
        setMeals(mealsByCategory);
        break;
      case 2:
        setParam('category', 'Vegan');
        setMeals(mealsByCategory);
        break;
      case 3:
        setParam('category', 'Dessert');
        setMeals(mealsByCategory);
        break;
    }
  };

  useEffect(() => {
    setTrigger(trigger);
  }, [trigger]);

  useEffect(() => {
    if (isErrorAll || isErrorRandom) {
      toast({
        title: 'Something went wrong...',
        description: errorAll?.message || errorRandom?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isErrorAll, isErrorRandom]);

  useEffect(() => {
    !meals && setMeals(mealsRandom);
  }, [mealsRandom]);

  return (
    <>
      {/* {(isLoadingAll || isLoadingRandom) && <Loader />} */}
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
          {meals &&
            meals.map((meal) => (
              <SwiperSlide>
                <Stack bg={'light'} spacing={2}>
                  <Box
                    rounded={'2xl'}
                    h={'25rem'}
                    boxShadow={'lg'}
                    overflow={'hidden'}
                    as={Link}
                    href={`/meals/single-meal/${meal.id}`}
                    textDecoration={'none'}
                  >
                    <Image
                      alt={'Random meal'}
                      align={'center'}
                      fit={'cover'}
                      h={'100%'}
                      src={meal.image}
                    />
                  </Box>
                  <Text
                    as={Link}
                    href={`/meals/single-meal/${meal.id}`}
                    textDecoration={'none'}
                    h={'6rem'}
                    textStyle={'body2'}
                  >
                    {meal.name}
                  </Text>
                </Stack>
              </SwiperSlide>
            ))}
        </Swiper>
      </Stack>
    </>
  );
};
