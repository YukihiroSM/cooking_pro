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
  Container,
  Flex,
} from '@chakra-ui/react';
import { useRandomMeals } from '../hooks';
import { Loader } from './loader.component';

export const HeroComponent = () => {
  const toast = useToast();

  const { isLoading, isError, error, data: meals } = useRandomMeals();

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Something went wrong...',
        description: error?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isError]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container display={'block'} maxW={'full'} m={0} p={0} py={'7rem'}>
          <Grid
            maxW={'1600px'}
            templateColumns='repeat(2, 1fr)'
            gap={10}
            my={0}
            mx={'auto'}
            px={20}
            position={'relative'}
          >
            <GridItem
              key={meals && meals[0].id}
              bottom={0}
              mt={'auto'}
              position={'sticky'}
              boxSizing={'border-box'}
            >
              <Stack>
                <Box
                  rounded={'2xl'}
                  boxShadow={'2xl'}
                  overflow={'hidden'}
                  as={Link}
                  href={`/meals/${meals && meals[0].id}`}
                >
                  <Image
                    alt={'Random meal'}
                    align={'center'}
                    fit={'cover'}
                    h={'full'}
                    w={'full'}
                    src={meals && meals[0].image}
                  />
                </Box>
                <Text
                  as={Link}
                  href={`/meals/${meals && meals[0].id}`}
                  textStyle={'h1Semi'}
                >
                  {meals && meals[0].name.split(' ').length > 2
                    ? meals[0].name
                        .replace(/\W/g, ' ')
                        .split(' ')
                        .slice(0, 3)
                        .join(' ')
                    : meals && meals[0].name}
                </Text>
              </Stack>
            </GridItem>
            <GridItem>
              <Flex direction={'column'} gap={10}>
                {meals &&
                  meals.slice(-3).map((meal) => (
                    <Box width={'full'} key={meal.id}>
                      <Grid
                        templateColumns='repeat(2, 1fr)'
                        gap={5}
                        width={'full'}
                      >
                        <Box
                          rounded={'2xl'}
                          boxShadow={'2xl'}
                          overflow={'hidden'}
                          as={Link}
                          href={`/meals/${meal.id}`}
                        >
                          <Image
                            w={'full'}
                            h={'25rem'}
                            alt={'Random meal'}
                            fit={'cover'}
                            src={meal.image}
                          />
                        </Box>
                        <Box>
                          <Text
                            as={Link}
                            href={`/meals/${meal.id}`}
                            textStyle={'body1Semi'}
                          >
                            {meal.name.split(' ').length > 2
                              ? meal.name
                                  .replace(/\W/g, ' ')
                                  .split(' ')
                                  .slice(0, 3)
                                  .join(' ')
                              : meal.name}
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
                      </Grid>
                    </Box>
                  ))}
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      )}
    </>
  );
};
