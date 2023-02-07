import React, { useEffect, useState } from 'react';

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
  Container,
  Flex,
} from '@chakra-ui/react';
import { useRandomMeals } from '../hooks';
import { Loader } from './loader.component';
import { NotificationComponent } from './notification.component';
import { Notification } from '../types';

export const HeroComponent = () => {
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  const { isLoading, isError, error, data: meals } = useRandomMeals();

  useEffect(() => {
    if (isError) {
      setNotification({
        status: 'error',
        error: error || undefined,
      });
    }
  }, [isError]);

  const RandomMeals =
    meals &&
    meals.slice(-3).map((meal) => (
      <Box width={'full'} key={meal.id}>
        <Grid templateColumns='repeat(2, 1fr)' gap={5} width={'full'}>
          <Box
            rounded={'2xl'}
            boxShadow={'2xl'}
            _hover={{
              sm: {
                boxShadow: '2xl',
              },
              md: {
                boxShadow: 'xl',
              },
            }}
            overflow={'hidden'}
            as={Link}
            href={`/meals/${meal.id}`}
          >
            <Image
              transition={'all .5s ease'}
              _hover={{
                sm: {
                  transform: 'scale(1.1)',
                },
                md: {
                  transform: 'none',
                },
              }}
              h={'full'}
              alt={meal.name}
              fit={'cover'}
              src={meal.image}
            />
          </Box>
          <Box>
            <Text
              as={Link}
              href={`/meals/${meal.id}`}
              textStyle={'body1Semi'}
              fontSize={{ sm: '1.5rem' }}
            >
              {meal.name.split(' ').length > 2
                ? meal.name.replace(/\W/g, ' ').split(' ').slice(0, 3).join(' ')
                : meal.name}
            </Text>
            <Divider />
            <SimpleGrid
              fontSize={{ sm: '1rem', md: '1.25rem' }}
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
    ));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container
          position={'relative'}
          display={'block'}
          maxW={'full'}
          m={0}
          p={0}
          px={{ sm: 10, md: 40 }}
          py={{ sm: '5rem', md: '7rem' }}
        >
          {notification && (
            <NotificationComponent notification={notification} />
          )}
          <Grid
            display={{ md: 'none', sm: 'grid' }}
            templateRows={'repeat(3, 1fr)'}
            rowGap={10}
          >
            {RandomMeals}
          </Grid>
          <Grid
            display={{ sm: 'none', md: 'grid' }}
            maxW={'1600px'}
            templateColumns='repeat(2, 1fr)'
            gap={10}
            my={0}
            mx={'auto'}
            position={'relative'}
          >
            <GridItem
              key={meals && meals[4].id}
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
                  _hover={{
                    boxShadow: 'xl',
                  }}
                  as={Link}
                  href={`/meals/${meals && meals[4].id}`}
                >
                  <Image
                    alt={'Random meal'}
                    align={'center'}
                    fit={'cover'}
                    w={'full'}
                    h={'full'}
                    src={meals && meals[4].image}
                  />
                </Box>
                <Text
                  as={Link}
                  href={`/meals/${meals && meals[4].id}`}
                  textStyle={'h1Semi'}
                >
                  {meals && meals[4].name.split(' ').length > 2
                    ? meals[4].name
                        .replace(/\W/g, ' ')
                        .split(' ')
                        .slice(0, 3)
                        .join(' ')
                    : meals && meals[4].name}
                </Text>
              </Stack>
            </GridItem>
            <GridItem>
              <Flex direction={'column'} gap={10}>
                {RandomMeals}
              </Flex>
            </GridItem>
          </Grid>
        </Container>
      )}
    </>
  );
};
