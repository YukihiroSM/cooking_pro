import { useEffect, useState } from 'react';

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select as ChakraSelect,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  FormControl,
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { NumberParam, useQueryParam } from 'use-query-params';
import { PER_PAGE_VALUES } from '../consts';

type Props = {
  meals: Meal[];
  total: number;
};

export const FilteredMealsComponent = ({ meals, total }: Props) => {
  const [page, setPage] = useQueryParam('page', NumberParam);
  const [perPage, setPerPage] = useQueryParam('perPage', NumberParam);
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(false);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);

  const singleMealUrl = `${window.location.hostname}/meals/`;

  useEffect(() => {
    setCanNextPage(page !== total);
    setCanPreviousPage(page !== 0);
  }, [page, perPage]);

  return (
    <>
      <Stack
        direction={'column'}
        spacing={10}
        maxWidth={'100wv'}
        w={'full'}
        px={20}
        py={10}
        bg={'light'}
        m={0}
      >
        <FormControl></FormControl>
        <Flex
          justify={'space-between'}
          rowGap={10}
          align={'center'}
          flexWrap={'wrap'}
        >
          {meals.map((meal) => (
            <Card maxW='sm'>
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
        <Flex
          fontSize={'lg'}
          justifyContent='space-between'
          mx={20}
          alignItems='center'
        >
          <Flex>
            <Tooltip label='First Page'>
              <IconButton
                aria-label='pagination-first-page'
                onClick={() => setPage(0)}
                isDisabled={!canPreviousPage}
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
              />
            </Tooltip>
            <Tooltip label='Previous Page'>
              <IconButton
                aria-label='pagination-previous-page'
                onClick={() => setPage((page || 1) - 1)}
                isDisabled={!canPreviousPage}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex alignItems='center'>
            <Text flexShrink='0' mr={8}>
              Page{' '}
              <Text fontWeight='bold' as='span'>
                {(page || 1) + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight='bold' as='span'>
                {total + 1}
              </Text>
            </Text>
            <Text flexShrink='0'>Go to page:</Text>{' '}
            <NumberInput
              ml={2}
              mr={8}
              w={28}
              min={1}
              max={total + 1}
              onChange={(value) => {
                const page = value ? Number(value) - 1 : 0;
                setPage(page);
              }}
              value={(page || 1) + 1}
            >
              <NumberInputField fontSize={'lg'} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <ChakraSelect
              fontSize={'lg'}
              w={32}
              value={perPage || 1}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
              }}
            >
              {PER_PAGE_VALUES.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </ChakraSelect>
          </Flex>

          <Flex>
            <Tooltip label='Next Page'>
              <IconButton
                aria-label='pagination-last-page'
                onClick={() => setPage((page || 1) + 1)}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            </Tooltip>
            <Tooltip label='Last Page'>
              <IconButton
                aria-label='pagination-next-page'
                onClick={() => setPage(total)}
                isDisabled={!canNextPage}
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};
