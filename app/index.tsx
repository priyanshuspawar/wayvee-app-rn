import { Redirect } from 'expo-router';
import React from 'react';
import { useStore } from 'zustand';

import { AuthContext } from '~/store/auth';

export default function Index() {
  const store = React.useContext(AuthContext);
  const user = useStore(store!, (s) => s.user);
  if (!store) {
    return <Redirect href="/(auth)/login" />;
  }
  if (user?.id) {
    return <Redirect href="/(root)" />;
  }

  return <Redirect href="/(auth)/register" />;
}
