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
import { useEffect, useState } from 'react';
import { throttle } from '../utils';

// TEST
const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Recipes',
    children: [
      {
        label: 'Beef',
      },
    ],
  },
  {
    label: 'Ingredients',
    children: [
      {
        label: 'Chicken',
        children: [
          {
            label: 'Chicken',
          },
          {
            label: 'Freelance Projects',
          },
        ],
      },
      {
        label: 'Freelance Projects',
        children: [
          {
            label: 'Chicken',
          },
        ],
      },
    ],
  },
];

export const HeaderComponent = () => {
  // fetch nav items
  const [navItems] = useState<NavItem[]>(NAV_ITEMS);

  const [scrollTop, setScrollTop] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener('scroll', throttle(handleScroll, 250));

    return () => {
      window.removeEventListener('scroll', throttle(handleScroll, 100));
    };
  }, []);

  return (
    <Box as='header' position='fixed' w='100%' zIndex={5}>
      <Flex
        bg={'dark'}
        color={'white'}
        transition={'font-size 0.5s'}
        textStyle={{
          base: 'display2',
          md: scrollTop > 0 ? 'body1Semi' : 'display1',
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
            fontSize={'sm'}
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
