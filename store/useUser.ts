import React from 'react';
import { useStore } from 'zustand';

import { AuthContext } from './auth';

export default function useUser() {
  const store = React.useContext(AuthContext);
  const loggedUser = useStore(store!, (s) => s.user);
  return { loggedUser };
}
