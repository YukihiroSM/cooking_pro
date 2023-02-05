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
            mr={20}
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            display={{ base: 'none', md: 'flex' }}
          >
            <User huge={huge} />
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
            <DesktopNav huge={huge} isLoading={isLoading} navItems={navItems} />
          )}
        </Flex>
      </Box>
    </>
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

type UserProps = {
  huge: boolean;
};

const User = ({ huge }: UserProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ id, token }, setLocalStorageUser] =
    useLocalStorage<LocalStorageUser>('cooking-app-user', {
      id: 'undefined',
      token: 'TEST TOKEN STRING', // replace this
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
                transition={'.5s ease all'}
                size={huge ? 'md' : 'sm'}
                src={'https://i.pravatar.cc/300'}
              />
            </MenuButton>
            <MenuList
              borderColor={'attention.light'}
              bg={'black'}
              fontSize={huge ? 'lg' : 'md'}
              lineHeight={2}
              color={'white'}
            >
              <MenuItem
                as={Link}
                href={`/user/${id}/ingredients`}
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
                href={`/user/${id}/possible-meals`}
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
            as={'a'}
            transition={'.5s ease all'}
            fontSize={huge ? 'md' : 'sm'}
            fontWeight={400}
            variant={'link'}
            href={'/user/login'}
            color={'white'}
          >
            Sign In
          </Button>
          <Button
            transition={'.5s ease all'}
            display={'inline-flex'}
            fontSize={huge ? 'md' : 'sm'}
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
        <ModalContent bg={'black'} color={'white'}>
          <ModalHeader fontSize={'2rem'}>Sure want to log out?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={'1rem'}>
              Some functionality will be limited after you log out.
            </Text>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup fontSize={'lg'}>
              <Button
                color={'attention.light'}
                bg={'none'}
                _hover={{
                  color: 'orange',
                  bg: 'dark',
                  textDecoration: 'none',
                }}
                as={Link}
                href={`/user/login`}
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
