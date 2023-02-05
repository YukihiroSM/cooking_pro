import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import * as Yup from 'yup';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tab,
  TabList,
  Tabs,
  VStack,
  Link,
  useToast,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { useUser } from '../hooks';
import { Loader } from './loader.component';

const registerSchema = Yup.object({
  username: Yup.string()
    .min(4, 'Username must contain at least 4 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter your password'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

const loginSchema = Yup.object({
  username: Yup.string()
    .min(4, 'Username must contain at least 4 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter your password'),
});

type Action = {
  type: string;
  schema: Yup.AnySchema;
  mutation: Function;
  index: number;
  initialValues: {
    username: string;
    password: string;
    confirmPassword?: string;
  };
};

export const UserFormComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const {
    loginUserMutation,
    registerUserMutation,
    isError,
    error,
    isLoading,
    isSuccess,
  } = useUser();
  const [action] = useState<Action>(
    location.pathname.includes('register')
      ? {
          type: 'register',
          schema: registerSchema,
          mutation: registerUserMutation,
          index: 1,
          initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
          },
        }
      : {
          type: 'login',
          schema: loginSchema,
          mutation: loginUserMutation,
          index: 0,
          initialValues: {
            username: '',
            password: '',
          },
        }
  );

  useEffect(() => {
    if (isSuccess) {
      toast({
        title:
          action.type === 'register'
            ? 'Account created!'
            : 'Logged in successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/');
    }
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
  }, [isError, isSuccess]);

  return (
    <>
      {isLoading && <Loader />}
      <Flex
        w={'full'}
        bg='light'
        align='center'
        justify='center'
        h={action.type === 'register' ? '72vh' : '60vh'}
      >
        <Box bg='white' p={6} rounded='md' w={'lg'} boxShadow={'md'}>
          <Tabs
            textStyle={'body2Semi'}
            defaultIndex={action.index}
            isFitted
            variant='enclosed'
          >
            <TabList mb='1em'>
              <Tab
                as={Link}
                href={'/user/login'}
                _selected={{
                  bg: 'gray.50',
                  color: 'attention.dark',
                  border: 0.5,
                  borderBottom: 0,
                  borderStyle: 'solid',
                  borderColor: 'gray.300',
                }}
                _hover={{
                  textDecoration: 'none',
                }}
                value='login'
              >
                Sign in
              </Tab>
              <Tab
                as={Link}
                href={'/user/register'}
                _selected={{
                  bg: 'gray.50',
                  color: 'attention.dark',
                  border: 0.5,
                  borderBottom: 0,
                  borderStyle: 'solid',
                  borderColor: 'gray.300',
                }}
                _hover={{
                  textDecoration: 'none',
                }}
                value='register'
              >
                Sign up
              </Tab>
            </TabList>
          </Tabs>
          <Formik
            validationSchema={action.schema}
            initialValues={action.initialValues}
            onSubmit={({ username, password }) => {
              action.mutation({ username, password });
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align='flex-start'>
                  <FormControl
                    isInvalid={!!errors.username && touched.username}
                  >
                    <FormLabel htmlFor='username'>Username</FormLabel>
                    <Field
                      as={Input}
                      id='username'
                      name='username'
                      type='text'
                      variant='filled'
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.password && touched.password}
                  >
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <Field
                      as={Input}
                      id='password'
                      name='password'
                      type='password'
                      variant='filled'
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  {action.type === 'register' && (
                    <FormControl
                      isInvalid={
                        !!errors.confirmPassword && touched.confirmPassword
                      }
                    >
                      <FormLabel htmlFor='confirmPassword'>
                        Confirm password
                      </FormLabel>
                      <Field
                        as={Input}
                        id='confirmPassword'
                        name='confirmPassword'
                        type='password'
                        variant='filled'
                      />
                      <FormErrorMessage>
                        {errors.confirmPassword}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                  <Button
                    isDisabled={isLoading}
                    type='submit'
                    bg={'attention.dark'}
                    color={'white'}
                    _hover={{
                      bg: 'attention.light',
                    }}
                    width='full'
                  >
                    {action.type === 'register' ? 'Sign up' : 'Sign in'}
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </Box>
      </Flex>
    </>
  );
};
