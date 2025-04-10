import { createContext } from 'react';
import { createStore } from 'zustand';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
  phoneNumber: string;
  picture: string;
  countryCode: string;
  governmentId: string | null;
  isAgent: boolean;
  isMember: boolean;
  dateOfBirth: string; // ISO date string, or consider using `Date` if parsed
  createdAt: string; // same as above
  updatedAt: string;
}

type AuthState = {
  user: User | null;
  registeringUserMail: string | null;
};
interface AuthActions {
  logUser: (user: User) => void;
  registerUser: (email: string) => void;
  removeUser: () => void;
}

export type AuthProps = AuthState & AuthActions;
type InitProps = Partial<AuthState>;

type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = (initProps?: InitProps) => {
  const DEFAULT_STATE: AuthState = {
    user: null,
    registeringUserMail: null,
  };

  return createStore<AuthProps>()((set) => ({
    ...DEFAULT_STATE,
    ...initProps,
    logUser: (user: User) => set(() => ({ user })),
    registerUser: (email: string) =>
      set(() => ({ registeringUserMail: email })),
    removeUser: () => set(() => ({ user: null })),
  }));
};

export const AuthContext = createContext<AuthStore | null>(null);
