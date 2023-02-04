import {
  Box,
  chakra,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Link,
  Image,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

import { TEAM } from '../consts';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={'blackAlpha.100'}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={Link}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: 'blackAlpha.200',
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export const FooterComponent = () => {
  return (
    <Box bg={'gray.50'} color={'gray.700'}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Stack
              align={'center'}
              direction={'row'}
              textStyle={{ base: 'body1Semi', md: 'body1Semi' }}
            >
              <Text>Cooking Pro</Text>
              <SocialButton
                label={'GitHub'}
                href={'https://github.com/YukihiroSM/cooking_pro.git'}
              >
                <FaGithub />
              </SocialButton>
            </Stack>
            <Text fontSize={'sm'}>
              © 2023 Code & Coffee Team. All rights reserved
            </Text>
          </Stack>
          <Stack align={'flex-start'} rowGap={2}>
            <ListHeader>Our Team</ListHeader>
            {TEAM.map((member) => (
              <Stack
                align={'center'}
                direction={'row'}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={'gray.200'}
                paddingBottom={1}
                width={'20rem'}
                justify={'space-between'}
              >
                <Text>{member.name}</Text>
                <Stack direction={'row'} spacing={4}>
                  <SocialButton label={'LinkedIn'} href={member.linkedIn}>
                    <FaLinkedin />
                  </SocialButton>
                  <SocialButton label={'GitHub'} href={member.gitHub}>
                    <FaGithub />
                  </SocialButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Fu*k russia</ListHeader>
            <Image
              src='https://media.giphy.com/media/0SPa3c91z2l1giDIMH/giphy.gif'
              alt='Ukraine'
            />
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
