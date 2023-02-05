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
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { LocalStorageUser, NavItem } from '../types';
import { useEffect, useState } from 'react';
import { throttle } from '../utils';
import { useCategoriesAndIngredients, useLocalStorage } from '../hooks';
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

  const [huge, setHuge] = useState<boolean>(true);

  useEffect(() => {
    if (location.pathname === '/') {
      const handleScroll = (event: Event) => {
        setHuge(!window.scrollY);
      };

      window.addEventListener('scroll', throttle(handleScroll, 100));

      return () => {
        window.removeEventListener('scroll', throttle(handleScroll, 100));
      };
    } else {
      setHuge(false);
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

  useEffect(() => {
    console.log(huge);
  }, [huge]);

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
          w={'full'}
          bg={'dark'}
          color={'white'}
          transition={'.5s ease all'}
          textStyle={{
            base: 'display2',
            md: huge ? 'display1' : 'body1Semi',
          }}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          align={'center'}
          borderStyle={'solid'}
          borderColor={'gray.200'}
          position={'relative'}
          justifyContent={'center'}
        >
          <Text as='a' href={'/'}>
            Cooking Pro
          </Text>
          <Stack
            position={'absolute'}
            right={0}
            mr={4}
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            display={{ base: 'none', md: 'flex' }}
          >
            <User />
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
        <User />
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
        url = `meals/category/${value}?page=0&perPage=12`;
        break;
      case 'Ingredients':
        param = 'ingredients';
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

const User = () => {
  const [{ id, token }] = useLocalStorage<LocalStorageUser>(
    'cooking-app-user',
    {
      id: undefined,
      token: 'TEST TOKEN STRING', // replace this
    }
  );
  return (
    <>
      {id && token ? (
        <Menu>
          <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
            minW={0}
          >
            <Avatar
              size={'sm'}
              src={
                'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
              }
            />
          </MenuButton>
          <MenuList>
            <MenuItem>Link 1</MenuItem>
            <MenuItem>Link 2</MenuItem>
            <MenuDivider />
            <MenuItem>Link 3</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <>
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
        </>
      )}
    </>
  );
};
