import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Notification } from '../types';
import { getErrorMessage } from '../utils';

type Props = {
  notification: Notification | undefined;
};

export const NotificationComponent = ({ notification }: Props) => {
  const toast = useToast();
  const [statusDefault] = useState<any>({
    info: {
      title: 'Nothing found',
      description:
        'Chosen preferences do not match any of the existing recipes.',
    },
    error: {
      title: 'Something went wrong...',
      description: getErrorMessage(notification?.error),
    },
    success: {
      title: notification?.success,
      description: undefined,
    },
  });

  useEffect(() => {
    if (notification) {
      toast({
        title: statusDefault[notification.status as string].title,
        description: statusDefault[notification.status as string].description,
        status: notification.status,
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [notification]);
  return <></>;
};
