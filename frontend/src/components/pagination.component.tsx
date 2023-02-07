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

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollTop();
    }, 300);
    perPage && setCanNextPage(page !== Math.floor(total / perPage));
    setCanPreviousPage(page !== 0);
  }, [page, perPage]);

  return (
    <Container
      fontSize={{ sm: 'sm', md: 'lg' }}
      p={0}
      m={0}
      mt={5}
      maxW={'100vw'}
    >
      <Flex justifyContent='space-between' alignItems='center'>
        <Flex>
          <Tooltip label='First Page'>
            <IconButton
              size={{ sm: 'sm', md: 'md' }}
              aria-label='pagination-first-page'
              onClick={() => setPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={{ sm: 2, md: 3 }} w={{ sm: 2, md: 3 }} />}
              mr={4}
            />
          </Tooltip>
          <Tooltip label='Previous Page'>
            <IconButton
              size={{ sm: 'sm', md: 'md' }}
              aria-label='pagination-previous-page'
              onClick={() => setPage((page || 1) - 1)}
              isDisabled={!canPreviousPage}
              icon={
                <ChevronLeftIcon h={{ sm: 4, md: 6 }} w={{ sm: 4, md: 6 }} />
              }
            />
          </Tooltip>
        </Flex>

        <Flex alignItems='center'>
          <Text flexShrink='0' mr={{ sm: 4, md: 8 }}>
            Page{' '}
            <Text fontWeight='bold' as='span'>
              {typeof page === 'number' && page + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight='bold' as='span'>
              {perPage && Math.floor(total / perPage) + 1}
            </Text>
          </Text>
          <Text flexShrink='0'>Go to page:</Text>{' '}
          <NumberInput
            size={{ sm: 'sm', md: 'md' }}
            focusBorderColor={'orangeDefault'}
            ml={{ sm: 1, md: 2 }}
            mr={{ sm: 4, md: 8 }}
            w={{ sm: 20, md: 28 }}
            min={1}
            max={total + 1}
            onChange={(value) => {
              const page = value ? Number(value) - 1 : 0;
              setPage(page);
            }}
            isDisabled={!canNextPage}
            value={typeof page === 'number' ? page + 1 : 0}
          >
            <NumberInputField
              disabled={!canNextPage}
              fontSize={{ sm: 'sm', md: 'lg' }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <ChakraSelect
            size={{ sm: 'sm', md: 'md' }}
            focusBorderColor={'orangeDefault'}
            fontSize={{ sm: 'sm', md: 'lg' }}
            w={{ sm: 20, md: 32 }}
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
              size={{ sm: 'sm', md: 'md' }}
              aria-label='pagination-last-page'
              onClick={() => setPage((page || 0) + 1)}
              isDisabled={!canNextPage}
              icon={
                <ChevronRightIcon h={{ sm: 4, md: 6 }} w={{ sm: 4, md: 6 }} />
              }
            />
          </Tooltip>
          <Tooltip label='Last Page'>
            <IconButton
              size={{ sm: 'sm', md: 'md' }}
              aria-label='pagination-next-page'
              onClick={() => setPage(perPage && Math.floor(total / perPage))}
              isDisabled={!canNextPage}
              icon={
                <ArrowRightIcon h={{ sm: 2, md: 3 }} w={{ sm: 2, md: 3 }} />
              }
              ml={{ sm: 2, md: 4 }}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Container>
  );
};
