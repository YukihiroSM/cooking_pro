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
import { templateMeals } from '../templateData';

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
        px={20}
        py={20}
        gap={10}
      >
        <GridItem
          key={meals && meals[0].id}
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
              href={`/meals/single-meal/${meals && meals[0].id}`}
            >
              <Image
                alt={'Random meal'}
                align={'center'}
                fit={'cover'}
                h={'100%'}
                src={meals && meals[0].image}
              />
            </Box>
            <Text
              as={Link}
              href={`/meals/single-meal/${meals && meals[0].id}`}
              textStyle={'h1Semi'}
            >
              {meals && meals[0].name}
            </Text>
          </Stack>
        </GridItem>
        <GridItem>
          <Grid templateRows='repeat(3, 1fr)' gap={5}>
            {meals &&
              meals.slice(-3).map((meal) => (
                <GridItem key={meal.id}>
                  <Stack direction={'row'} spacing={4}>
                    <Box
                      rounded={'2xl'}
                      h={'25rem'}
                      w={'20rem'}
                      boxShadow={'2xl'}
                      overflow={'hidden'}
                      as={Link}
                      href={`/meals/single-meal/${meal.id}`}
                    >
                      <Image
                        alt={'Random meal'}
                        align={'center'}
                        fit={'cover'}
                        h={'100%'}
                        src={meal.image}
                      />
                    </Box>
                    <Box>
                      <Text
                        as={Link}
                        href={`/meals/single-meal/${meal.id}`}
                        textStyle={'body1Semi'}
                      >
                        {meal.name}
                      </Text>
                      <Divider />
                      <SimpleGrid
                        fontSize={'1.25rem'}
                        mt={2}
                        columns={2}
                        spacing={2}
                      >
                        <Text fontWeight={'bold'}>Category</Text>
                        <Text>{meal.category}</Text>
                        <Text fontWeight={'bold'}>Area</Text>
                        <Text>{meal.area}</Text>
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
