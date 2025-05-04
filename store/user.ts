import { create } from 'zustand';

type UserStore = {
  user_location: {
    x: number;
    y: number;
  } | null;
  user_region_code: string | null;
  setUserLocation: (location: { x: number; y: number }) => void;
  setUserRegionCode: (code: string | null) => void;
};

const userStore = create<UserStore>((set) => ({
  user_location: null,
  user_region_code: null,
  setUserLocation: (location) => {
    set(() => ({ user_location: location }));
  },
  setUserRegionCode: (code) => {
    set(() => ({ user_region_code: code }));
  },
}));

export default userStore;
