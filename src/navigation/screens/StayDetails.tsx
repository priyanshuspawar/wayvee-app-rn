import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  BedDouble,
  Heart,
  MapPin,
  Star,
  Users,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavProp } from '../types';

import {
  addToWishlist,
  createBooking,
  getValueFromSecureStore,
} from '~/apis/auth';
import AmenityIcon from '~/components/AmenitiesIcon';
import useUser from '~/store/useUser';
import AmenityIconMap, { AmenityIcons } from '~/utils/amenityIcon';
import { vh } from '~/utils/dimensions';
import { Stay } from '~/utils/responseTypes';

const { width, height } = Dimensions.get('window');

interface StayParam extends Stay {
  wishlisted: boolean;
}
const StayDetailsScreen = ({
  route,
}: {
  route: { params: { stay: StayParam } };
}) => {
  const { stay } = route.params;

  const navigation = useNavigation<NavProp>();
  const queryClient = useQueryClient();
  const { top } = useSafeAreaInsets();
  const { loggedUser } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ['stay', stay.id],
    queryFn: async () => {
      const token = await getValueFromSecureStore('token');
      const res = await axios.get<{ data: StayParam }>(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/stays/${stay.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    },
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(stay.wishlisted); // Use fallback, not `data`

  const { mutateAsync } = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const { mutateAsync: bookStay } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const isNew = dayjs(data?.createdAt).isAfter(dayjs().subtract(1, 'month'));
  const formattedAddress = `${data.address?.streetAddress ?? ''}, ${data.address?.city ?? ''}, ${data.address?.state ?? ''} ${data.address?.pincode ?? ''}`;

  const normalizedAmenities = Array.from(
    new Set(
      data?.amenities
        .map(
          (a) =>
            a
              .replace(/\s+/g, '') // Remove spaces
              .replace(/[^a-zA-Z]/g, '') // Remove symbols
        )
        .filter((name) => name in AmenityIconMap)
    )
  ) as AmenityIcons[];

  const visibleAmenities = showAllAmenities
    ? normalizedAmenities
    : normalizedAmenities.slice(0, 5);
  const renderHeader = () => (
    <View
      style={{ paddingTop: top }}
      className="absolute z-10 w-full flex-row justify-between px-4">
      <Pressable
        onPress={() => navigation.goBack()}
        className="h-10 w-10 items-center justify-center rounded-full bg-white/90">
        <ArrowLeft color="#262626" size={24} />
      </Pressable>
      <View className="flex-row gap-2">
        {/* <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/90">
          <Share color="#262626" size={24} />
        </Pressable> */}
        <Pressable
          onPress={async () => {
            setIsWishlisted(true);
            await mutateAsync({ userId: loggedUser?.id!, stayId: data?.id! });
          }}
          className="h-10 w-10 items-center justify-center rounded-full bg-white/90">
          <Heart
            color={isWishlisted ? '#f52e2e' : '#262626'}
            fill={isWishlisted ? '#f52e2e' : undefined}
            size={24}
          />
        </Pressable>
      </View>
    </View>
  );

  const renderImageCarousel = () => (
    <View className="relative">
      <Carousel
        width={width}
        height={height * 0.35}
        loop
        autoPlay={false}
        data={data.displayImages}
        onSnapToItem={setCurrentImageIndex}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        )}
      />
      <View className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-1">
        <Text className="font-urbanist text-white">
          {currentImageIndex + 1}/{data.displayImages.length}
        </Text>
      </View>
    </View>
  );

  const renderPropertyHeader = () => (
    <View className="px-6 pt-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-urbanistBold text-2xl text-gray-900">
          {data.title}
        </Text>
        <View className="flex-row items-center">
          <Star fill="#000" size={16} />
          <Text className="ml-1 font-urbanist">
            {data.rating} · {isNew ? 'New listing' : 'Verified'}
          </Text>
        </View>
      </View>
      <View className="mt-2 flex-row items-center">
        <MapPin size={16} color="#666" />
        <Text className="ml-1 font-urbanist text-gray-600">
          {formattedAddress}
        </Text>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View className="mx-6 my-4">
      <Text className="mb-2 font-urbanistBold text-xl">About this place</Text>
      <Text className="font-urbanist text-gray-700">{data.description}</Text>
      <View className="mt-3 flex-row flex-wrap gap-2">
        {data.perks.map((perk, index) => (
          <View key={index} className="rounded-full bg-gray-100 px-3 py-1">
            <Text className="font-urbanist text-gray-700">{perk}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSleepingArrangements = () => (
    <View className="mx-6 my-4">
      <Text className="mb-3 font-urbanistBold text-xl">
        Sleeping arrangements
      </Text>
      <View className="flex-row gap-4">
        <View className="w-40 rounded-xl border border-gray-200 p-4">
          <BedDouble size={24} color="#333" />
          <Text className="mt-2 font-urbanistBold">Bedrooms</Text>
          <Text className="mt-1 font-urbanist text-gray-600">
            {data.bedrooms}
          </Text>
        </View>
        <View className="w-40 rounded-xl border border-gray-200 p-4">
          <Users size={24} color="#333" />
          <Text className="mt-2 font-urbanistBold">Guests</Text>
          <Text className="mt-1 font-urbanist text-gray-600">
            Up to {data.maxOccupancy}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAmenities = () => (
    <View className="mx-6 my-4">
      <Text className="mb-3 font-urbanistBold text-xl">
        What this place offers
      </Text>
      <View className="flex-row flex-wrap">
        {visibleAmenities.map((amenity, index) => (
          <View key={index} className="mb-3 w-1/2 flex-row items-center">
            <AmenityIcon name={amenity} size={20} color="#333" />
            <Text className="ml-2 font-urbanist">
              {amenity.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
          </View>
        ))}
      </View>
      {normalizedAmenities.length > 5 && (
        <Pressable
          onPress={() => setShowAllAmenities((prev) => !prev)}
          className="mt-3 items-center rounded-lg border border-gray-200 py-3">
          <Text className="font-urbanistBold">
            {showAllAmenities
              ? 'Show less'
              : `Show all ${normalizedAmenities.length} amenities`}
          </Text>
        </Pressable>
      )}
    </View>
  );

  const renderBottomCTA = () => (
    <View className="h-28 w-full flex-row items-center justify-between border-t border-gray-200 bg-white px-6">
      <View>
        <Text className="font-urbanistBold text-xl text-gray-900">
          ₹{parseFloat(data?.pricePerNight!).toFixed(0)}
        </Text>
        <Text className="font-urbanist text-gray-600">per night</Text>
      </View>
      <Pressable
        onPress={async () => {
          await bookStay({
            stayId: data.id,
            userId: loggedUser?.id!,
            guests: data.maxOccupancy ?? 5,
            totalPrice: Number(data.pricePerNight!),
          });
          navigation.navigate('Bookings');
        }}
        className="h-14 w-40 items-center justify-center rounded-[2rem] bg-primary-normal">
        <Text className="font-urbanistBold text-lg text-white">Reserve</Text>
      </Pressable>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}
        {renderPropertyHeader()}
        {renderDescription()}
        {renderSleepingArrangements()}
        {renderAmenities()}
        <View className="flex-1 px-4">
          <MapView
            style={{
              width: '100%',
              height: vh(200),
              borderRadius: 20,
            }}
            region={{
              latitude: data.location?.y!,
              longitude: data.location?.x!,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            {data.location && (
              <Marker
                coordinate={{
                  latitude: data.location.y,
                  longitude: data.location.x,
                }}
              />
            )}
          </MapView>
        </View>
      </ScrollView>
      {renderBottomCTA()}
    </View>
  );
};

export default StayDetailsScreen;
