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
import { useMealsByCategory, useRandomMeals } from '../hooks';
import { Loader } from './loader.component';
import { CAROUSEL_CATEGORIES } from '../consts';

export const CarouselComponent = () => {
  const toast = useToast();
  const [carouselCategory, setCarouselCategory] = useState<string | undefined>(
    undefined
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
  } = useMealsByCategory(carouselCategory);
  const { data: mealsByCategory } = data;

  useEffect(() => {
    if (carouselCategory) setMeals(mealsByCategory);
    else setMeals(mealsRandom);
  }, [carouselCategory, mealsByCategory, mealsRandom]);

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

  return (
    <>
      {isLoadingAll || isLoadingRandom ? (
        <Loader />
      ) : (
        <Container
          bg={'light'}
          display={'block'}
          maxW={'full'}
          m={0}
          p={0}
          py={'5rem'}
        >
          <Stack
            mx={'auto'}
            px={20}
            direction={'column'}
            alignItems={'center'}
            w={'full'}
          >
            <Text textStyle={'h1Semi'}>Our recommendations</Text>
            <Tabs py={{ base: 4 }} variant='soft-rounded' colorScheme='orange'>
              <TabList>
                {CAROUSEL_CATEGORIES.map((tab) => (
                  <Tab
                    key={tab}
                    onClick={() => {
                      if (tab === 'All') setCarouselCategory(undefined);
                      else setCarouselCategory(tab);
                    }}
                    value={tab}
                  >
                    {tab}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
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
              {meals?.map((meal) => (
                <SwiperSlide>
                  <Stack bg={'light'} spacing={2}>
                    <Box
                      h={'20rem'}
                      rounded={'2xl'}
                      boxShadow={'lg'}
                      overflow={'hidden'}
                      as={Link}
                      href={`/meals/${meal.id}`}
                      textDecoration={'none'}
                    >
                      <Image
                        transition={'.5s ease all'}
                        _hover={{
                          transform: 'scale(1.1)',
                        }}
                        alt={'Random meal'}
                        fit={'cover'}
                        h={'100%'}
                        src={meal.image}
                      />
                    </Box>
                    <Text
                      as={Link}
                      href={`/meals/${meal.id}`}
                      textDecoration={'none'}
                      h={'6rem'}
                      textStyle={'body2'}
                    >
                      {meal.name.split(' ').length > 2
                        ? meal.name.replace(/\W/g, " ").split(' ').slice(0, 3).join(' ')
                        : meal.name}
                    </Text>
                  </Stack>
                </SwiperSlide>
              ))}
            </Swiper>
          </Stack>
        </Container>
      )}
    </>
  );
};
