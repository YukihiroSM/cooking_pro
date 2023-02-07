import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
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
  const singleMealUrl = `${window.location.hostname}/meals/`;

  return (
    <Flex justifyContent={'flex-start'} gap={5} w={'full'} flexWrap={'wrap'}>
      {meals.map((meal) => (
        <Card key={meal.id} maxW='sm'>
          <CardBody>
            <Image
              src={meal.image}
              alt={meal.name}
              fit={'cover'}
              borderRadius='lg'
            />
            <Stack mt='6' spacing='3'>
              <Stack>
                <Heading textStyle={'display2'}>{meal?.name}</Heading>
                <SimpleGrid fontSize={'1.25rem'} mt={2} columns={2} spacing={2}>
                  <Text fontWeight={'bold'}>Category</Text>
                  <Text>{meal?.category}</Text>
                  <Text fontWeight={'bold'}>Area</Text>
                  <Text>{meal?.area}</Text>
                </SimpleGrid>
              </Stack>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
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
                  )}&media=${encodeURIComponent(meal.image)}&description=${
                    meal.name
                  }`}
                />
                <TelegramShareButton
                  children={<TelegramIcon size={32} round={true} />}
                  url={`https://t.me/share/url?url=${encodeURIComponent(
                    `${singleMealUrl}${meal.id}`
                  )}&text=${encodeURIComponent(meal.name)}`}
                />
              </ButtonGroup>
            </ButtonGroup>
          </CardFooter>
        </Card>
      ))}
    </Flex>
  );
};
