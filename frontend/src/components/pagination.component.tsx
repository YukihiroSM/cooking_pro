import { useEffect, useState } from 'react';

import {
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select as ChakraSelect,
  Text,
  Tooltip,
  Container,
} from '@chakra-ui/react';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { NumberParam, useQueryParam } from 'use-query-params';
import { PER_PAGE_VALUES } from '../consts';

type Props = {
  total: number;
};

export const PaginationComponent = ({ total }: Props) => {
  const [page, setPage] = useQueryParam('page', NumberParam);
  const [perPage, setPerPage] = useQueryParam('perPage', NumberParam);
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(false);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);

  useEffect(() => {
    setCanNextPage(page !== total);
    setCanPreviousPage(page !== 0);
  }, [page, perPage]);

  return (
    <Container p={0} m={0} mt={5} maxW={'100vw'}>
      <Flex fontSize={'lg'} justifyContent='space-between' alignItems='center'>
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
              {typeof page === 'number' && +1}
            </Text>{' '}
            of{' '}
            <Text fontWeight='bold' as='span'>
              {total + 1}
            </Text>
          </Text>
          <Text flexShrink='0'>Go to page:</Text>{' '}
          <NumberInput
            focusBorderColor={'orangeDefault'}
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={total + 1}
            onChange={(value) => {
              const page = value ? Number(value) - 1 : 0;
              setPage(page);
            }}
            value={typeof page === 'number' ? +1 : 0}
          >
            <NumberInputField fontSize={'lg'} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <ChakraSelect
            focusBorderColor={'orangeDefault'}
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
    </Container>
  );
};
