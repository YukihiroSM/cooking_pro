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
  Input,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ButtonGroup,
} from '@chakra-ui/react';

import { ChevronRightIcon } from '@chakra-ui/icons';

import { LocalStorageUser, NavItem } from '../types';
import { useEffect, useState } from 'react';
import { throttle } from '../utils';
import { useCategoriesAndIngredients, useLocalStorage } from '../hooks';
import { ROUTER_KEYS } from '../consts';

export const HeaderComponent = () => {
  const { pathname } = useLocation();
  const toast = useToast();

  const {
    isError,
    isLoading,
    error,
    data: navItems,
  } = useCategoriesAndIngredients();

  const [huge, setHuge] = useState<boolean>(true);

  useEffect(() => {
    if (pathname === '/') {
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
        description: error?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [isError]);

  return (
    <Box
      mt={0}
      pt={0}
      as='header'
      position='fixed'
      top={0}
      w='100%'
      zIndex={50}
    >
      <Flex
        w={'full'}
        bg={'dark'}
        color={'white'}
        transition={'all .5s ease'}
        fontSize={{ sm: '2.5rem' }}
        textStyle={{
          sm: 'display2',
          md: huge ? 'display1' : 'body1Semi',
        }}
        py={{ md: 2 }}
        px={{ md: 4 }}
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
          mr={pathname === '/' ? 40 : 10}
          flex={{ sm: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          display={{ sm: 'none', md: 'flex' }}
        >
          <User huge={huge} />
        </Stack>
      </Flex>

      <Flex
        display={'flex'}
        justify={{ sm: 'space-between', md: 'start' }}
        py={{ sm: 2 }}
        px={{ sm: 10, md: pathname === '/' ? 40 : 5 }}
        bg={'dark'}
        color={'white'}
        minH={'60px'}
        align={'center'}
      >
        {navItems?.length && (
          <DesktopNav huge={huge} isLoading={isLoading} navItems={navItems} />
        )}
      </Flex>
    </Box>
  );
};

type DesktopNavProps = {
  navItems: NavItem[];
  isLoading: boolean;
  huge: boolean;
};

const DesktopNav = ({ navItems, isLoading, huge }: DesktopNavProps) => {
  const [filter, setFilter] = useState<string>('');
  return (
    <>
      <Stack direction={'row'} spacing={{ sm: 2, md: 4 }}>
        {navItems.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Button
                  variant={'ghost'}
                  as={Link}
                  isDisabled={isLoading}
                  p={2}
                  fontSize={{ sm: 'md', md: 'lg' }}
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
                  p={{ sm: 2, md: 4 }}
                  rounded={'xl'}
                  w={{ sm: 40, md: 'full' }}
                >
                  <Input
                    fontSize={{ sm: 'sm', md: 'md' }}
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
        flex={{ sm: 1, md: 0 }}
        justify={'flex-end'}
        direction={'row'}
        spacing={6}
        display={{ sm: 'flex', md: 'none' }}
      >
        <User huge={huge} />
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
        url = `${ROUTER_KEYS.MEALS_BY_CATEGORY}?page=0&perPage=12&${param}=${value}`;
        break;
      case 'Ingredients':
        param = 'ingredients';
        url = `${ROUTER_KEYS.MEALS_BY_INGREDIENTS}?page=0&perPage=12&${param}=${value}`;
        break;
      default:
        url = '/';
        break;
    }

    window.location.href = url;
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
                fontSize={{ sm: 'sm', md: 'md' }}
                transition={'all .5s ease'}
                _groupHover={{ color: 'attention.dark' }}
                fontWeight={500}
              >
                {label}
              </Text>
            </Box>
            {children && (
              <Flex
                transition={'all .5s ease'}
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
          w={{ sm: 40, md: 'full' }}
          border={1}
          borderStyle={'solid'}
          borderColor={'attention.light'}
          boxShadow={'xl'}
          bg={'black'}
          p={4}
          rounded={'xl'}
        >
          <Input
            fontSize={{ sm: 'sm', md: 'md' }}
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

type UserProps = {
  huge: boolean;
};

const User = ({ huge }: UserProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ id, token }, setLocalStorageUser] =
    useLocalStorage<LocalStorageUser>('cooking-app-user', {
      id: undefined,
      token: undefined,
    });
  return (
    <>
      {id && token ? (
        <>
          <ModalLogOut
            isOpen={isOpen}
            onClose={onClose}
            setLocalStorageUser={setLocalStorageUser}
          />
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <Avatar
                bg={'attention.dark'}
                transition={'all .5s ease'}
                size={{ sm: 'sm', md: huge ? 'md' : 'sm' }}
              />
            </MenuButton>
            <MenuList
              borderColor={'attention.light'}
              bg={'black'}
              fontSize={{ sm: 'sm', md: huge ? 'lg' : 'md' }}
              lineHeight={2}
              color={'white'}
            >
              <MenuItem
                as={Link}
                href={`/user/${id}/ingredients?page=0&perPage=10`}
                _hover={{
                  textDecoration: 'none',
                  color: 'attention.light',
                }}
                fontWeight={400}
                bg={'black'}
              >
                My ingredients
              </MenuItem>
              <MenuItem
                as={Link}
                href={`/user/${id}/possible-meals?page=0&perPage=10`}
                _hover={{
                  textDecoration: 'none',
                  color: 'attention.light',
                }}
                fontWeight={400}
                bg={'black'}
              >
                What can I cook?
              </MenuItem>
              <MenuDivider />
              <MenuItem
                _hover={{
                  textDecoration: 'none',
                  color: 'attention.light',
                }}
                bg={'black'}
                fontWeight={600}
                onClick={() => onOpen()}
              >
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      ) : (
        <>
          <Button
            h={{ sm: 9, md: 10 }}
            px={{ sm: 3, md: 4 }}
            as={'a'}
            transition={'all .5s ease'}
            fontSize={{ sm: 'sm', md: huge ? 'md' : 'sm' }}
            fontWeight={400}
            variant={'link'}
            href={'/user/login'}
            color={'white'}
          >
            Sign In
          </Button>
          <Button
            h={{ sm: 9, md: 10 }}
            px={{ sm: 3, md: 4 }}
            transition={'all .5s ease'}
            display={'inline-flex'}
            fontSize={{ sm: 'sm', md: huge ? 'md' : 'sm' }}
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

const ModalLogOut = ({ isOpen, onClose, setLocalStorageUser }: any) => {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent py={{ sm: 2, md: 4 }} bg={'black'} color={'white'}>
          <ModalHeader fontSize={{ sm: '1.5rem', md: '2rem' }}>
            Sure want to log out?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={{ sm: 'sm', md: 'md' }}>
              Some functionality will be limited after you log out.
            </Text>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup fontSize={{ sm: 'md', md: 'lg' }}>
              <Button
                color={'attention.light'}
                bg={'none'}
                _hover={{
                  color: 'orange',
                  bg: 'dark',
                  textDecoration: 'none',
                }}
                as={Link}
                href={`/`}
                onClick={() =>
                  setLocalStorageUser({ id: undefined, token: undefined })
                }
              >
                Log out
              </Button>
              <Button
                _hover={{
                  bg: 'attention.light',
                  textDecoration: 'none',
                }}
                bg={'attention.dark'}
                onClick={onClose}
              >
                Close
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
