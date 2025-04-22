import { create } from 'zustand';

type UserStore = {
  user_location: {
    x: number;
    y: number;
  } | null;
  setUserLocation: (location: { x: number; y: number }) => void;
};

const userStore = create<UserStore>((set) => ({
  user_location: null,
  setUserLocation: (location: { x: number; y: number }) => {
    set(() => ({ user_location: location }));
  },
}));

export default userStore;
