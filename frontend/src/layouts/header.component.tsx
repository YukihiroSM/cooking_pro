import React from 'react';
import { useLocation } from 'react-router-dom';

import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useToast,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { NavItem } from '../types';
import { useEffect, useState } from 'react';
import { throttle } from '../utils';
import { useSetSearchParams, useMeal } from '../hooks';
import { ROUTER_KEYS } from '../consts';
import { NAV_ITEMS } from '../templateData';

export const HeaderComponent = () => {
  const { categoriesAndIngredients } = useMeal();
  const location = useLocation();
  const toast = useToast();

  const {
    isLoading,
    isError,
    isSuccess,
    error,
    data: navItems = NAV_ITEMS,
  } = categoriesAndIngredients;

  const [scrollTop, setScrollTop] = useState<number | null>(0);

  useEffect(() => {
    if (location.pathname === '/') {
      const handleScroll = (event: Event) => {
        setScrollTop(window.scrollY);
      };

      window.addEventListener('scroll', throttle(handleScroll, 100));

      return () => {
        window.removeEventListener('scroll', throttle(handleScroll, 100));
      };
    } else {
      setScrollTop(null);
    }
  }, []);

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

  return (
    <>
      {/* {isLoading && <Loader />} */}
      <Box as='header' position='fixed' top={0} w='100%' zIndex={5}>
        <Flex
          bg={'dark'}
          color={'white'}
          transition={'font-size 0.5s'}
          textStyle={{
            base: 'display2',
            md:
              scrollTop === null || (scrollTop && scrollTop > 0)
                ? 'body1Semi'
                : 'display1',
          }}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={'gray.200'}
          align={'center'}
          position={'relative'}
          justifyContent={'center'}
        >
          <Text as='a' href={'/'}>
            Cooking Pro
          </Text>
          <Stack
            position={'absolute'}
            right={'2rem'}
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            justifySelf={'flex-end'}
            direction={'row'}
            spacing={6}
            display={{ base: 'none', md: 'flex' }}
          >
            <Button
              as={'a'}
              fontSize={'lg'}
              fontWeight={400}
              variant={'link'}
              href={'/user/login'}
              color={'white'}
            >
              Sign In
            </Button>
            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'lg'}
              fontWeight={600}
              color={'white'}
              bg={'attention.dark'}
              as='a'
              href={'/user/register'}
              _hover={{
                bg: 'attention.light',
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Flex>
        <Flex
          display={'flex'}
          justify={{ base: 'space-between', md: 'start' }}
          py={{ base: 2 }}
          px={{ base: 20 }}
          bg={'dark'}
          color={'white'}
          minH={'60px'}
          align={'center'}
        >
          <DesktopNav navItems={navItems} />
        </Flex>
      </Box>
    </>
  );
};

const DesktopNav = ({ navItems }: { navItems: NavItem[] }) => {
  return (
    <>
      <Stack direction={'row'} spacing={4}>
        {navItems.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  p={2}
                  fontSize={'lg'}
                  fontWeight={500}
                  color={'light'}
                  _hover={{
                    textDecoration: 'none',
                    color: 'white',
                  }}
                >
                  {navItem.label}
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={1}
                  borderStyle={'solid'}
                  borderColor={'attention.light'}
                  boxShadow={'xl'}
                  bg={'black'}
                  p={4}
                  rounded={'xl'}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav
                        key={child.label}
                        parentLabel={navItem.label}
                        {...child}
                      />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={'flex-end'}
        direction={'row'}
        spacing={6}
        display={{ base: 'flex', md: 'none' }}
      >
        <Button
          as={'a'}
          fontSize={'sm'}
          fontWeight={400}
          variant={'link'}
          href={'/user/login'}
          color={'white'}
        >
          Sign In
        </Button>
        <Button
          display={'inline-flex'}
          fontSize={'sm'}
          fontWeight={600}
          color={'white'}
          bg={'attention.dark'}
          as='a'
          href={'/user/register'}
          _hover={{
            bg: 'attention.light',
          }}
        >
          Sign Up
        </Button>
      </Stack>
    </>
  );
};

type WithParentLabel = {
  parentLabel: string;
};

const DesktopSubNav = ({
  parentLabel,
  label,
  children,
}: NavItem & WithParentLabel) => {
  const location = useLocation();
  const { setTrigger } = useMeal();
  const { params, searchParams, trigger, setParam, resetParams } =
    useSetSearchParams();

  const handleFilterUpdate = (
    param: string,
    value: string,
    notAFilter: boolean
  ) => {
    if (notAFilter) return;
    resetParams();
    switch (param) {
      case 'Ingredients':
        param = 'ingredient';
        break;
      case 'Recipes':
        param = 'category';
        break;
    }
    if (location.pathname !== '/meals/') {
      window.location.href = `${ROUTER_KEYS.MEALS_BY_FILTER}?${param}=${value}&page=0&perPage=0`;
    } else {
      setParam(param, [value]);
    }
    setTrigger(trigger);
  };
  return (
    <Popover trigger={'hover'} placement={'right-start'}>
      <PopoverTrigger>
        <Link
          onClick={() => handleFilterUpdate(parentLabel, label, !!children)}
          role={'group'}
          display={'block'}
          p={2}
          rounded={'md'}
          _hover={{ bg: 'dark' }}
        >
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text
                fontSize={'md'}
                transition={'all .3s ease'}
                _groupHover={{ color: 'attention.dark' }}
                fontWeight={500}
              >
                {label}
              </Text>
            </Box>
            {children && (
              <Flex
                transition={'all .3s ease'}
                transform={'translateX(-10px)'}
                opacity={0}
                _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                justify={'flex-end'}
                align={'center'}
                flex={1}
              >
                <Icon
                  color={'attention.dark'}
                  w={5}
                  h={5}
                  as={ChevronRightIcon}
                />
              </Flex>
            )}
          </Stack>
        </Link>
      </PopoverTrigger>
      {children && (
        <PopoverContent
          border={1}
          borderStyle={'solid'}
          borderColor={'attention.light'}
          boxShadow={'xl'}
          bg={'black'}
          p={4}
          rounded={'xl'}
        >
          <Stack>
            {children.map((child) => (
              <DesktopSubNav
                parentLabel={parentLabel}
                key={child.label}
                {...child}
              />
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  );
};
