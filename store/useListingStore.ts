import { Region } from 'react-native-maps';
import { create } from 'zustand';

type Coordinate = {
  latitude: number;
  longitude: number;
};

type AddressData = {
  flat_or_house: string;
  country_region: string;
  city: string;
  district: string;
  landmark: string;
  pincode: string;
  state: string;
  streetAddress: string;
};

type ListingData = {
  tabNum: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  uploadedPictures: { id: string; url: string; type?: string }[];

  addressMarker: Coordinate | null;
  region: Region | null;

  // New address fields
  address: AddressData;

  // Setters
  setAddressMarker: (coord: Coordinate) => void;
  setRegion: (region: Region) => void;
  setField: (
    field: keyof Omit<
      ListingData,
      | 'setField'
      | 'resetListing'
      | 'addPictures'
      | 'setTabNum'
      | 'setAddress'
      | 'setAddressMarker'
      | 'setRegion'
    >,
    value: number
  ) => void;
  setAddress: (data: Partial<AddressData>) => void;

  // Other actions
  resetListing: () => void;
  addPictures: (data: any) => void;
  setTabNum: (e: number) => void;
};

export const useListingStore = create<ListingData>((set) => ({
  tabNum: 12,
  guests: 1,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  uploadedPictures: [],
  addressMarker: null,
  region: null,

  address: {
    flat_or_house: '',
    country_region: '',
    city: '',
    district: '',
    landmark: '',
    pincode: '',
    state: '',
    streetAddress: '',
  },

  setAddressMarker: (coord) => set({ addressMarker: coord }),
  setRegion: (region) => set({ region }),

  setTabNum: (e) => set({ tabNum: e }),
  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  setAddress: (data) =>
    set((state) => ({
      address: {
        ...state.address,
        ...data,
      },
    })),

  resetListing: () =>
    set({
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      address: {
        flat_or_house: '',
        country_region: '',
        city: '',
        district: '',
        landmark: '',
        pincode: '',
        state: '',
        streetAddress: '',
      },
    }),

  addPictures: (data) =>
    set((state) => ({
      uploadedPictures: [...data, ...state.uploadedPictures],
    })),
}));
