import React, { useEffect, useState } from 'react';

import {
  Container,
  TableContainer,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  useToast,
  IconButton,
  TableCaption,
} from '@chakra-ui/react';

import { ingredients as templateData } from '../templateData';

import { useUserIngredients } from '../hooks';
import { Loader } from './loader.component';
import { Ingredient } from '../types';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  UpDownIcon,
} from '@chakra-ui/icons';
import { USER_INGREDIENTS_PARAMS } from '../consts';

type TableSort = {
  value: number;
  param: string;
};

export const UserIngredientsComponent = () => {
  const [filtered, setFiltered] = useState<Ingredient[]>();
  const [sort, setSort] = useState<TableSort>({
    param: 'label',
    value: 0,
  });
  const toast = useToast();
  const {
    isLoading,
    isError,
    error,
    data = { data: templateData, metadata: { total: 0 } },
  } = useUserIngredients();

  const { data: ingredients } = data;

  const handleChangeSort = (currParam: string) => {
    setSort({
      param: currParam,
      value:
        currParam !== sort.param || sort.value === 0
          ? -1
          : sort.value === -1
          ? 1
          : 0,
    });
  };

  const sortByLabel = () =>
    ingredients &&
    [...ingredients]?.sort((a: any, b: any) => {
      if (a[sort.param as string] < b[sort.param as string]) {
        return -1;
      }
      if (a[sort.param as string] > b[sort.param as string]) {
        return 1;
      }
      return 0;
    });

  const handleChangeFilter = () => {
    switch (sort.value) {
      case 0:
        setFiltered(ingredients && [...ingredients]);
        break;
      case 1:
        setFiltered(sortByLabel()?.reverse());
        break;
      case -1:
        setFiltered(sortByLabel());
        break;
    }
  };

  useEffect(() => {
    handleChangeFilter();
  }, [sort]);

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

  const icon =
    sort.value === -1 ? (
      <ChevronDownIcon ml={1} w={4} h={4} />
    ) : sort.value === 1 ? (
      <ChevronUpIcon ml={1} w={4} h={4} />
    ) : (
      <UpDownIcon ml={1} w={4} h={4} />
    );

  return (
    <>
      <Container
        textStyle={'body2'}
        bg={'white'}
        maxW={'100vw'}
        m={0}
        px={20}
        py={10}
      >
        <TableContainer w={'full'}>
          <Table size='md' variant='simple' colorScheme='orange'>
            <Thead textStyle={'body2Semi'}>
              <Tr>
                {USER_INGREDIENTS_PARAMS.map((param: string) => (
                  <Td
                    w={20}
                    cursor={'pointer'}
                    isNumeric={param === 'Measure'}
                    onClick={() => handleChangeSort(param.toLowerCase())}
                  >
                    {param}
                    {sort.param === param.toLowerCase() ? (
                      icon
                    ) : (
                      <UpDownIcon ml={1} w={4} h={4} />
                    )}
                  </Td>
                ))}
                <Td align='center'></Td>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {filtered?.map((ingredient: Ingredient) => (
                    <Tr key={ingredient.id}>
                      <Td>{ingredient.label}</Td>
                      <Td>{ingredient.category}</Td>
                      <Td isNumeric>{ingredient.measure}</Td>
                      <Td w={10} textAlign={'center'}>
                        <IconButton
                          size={'md'}
                          colorScheme={'orange'}
                          aria-label='Delete ingredient'
                          icon={<DeleteIcon />}
                        />
                      </Td>
                    </Tr>
                  ))}
                </>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};
