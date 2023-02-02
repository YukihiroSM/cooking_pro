import {
  Box,
  Grid,
  Image,
  GridItem,
  Text,
  Stack,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';

export const HeroComponent = () => {
  return (
    <Grid
      bg={'white'}
      templateColumns='repeat(2, 1fr)'
      m={0}
      w={'100vw'}
      px={{ base: 20 }}
      py={{ base: 20 }}
      gap={10}
    >
      <GridItem bottom={0} mt={'auto'} position={'sticky'}>
        <Stack spacing={4}>
          <Box
            rounded={'2xl'}
            h={'40rem'}
            boxShadow={'2xl'}
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
          <Text textStyle={'h1Semi'}>Gigantes Plaki</Text>
        </Stack>
      </GridItem>
      <GridItem>
        <Grid templateRows='repeat(3, 1fr)' gap={5}>
          {[1, 2, 3].map(() => (
            <GridItem key={Date.now()}>
              <Stack direction={'row'} spacing={4}>
                <Box
                  rounded={'2xl'}
                  h={'25rem'}
                  w={'20rem'}
                  boxShadow={'2xl'}
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
                <Box>
                  <Text textStyle={'body1Semi'}>Gigantes Plaki</Text>
                  <Divider />
                  <SimpleGrid
                    fontSize={'1.25rem'}
                    mt={2}
                    columns={2}
                    spacing={2}
                  >
                    <Text fontWeight={'bold'}>Category</Text>
                    <Text>Vegan</Text>
                    <Text fontWeight={'bold'}>Area</Text>
                    <Text>Ukraine</Text>
                  </SimpleGrid>
                </Box>
              </Stack>
            </GridItem>
          ))}
        </Grid>
      </GridItem>
    </Grid>
  );
};
