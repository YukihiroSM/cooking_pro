import React, { useState, useEffect } from 'react';

import {
  Stack,
  Text,
  Box,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper';

import { Meal } from '../types';

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
    <>
      <Stack
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
          {[1, 2, 3, 4, 5, 6, 7].map(() => (
            <SwiperSlide>
              <Stack bg={'light'} spacing={2}>
                <Box
                  rounded={'2xl'}
                  h={'25rem'}
                  boxShadow={'lg'}
                  overflow={'hidden'}
                >
                  <Image
                    alt={'Random meal'}
                    align={'center'}
                    fit={'cover'}
                    h={'100%'}
                    src='https://images.unsplash.com/photo-1661956602944-249bcd04b63f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80'
                  />
                </Box>
                <Text textStyle={'body2'}>Gigantes Plaki</Text>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    </>
  );
};
