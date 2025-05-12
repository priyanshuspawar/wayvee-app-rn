import { Region } from 'react-native-maps';
import { create } from 'zustand';

// import type { Stay } from '~/utils/responseTypes';
interface Stay {
  id: string;
  isPublished: boolean;
  hostId: string;
  title?: string;
  location?: {
    x: number;
    y: number;
  };
  displayImages: {
    id: string;
    imageUrl: string;
    type: string;
  }[];
  perks: string[];
  description?: string;
  baseGuest: number;
  bedrooms?: number;
  bathrooms?: number;
  currentTab: number;
  pricePerNight?: string; // decimal returns as string
  perPersonIncrement?: string; // decimal returns as string
  maxOccupancy?: number;
  amenities: string[];
  availability?: boolean;
  typeOfStay?: string; // char returns as string
  propertyAccess?: string; // char returns as string
  rating: string; // decimal returns as string
  discount: string; // decimal returns as string
  address?: {
    name: string;
    streetAddress: string;
    nearby_landmark: string;
    district: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

type Coordinate = {
  latitude: number;
  longitude: number;
};

type ListingStore = {
  stay: Stay;
  addressMarker: Coordinate | null;
  region: Region | null;
  images: { id: string; imageUrl: string; type: string }[];
  enableFullMode: boolean;

  // Individual property setters
  setId: (id: string) => void;
  setIsPublished: (published: boolean) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setLocation: (coordinates: { long: number; lat: number }) => void;
  setDisplayImages: (
    images: { id: string; imageUrl: string; type: string }[]
  ) => void;
  setPerks: (perks: string[]) => void;
  setBaseGuest: (count: number) => void;
  setBedrooms: (count: number) => void;
  setBathrooms: (count: number) => void;
  setTabNum: (tab: number) => void;
  setPricePerNight: (price: string) => void;
  setPerPersonIncrement: (increment: string) => void;
  setMaxOccupancy: (count: number) => void;
  setAmenities: (amenities: string[]) => void;
  setAvailability: (available: boolean) => void;
  setTypeOfStay: (type: string) => void;
  setPropertyAccess: (access: string) => void;
  setDiscount: (discount: string) => void;
  setAddress: (address: {
    name: string;
    streetAddress: string;
    nearby_landmark: string;
    district: string;
    city: string;
    state: string;
    pincode: string;
  }) => void;

  // Bulk setter
  setAll: (stayData: Partial<Stay>) => void;

  // Location setters
  setAddressMarker: (coord: Coordinate) => void;
  setRegion: (region: Region) => void;

  // Utility functions
  addImages: (images: { id: string; imageUrl: string; type: string }[]) => void;
  removeImage: (id: string) => void;
  reset: () => void;
  setEnableFullMode: (val: boolean) => void;
};

export const useListingStore = create<ListingStore>((set) => ({
  stay: {
    isPublished: false,
    hostId: '', // You'll need to set this from your auth system
    rating: '0',
    currentTab: 0,
    displayImages: [],
    perks: [],
    baseGuest: 1,
    id: '',
    amenities: [],
    discount: '0.00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  addressMarker: null,
  region: null,
  images: [],
  enableFullMode: false,

  // Property setters
  setId: (id) => set((state) => ({ stay: { ...state.stay, id } })),
  setIsPublished: (isPublished) =>
    set((state) => ({ stay: { ...state.stay, isPublished } })),
  setTitle: (title) => set((state) => ({ stay: { ...state.stay, title } })),
  setDescription: (description) =>
    set((state) => ({ stay: { ...state.stay, description } })),
  setLocation: (coordinates) =>
    set((state) => ({
      stay: {
        ...state.stay,
        location: { x: coordinates.long, y: coordinates.lat },
      },
    })),
  setDisplayImages: (displayImages) =>
    set((state) => ({
      stay: { ...state.stay, displayImages: [...displayImages] },
    })),
  setPerks: (perks) => set((state) => ({ stay: { ...state.stay, perks } })),
  setBaseGuest: (baseGuest) =>
    set((state) => ({ stay: { ...state.stay, baseGuest } })),
  setBedrooms: (bedrooms) =>
    set((state) => ({ stay: { ...state.stay, bedrooms } })),
  setBathrooms: (bathrooms) =>
    set((state) => ({ stay: { ...state.stay, bathrooms } })),
  setTabNum: (currentTab) =>
    set((state) => ({ stay: { ...state.stay, currentTab } })),
  setPricePerNight: (pricePerNight) =>
    set((state) => ({ stay: { ...state.stay, pricePerNight } })),
  setPerPersonIncrement: (perPersonIncrement) =>
    set((state) => ({ stay: { ...state.stay, perPersonIncrement } })),
  setMaxOccupancy: (maxOccupancy) =>
    set((state) => ({ stay: { ...state.stay, maxOccupancy } })),
  setAmenities: (amenities) =>
    set((state) => ({ stay: { ...state.stay, amenities } })),
  setAvailability: (availability) =>
    set((state) => ({ stay: { ...state.stay, availability } })),
  setTypeOfStay: (typeOfStay) =>
    set((state) => ({ stay: { ...state.stay, typeOfStay } })),
  setPropertyAccess: (propertyAccess) =>
    set((state) => ({ stay: { ...state.stay, propertyAccess } })),
  setDiscount: (discount) =>
    set((state) => ({ stay: { ...state.stay, discount } })),
  setAddress: (address) =>
    set((state) => ({ stay: { ...state.stay, address } })),

  // Bulk setter
  setAll: (stayData) =>
    set((state) => ({
      stay: {
        ...state.stay,
        ...stayData,
        // Ensure these required fields are always set
        isPublished: stayData.isPublished ?? state.stay.isPublished,
        rating: stayData.rating ?? state.stay.rating,
        createdAt: stayData.createdAt ?? state.stay.createdAt,
        updatedAt: new Date(), // Always update the updatedAt when using setAll
      },
    })),

  // Location setters
  setAddressMarker: (addressMarker) =>
    set((state) => ({
      ...state,
      addressMarker,
      stay: {
        ...state.stay,
        location: { x: addressMarker.longitude, y: addressMarker.latitude },
      },
    })),
  setRegion: (region) => set({ region }),

  // Image management
  addImages: (images) =>
    set((state) => ({ ...state, images: [...state.images, ...images] })),
  removeImage: (id) =>
    set((state) => ({
      stay: {
        ...state.stay,
        displayImages: (state.stay.displayImages || []).filter(
          (img) => img.id !== id
        ),
      },
    })),
  setEnableFullMode: (val) => set({ enableFullMode: val }),
  // Reset function
  reset: () =>
    set({
      stay: {
        isPublished: false,
        hostId: '', // You'll need to set this from your auth system
        rating: '0',
        currentTab: 0,
        displayImages: [],
        perks: [],
        baseGuest: 1,
        id: '',
        amenities: [],
        discount: '0.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      addressMarker: null,
      region: null,
    }),
}));
