import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  Input,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { NavItem } from '../types';
import { useEffect, useState } from 'react';
import { throttle } from '../utils';
import { useCategoriesAndIngredients } from '../hooks';
import { ROUTER_KEYS } from '../consts';

export const HeaderComponent = () => {
  const location = useLocation();
  const toast = useToast();

  const {
    isError,
    isLoading,
    error,
    data: navItems,
  } = useCategoriesAndIngredients();

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
      <Box
        mt={0}
        pt={0}
        as='header'
        position='fixed'
        top={0}
        w='100%'
        zIndex={5}
      >
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
          {navItems?.length && (
            <DesktopNav isLoading={isLoading} navItems={navItems} />
          )}
        </Flex>
      </Box>
    </>
  );
};

type DesktopNavProps = {
  navItems: NavItem[];
  isLoading: boolean;
};

const DesktopNav = ({ navItems, isLoading }: DesktopNavProps) => {
  const [filter, setFilter] = useState<string>('');
  return (
    <>
      <Stack direction={'row'} spacing={4}>
        {navItems.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Button
                  variant={'ghost'}
                  as={Link}
                  isDisabled={isLoading}
                  p={2}
                  fontSize={'lg'}
                  fontWeight={500}
                  color={'light'}
                  _active={{
                    bg: 'dark',
                  }}
                  _hover={{
                    textDecoration: 'none',
                    color: 'white',
                  }}
                >
                  {navItem.label}
                </Button>
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
                  <Input
                    isDisabled={isLoading}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder={`Find ${navItem.label
                      .toLowerCase()
                      .substring(0, navItem.label.length - 1)} ${
                      navItem.children[0].children ? 'by category' : ''
                    }`}
                  />
                  <Stack maxHeight={'50vh'} overflowY={'scroll'} zIndex={1}>
                    {navItem.children
                      .filter((child) =>
                        child.label.toLowerCase().includes(filter.toLowerCase())
                      )
                      .map((child) => (
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
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('');

  const handleFilterUpdate = (
    param: string,
    value: string,
    notAFilter: boolean
  ) => {
    if (notAFilter) return;
    let url: string;
    switch (param) {
      case 'Recipes':
        param = 'category';
        url = `${ROUTER_KEYS.MEALS_BY_CATEGORY}/${value}?page=0&perPage=12`;
        break;
      case 'Ingredients':
        param = 'ingredient';
        url = `${ROUTER_KEYS.MEALS_BY_INGREDIENTS}?page=0&perPage=12&${param}=${value}`;
        break;
      default:
        url = '/';
        break;
    }

    navigate(url);
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
          <Input
            onChange={(e) => setFilter(e.target.value)}
            placeholder={`Find ${parentLabel
              .toLowerCase()
              .substring(0, parentLabel.length - 1)}`}
          />
          <Stack zIndex={15} maxHeight={'50vh'} overflowY={'scroll'}>
            {children
              .filter((child) =>
                child.label.toLowerCase().includes(filter.toLowerCase())
              )
              .map((child) => (
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
