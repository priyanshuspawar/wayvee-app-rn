import HomeIcon from '@Assets/stepone-3-home.svg';
import SharedRoomIcon from '@Assets/stepone-3-shared.svg';
import RoomIcon from '@Assets/stepone-3-single.svg';
import React from 'react';
import { SvgProps } from 'react-native-svg';

import { AmenityIcons } from './amenityIcon';
import { PlaceIcons } from './placeIcon';

export const dataStays = [
  {
    id: 'cd00a274-45bc-42cf-9dff-626d84f59624',
    perks: ['Parkfree', 'Beautiful Views', 'Luxurias Space'],
    title: 'La vista Villa',
    rating: '0.00',
    pricePerNight: '4500.00',
    baseGuest: 6,
    displayImages: [
      'https://a0.muscache.com/im/pictures/9533b6e3-a37e-4346-98d8-baeb58fc7718.jpg?im_w=1200',
      'https://a0.muscache.com/im/ml/photo_enhancement/pictures/f0ea4cba-c771-41b6-92c5-caa646edb513.jpg?im_w=720',
      'https://a0.muscache.com/im/ml/photo_enhancement/pictures/miso/Hosting-23780166/original/484e7ed5-2e36-4f29-baa7-1c06c47f94c7.jpeg?im_w=720',
      'https://a0.muscache.com/im/ml/photo_enhancement/pictures/f0ea4cba-c771-41b6-92c5-caa646edb513.jpg?im_w=720',
    ],
    discount: '10.00',
    location: {
      x: 77.03006,
      y: 28.610226,
    },
  },
];

export const amenityKeys: AmenityIcons[] = [
  'AirCondition',
  'BbqGrill',
  'BeachArea',
  'FireExtinguisher',
  'FirePlace',
  'FirstAidKit',
  'Gym',
  'HotTub',
  'Kitchen',
  'LakeArea',
  'OutdoorDining',
  'PaidParking',
  'Parking',
  'Patio',
  'Piano',
  'PoolTable',
  'Pool',
  'Shower',
  'Ski',
  'SmokeAlarm',
  'TV',
  'WashingMachine',
  'Wifi',
  'Workspace',
];
export const DEFAULT_USER_URI =
  'https://static.vecteezy.com/system/resources/previews/001/840/618/large_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg';
export const amenities = [
  { id: 'AirCondition', title: 'Air Condition' },
  { id: 'BbqGrill', title: 'BBQ Grill' },
  { id: 'BeachArea', title: 'Beach Area' },
  { id: 'FireExtinguisher', title: 'Fire Extinguisher' },
  { id: 'FirePlace', title: 'Fireplace' },
  { id: 'FirstAidKit', title: 'First Aid Kit' },
  { id: 'Gym', title: 'Gym' },
  { id: 'HotTub', title: 'Hot Tub' },
  { id: 'Kitchen', title: 'Kitchen' },
  { id: 'LakeArea', title: 'Lake Area' },
  { id: 'OutdoorDining', title: 'Outdoor Dining' },
  { id: 'PaidParking', title: 'Paid Parking' },
  { id: 'Parking', title: 'Parking' },
  { id: 'Patio', title: 'Patio' },
  { id: 'Piano', title: 'Piano' },
  { id: 'PoolTable', title: 'Pool Table' },
  { id: 'Pool', title: 'Pool' },
  { id: 'Shower', title: 'Shower' },
  { id: 'Ski', title: 'Ski' },
  { id: 'SmokeAlarm', title: 'Smoke Alarm' },
  { id: 'TV', title: 'TV' },
  { id: 'WashingMachine', title: 'Washing Machine' },
  { id: 'Wifi', title: 'Wi-Fi' },
  { id: 'Workspace', title: 'Workspace' },
];

export const PLACE_TYPES: {
  id: PlaceIcons;
  title: string;
}[] = [
  { id: 'Apartment', title: 'Apartment' },
  { id: 'Barn', title: 'Barn' },
  { id: 'BedBreakfast', title: 'Bed & Breakfast' },
  { id: 'Cabin', title: 'Cabin' },
  { id: 'Campervan', title: 'Campervan' },
  { id: 'CasaParticular', title: 'Casa Particular' },
  { id: 'Castle', title: 'Castle' },
  { id: 'Cave', title: 'Cave' },
  { id: 'Container', title: 'Shipping Container' },
  { id: 'CycladicHome', title: 'Cycladic Home' },
  { id: 'Dammuso', title: 'Dammuso' },
  { id: 'Dome', title: 'Dome House' },
  { id: 'Farm', title: 'Farm' },
  { id: 'GuestHouse', title: 'Guest House' },
  { id: 'Hotel', title: 'Hotel' },
  { id: 'House', title: 'House' },
  { id: 'Houseboat', title: 'Houseboat' },
  { id: 'Kezhan', title: 'Kezhan' },
  { id: 'Minsu', title: 'Minsu' },
  { id: 'Raid', title: 'Riad' },
  { id: 'Ryokan', title: 'Ryokan' },
  { id: 'ShepherdsHut', title: "Shepherd's Hut" },
  { id: 'Tent', title: 'Tent' },
  { id: 'TinyHome', title: 'Tiny Home' },
  { id: 'Tower', title: 'Tower' },
  { id: 'TreeHouse', title: 'Tree House' },
  { id: 'Trullo', title: 'Trullo' },
  { id: 'Windmill', title: 'Windmill' },
  { id: 'Yurt', title: 'Yurt' },
];

export const PROPERTY_TYPES: {
  id: string;
  title: string;
  sub: string;
  icon: React.FC<SvgProps>;
}[] = [
  {
    id: 'entire_place',
    title: 'An entire place',
    sub: 'Guests have the whole place to themselves.',
    icon: HomeIcon, // Use the icon key that matches your `PlaceIcon` component
  },
  {
    id: 'room',
    title: 'A room',
    sub: 'Guests have their own room in a home, plus access to shared spaces.',
    icon: RoomIcon, // Adjust to match your icon library
  },
  {
    id: 'shared_room',
    title: 'A shared room in a hostel',
    sub: 'Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.',
    icon: SharedRoomIcon, // Replace with appropriate key from your icons
  },
];

export const countries_regions = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'RU', name: 'Russia' },
  { code: 'KR', name: 'South Korea' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SG', name: 'Singapore' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'PL', name: 'Poland' },
  { code: 'TR', name: 'Turkey' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'EG', name: 'Egypt' },
];
