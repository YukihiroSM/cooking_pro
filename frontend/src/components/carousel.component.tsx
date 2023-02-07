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
  Container,
} from '@chakra-ui/react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper';

import { Meal } from '../types';
import { useMealsByFilter, useRandomMeals } from '../hooks';
import { CAROUSEL_CATEGORIES } from '../consts';
import { StringParam, useQueryParam } from 'use-query-params';
import { Loader } from './loader.component';

export const CarouselComponent = () => {
  const toast = useToast();
  const [carouselCategory, setCarouselCategory] = useQueryParam(
    'category',
    StringParam
  );

  const [meals, setMeals] = useState<Meal[] | undefined>(undefined);

  const {
    isLoading: isLoadingRandom,
    isError: isErrorRandom,
    error: errorRandom,
    data: mealsRandom,
  } = useRandomMeals();
  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    data = { data: undefined, metadata: { total: null } },
  } = useMealsByFilter();
  const { data: mealsByCategory } = data;

  useEffect(() => {
    if (carouselCategory === 'All') setMeals(mealsRandom);
    else setMeals(mealsByCategory);
  }, [carouselCategory, mealsByCategory, mealsRandom]);

  useEffect(() => {
    setCarouselCategory('All');
  }, []);

  useEffect(() => {
    if (isErrorAll || isErrorRandom) {
      toast({
        title: 'Something went wrong...',
        description:
          errorAll?.response?.data?.message ||
          errorRandom?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isErrorAll, isErrorRandom]);

  const SwiperSlides = meals?.map((meal) => (
    <SwiperSlide key={meal.id}>
      <Stack w={'full'} bg={'light'} spacing={2}>
        <Box
          h={'full'}
          rounded={'2xl'}
          boxShadow={'lg'}
          overflow={'hidden'}
          as={Link}
          href={`/meals/${meal.id}`}
          textDecoration={'none'}
        >
          <Image
            transition={'all .5s ease'}
            _hover={{
              sm: {
                transform: 'none',
              },
              md: {
                transform: 'scale(1.1)',
              },
            }}
            alt={'Random meal'}
            fit={'cover'}
            maxH={'25em'}
            h={'full'}
            src={meal.image}
          />
        </Box>
        <Text
          as={Link}
          href={`/meals/${meal.id}`}
          textDecoration={'none'}
          h={20}
          fontSize={{ sm: 'lg', md: 'xl' }}
        >
          {meal.name.split(' ').length > 2
            ? meal.name.replace(/\W/g, ' ').split(' ').slice(0, 3).join(' ')
            : meal.name}
        </Text>
      </Stack>
    </SwiperSlide>
  ));

  return (
    <>
      {isLoadingRandom ? (
        <Loader />
      ) : (
        <Container
          bg={'light'}
          display={'block'}
          maxW={'full'}
          m={0}
          p={0}
          py={{ sm: 5, md: 10 }}
          px={{ sm: 5, md: 10 }}
        >
          <Stack
            mx={'auto'}
            direction={'column'}
            alignItems={'center'}
            w={'full'}
          >
            <Box as={Stack} p={0} m={0} direction={'column'} align={'center'}>
              <Text textStyle={{ sm: 'body1Semi', md: 'h1Semi' }}>
                Our recommendations
              </Text>
              <Tabs
                mx={'auto'}
                py={{ sm: 4 }}
                variant='soft-rounded'
                colorScheme='orange'
              >
                <TabList>
                  {CAROUSEL_CATEGORIES.map((tab) => (
                    <Tab
                      fontSize={{ sm: 'sm', md: 'md' }}
                      key={tab}
                      onClick={() => setCarouselCategory(tab)}
                      value={tab}
                    >
                      {tab}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </Box>
            <Box h={'27.5em'} w={'full'} display={{ sm: 'none', md: 'block' }}>
              <Swiper
                slidesPerView={5}
                grabCursor={true}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation]}
                className='mySwiper'
                navigation={true}
              >
                {SwiperSlides}
              </Swiper>
            </Box>
            <Box h={'27.5em'} w={'full'} display={{ sm: 'block', md: 'none' }}>
              <Swiper
                grabCursor={true}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Navigation]}
                className='mySwiper'
                navigation={true}
              >
                {SwiperSlides}
              </Swiper>
            </Box>
          </Stack>
        </Container>
      )}
    </>
  );
};
