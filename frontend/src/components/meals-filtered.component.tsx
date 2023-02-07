import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Container,
  Divider,
  Flex,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';

import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  TelegramIcon,
  TelegramShareButton,
} from 'react-share';

import { Meal } from '../types';

type Props = {
  meals: Meal[];
};

export const FilteredMealsComponent = ({ meals }: Props) => {
  return (
    <Container bg={'light'} maxW={'none'} m={0} p={0} my={5}>
      <Flex
        direction={{ sm: 'column', md: 'row' }}
        justifyContent={'space-around'}
        gap={5}
        w={'full'}
        flexWrap={'wrap'}
      >
        {meals.map((meal) => (
          <Card
            direction={{ sm: 'row', md: 'column' }}
            key={meal.id}
            w={{ sm: 'full', md: 'xs' }}
            display={{ sm: 'grid', md: 'flex' }}
            gridTemplateColumns={'1fr 2fr'}
          >
            <Flex>
              <Image
                display={{ sm: 'block', md: 'none' }}
                src={meal.image}
                alt={meal.name}
                fit={'cover'}
                borderRadius='lg'
              />
            </Flex>

            <CardBody>
              <Image
                display={{ sm: 'none', md: 'block' }}
                src={meal.image}
                alt={meal.name}
                fit={'cover'}
                borderRadius='lg'
              />
              <Stack mt={{ sm: 'none', md: 6 }} spacing='3'>
                <Text textStyle={'body1Semi'}>{meal?.name}</Text>
                <SimpleGrid
                  fontSize={{ sm: 'lg', md: 'xl' }}
                  mt={2}
                  columns={2}
                  spacing={2}
                >
                  <Text fontWeight={'bold'}>Category</Text>
                  <Text>{meal?.category}</Text>
                  <Text fontWeight={'bold'}>Area</Text>
                  <Text>{meal?.area}</Text>
                </SimpleGrid>
                <Box display={{ sm: 'block', md: 'none' }}>
                  <SocialMediaButtons meal={meal} />
                </Box>
              </Stack>
            </CardBody>
            <Divider display={{ sm: 'none', md: 'block' }} />
            <CardFooter display={{ sm: 'none', md: 'block' }}>
              <SocialMediaButtons meal={meal} />
            </CardFooter>
          </Card>
        ))}
      </Flex>
    </Container>
  );
};

type SocialMediaButtonsProps = {
  meal: Meal;
};

const SocialMediaButtons = ({ meal }: SocialMediaButtonsProps) => {
  const singleMealUrl = `${window.location.hostname}/meals/`;
  return (
    <ButtonGroup
      w={'full'}
      as={Flex}
      justifyContent={'space-between'}
      spacing='2'
    >
      <Button
        as={Link}
        href={`/meals/${meal.id}`}
        variant='solid'
        bg={'attention.dark'}
        color={'white'}
        _hover={{
          textDecoration: 'none',
          bg: 'attention.light',
        }}
        h={{ sm: 9, md: 10 }}
        px={{ sm: 3, md: 4 }}
        transition={'all .5s ease'}
        fontSize={{ sm: 'sm', md: 'md' }}
      >
        Read more
      </Button>
      <ButtonGroup>
        <FacebookShareButton
          children={<FacebookIcon size={32} round={true} />}
          url={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
            `${singleMealUrl}${meal.id}`
          )}`}
        />
        <PinterestShareButton
          description={meal.name}
          media={meal.image}
          children={<PinterestIcon size={32} round={true} />}
          url={`http://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            `${singleMealUrl}${meal.id}`
          )}&media=${encodeURIComponent(meal.image)}&description=${meal.name}`}
        />
        <TelegramShareButton
          children={<TelegramIcon size={32} round={true} />}
          url={`https://t.me/share/url?url=${encodeURIComponent(
            `${singleMealUrl}${meal.id}`
          )}&text=${encodeURIComponent(meal.name)}`}
        />
      </ButtonGroup>
    </ButtonGroup>
  );
};
