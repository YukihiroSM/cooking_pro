import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import * as Yup from 'yup';

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';

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
  initialValues: {
    username: string;
    password: string;
    confirmPassword?: string;
  };
};

export const UserFormPageComponent = () => {
  const location = useLocation();
  const [action] = useState<Action>(
    location.pathname.includes('register')
      ? {
          type: 'register',
          schema: registerSchema,
          initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
          },
        }
      : {
          type: 'login',
          schema: loginSchema,
          initialValues: {
            username: '',
            password: '',
          },
        }
  );

  return (
    <Flex bg='light' align='center' justify='center' h='75vh'>
      <Box bg='white' p={6} rounded='md' w={'lg'}>
        <Formik
          validationSchema={action.schema}
          initialValues={action.initialValues}
          onSubmit={(values) => {
            console.log(JSON.stringify(values, null, 2));
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align='flex-start'>
                <FormControl isInvalid={!!errors.username && touched.username}>
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
                <FormControl isInvalid={!!errors.password && touched.password}>
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
                <Field
                  as={Checkbox}
                  id='rememberMe'
                  name='rememberMe'
                  colorScheme='orange'
                >
                  Remember me?
                </Field>
                <Button type='submit' colorScheme='orange' width='full'>
                  {action.type === 'register' ? 'Sign up' : 'Sign in'}
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};
