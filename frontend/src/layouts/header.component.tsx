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
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import { NavItem } from '../types';
import { useState } from 'react';

// TEST
const NAV_ITEMS: Array<NavItem> = [
  // {
  //   label: 'Recipes',
  //   children: [
  //     {
  //       label: 'Beef',
  //     },
  //     {
  //       label: 'Beef',
  //     },
  //     {
  //       label: 'Beef',
  //     },
  //     {
  //       label: 'Beef',
  //     },
  //     {
  //       label: 'Beef',
  //     },
  //     {
  //       label: 'Beef',
  //     },
  //     {
  //       label: 'Beef',
  //     },
  //   ],
  // },
  // {
  //   label: 'Ingredients',
  //   children: [
  //     {
  //       label: 'Chicken',
  //       children: [
  //         {
  //           label: 'Chicken',
  //         },
  //         {
  //           label: 'Freelance Projects',
  //         },
  //         {
  //           label: 'Chicken',
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Freelance Projects',
  //       children: [
  //         {
  //           label: 'Chicken',
  //         },
  //         {
  //           label: 'Freelance Projects',
  //         },
  //         {
  //           label: 'Chicken',
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Chicken',
  //     },
  //     {
  //       label: 'Freelance Projects',
  //     },
  //     {
  //       label: 'Chicken',
  //     },
  //     {
  //       label: 'Freelance Projects',
  //     },
  //     {
  //       label: 'Chicken',
  //     },
  //     {
  //       label: 'Freelance Projects',
  //     },
  //   ],
  // },
];

export const HeaderComponent = () => {
  // fetch nav items
  const [navItems] = useState<NavItem[]>(NAV_ITEMS);

  return (
    <Box>
      <Flex
        bg={'dark'}
        color={'white'}
        textStyle={{ base: 'display2', md: 'display1' }}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={'gray.200'}
        minH={'80px'}
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
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'/user/login'}
            color={'white'}
          >
            Sign In
          </Button>
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
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
      </Flex>
      <Flex
        display={'flex'}
        justify={{ base: 'space-between', md: 'start' }}
        py={{ base: 2 }}
        px={{ base: 10 }}
        bg={'dark'}
        color={'white'}
        minH={'60px'}
        align={'center'}
      >
        <DesktopNav navItems={navItems} />
      </Flex>
    </Box>
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
                  fontSize={'sm'}
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
                  border={0}
                  boxShadow={'xl'}
                  bg={'black'}
                  p={4}
                  rounded={'xl'}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
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

const DesktopSubNav = ({ label, children }: NavItem) => {
  return (
    <Popover trigger={'hover'} placement={'right-start'}>
      <PopoverTrigger>
        <Link
          role={'group'}
          display={'block'}
          p={2}
          rounded={'md'}
          _hover={{ bg: 'dark' }}
        >
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text
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
          // eslint-disable-next-line react-hooks/rules-of-hooks
          borderColor={'attention.light'}
          boxShadow={'xl'}
          bg={'black'}
          p={4}
          rounded={'xl'}
        >
          <Stack>
            {children.map((child) => (
              <DesktopSubSubNav key={child.label} {...child} />
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  );
};

const DesktopSubSubNav = ({ label }: NavItem) => {
  return (
    <Link
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: 'dark' }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'attention.dark' }}
            fontWeight={500}
          >
            {label}
          </Text>
        </Box>
      </Stack>
    </Link>
  );
};
