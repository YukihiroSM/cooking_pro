import React, { useEffect, useRef } from 'react';

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
  useToast,
  Link,
  Container,
} from '@chakra-ui/react';
import { useMealsByCategory, useSingleMeal } from '../hooks';
import { Loader } from './loader.component';
import { StringParam, useQueryParam } from 'use-query-params';

export const SingleMealComponent = () => {
  const instructionsSection = useRef<HTMLDivElement>(
    null
  ) as React.MutableRefObject<HTMLDivElement>;
  const toast = useToast();
  const [, setCarouselCategory] = useQueryParam('category', StringParam);

  const {
    isLoading: isLoadingSingle,
    isError: isErrorSingle,
    error: errorSingle,
    data: meal,
  } = useSingleMeal();
  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    data = { data: undefined, metadata: { total: null } },
  } = useMealsByCategory();

  const { data: meals } = data;

  const scrollDown = () => {
    window.scrollTo({
      top: instructionsSection.current.offsetTop - 100,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    meal && setCarouselCategory(meal.category);
  }, [meal]);

  useEffect(() => {
    if (isErrorSingle || isErrorAll) {
      toast({
        title: 'Something went wrong...',
        description: errorSingle?.message || errorAll?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isErrorSingle, isErrorAll]);

  return (
    <>
      {/* {isLoadingSingle || isLoadingAll ? ( */}
      {false ? (
        <Loader />
      ) : (
        <Container m={0} p={0} maxW={'100vw'}>
          <Stack direction={'column'} spacing={0}>
            <Grid
              position={'relative'}
              h={'calc(100vh - 6.3rem)'}
              borderBottom={0.5}
              borderColor={'black'}
              borderStyle={'solid'}
              templateColumns='repeat(2, 1fr)'
              w={'100vw'}
            >
              <Box
                position={'absolute'}
                left={0}
                bottom={32}
                right={0}
                mx={'auto'}
                id='arrow-scroll-hint'
                className='demo'
                cursor={'pointer'}
              >
                <Link onClick={() => scrollDown()}>
                  <span></span>
                  <span></span>
                  <span></span>
                </Link>
              </Box>
              <GridItem
                as={Flex}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Stack maxWidth={'25rem'}>
                  <Text textStyle={'display2'}>{meal?.name}</Text>
                  <Divider />
                  <SimpleGrid
                    fontSize={'1.25rem'}
                    mt={2}
                    columns={2}
                    spacing={2}
                  >
                    <Text fontWeight={'bold'}>Category</Text>
                    <Text>{meal?.category}</Text>
                    <Text fontWeight={'bold'}>Area</Text>
                    <Text>{meal?.area}</Text>
                  </SimpleGrid>
                </Stack>
              </GridItem>
              <GridItem justifyContent={'flex-end'} overflow={'hidden'}>
                <Box>
                  <Image
                    alt={meal?.name}
                    align={'center'}
                    fit={'cover'}
                    w={'full'}
                    h={'full'}
                    src={meal?.image}
                  />
                </Box>
              </GridItem>
            </Grid>
            <Grid
              ref={instructionsSection}
              bg={'light'}
              templateColumns={'repeat(2, 1fr)'}
              templateRows={'2fr, 1fr'}
              w={'100vw'}
            >
              <GridItem>
                <Stack ml={20} my={10}>
                  <Text textStyle={'body1Semi'}>Instructions </Text>
                  <Divider />
                  <Text h={'25rem'} overflowY={'scroll'} textStyle={'body2'}>
                    {meal?.instructions}
                  </Text>
                  <Text fontWeight={'thin'} fontSize={'sm'} as={'span'}>
                    * Scroll instructions text to read more
                  </Text>
                </Stack>
              </GridItem>
              <GridItem
                pr={20}
                pl={10}
                as={Flex}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Box
                  title='Video tutorial'
                  as='iframe'
                  src={meal?.video}
                  width='100%'
                  sx={{
                    aspectRatio: '16/9',
                  }}
                />
              </GridItem>
              <GridItem>
                <Stack ml={'5rem'} my={'2rem'}>
                  <Text textStyle={'body1Semi'}>Ingredients</Text>
                  {meal?.ingredients.map((ingredient, index) => (
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
                  <Text px={10} textStyle={'body1Semi'}>
                    Measures
                  </Text>
                  {meal?.measures.map((measure, index) => (
                    <Text
                      px={10}
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
              <Text textStyle={'h1Semi'}>More of {meal?.category}</Text>
              <Grid
                px={20}
                templateColumns={'repeat(2, 1fr)'}
                templateRows={'repeat(4, 1fr)'}
                w={'100vw'}
              >
                {meals &&
                  meals.slice(0, 8).map((meal) => (
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
                          href={`/meals/${meal.id}`}
                        ></Box>
                        <Image
                          alt={'Random meal'}
                          align={'center'}
                          fit={'cover'}
                          w={'full'}
                          src={meal.image}
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
                        {meal.name.split(' ').length > 2
                          ? meal.name
                              .replace(/\W/g, ' ')
                              .split(' ')
                              .slice(0, 3)
                              .join(' ')
                          : meal.name}
                      </Text>
                    </GridItem>
                  ))}
              </Grid>
            </Stack>
          </Stack>
        </Container>
      )}
    </>
  );
};
