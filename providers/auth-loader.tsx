import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useStore } from 'zustand';

import { getUser } from '~/apis/auth';
import { Container } from '~/components/Container';
import { AuthContext } from '~/store/auth';
const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const store = React.useContext(AuthContext);
  if (!store) throw new Error('Missing BearContext.Provider in the tree');
  const logUser = useStore(store, (s) => s.logUser);
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  if (isLoading) {
    return (
      <Container className="h-screen w-screen flex-col items-center justify-center">
        <ActivityIndicator size="large" />
      </Container>
    );
  }
  if (data?.data.data) {
    logUser(data?.data.data);
  }
  return <>{children}</>;
};

export default AuthLoader;
