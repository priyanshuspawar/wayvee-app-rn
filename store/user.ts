import { create } from 'zustand';

type UserStore = {
  user_location: {
    x: number;
    y: number;
  } | null;
  token: string | null;
  user_region_code: string | null;
  setToken: (token: string) => void;
  setUserLocation: (location: { x: number; y: number }) => void;
  setUserRegionCode: (code: string | null) => void;
};

const userStore = create<UserStore>((set) => ({
  user_location: null,
  user_region_code: null,
  token: null,
  setUserLocation: (location) => {
    set(() => ({ user_location: location }));
  },
  setToken: (token) => set({ token }),
  setUserRegionCode: (code) => {
    set(() => ({ user_region_code: code }));
  },
}));

export default userStore;
