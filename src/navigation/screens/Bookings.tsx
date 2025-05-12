import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, MapPin, Users, Star } from 'lucide-react-native';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getValueFromSecureStore } from '~/apis/auth';

type Booking = {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  stay: {
    id: string;
    title: string;
    pricePerNight: string;
    displayImages?: { imageUrl: string }[];
    address?: {
      city: string;
    };
  };
};

const getBookings = async (): Promise<Booking[]> => {
  try {
    const token = await getValueFromSecureStore('token');
    if (!token) throw new Error('No token present');

    const res = await axios.get<{ data: Booking[] }>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/bookings`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

const Bookings = () => {
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      default:
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-muted-2">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-muted-2">
        <Text className="font-UrbanistMedium text-red-500">
          Failed to load bookings
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-muted-2 px-4 pt-8">
      <Text className="mb-6 font-UrbanistSemiBold text-3xl">Your Bookings</Text>

      {bookings?.length ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {bookings.map((booking) => {
            const statusStyles = getStatusStyles(booking.status);
            const imageUrl = booking.stay.displayImages?.[0]?.imageUrl;
            const city = booking.stay.address?.city || 'Unknown location';

            return (
              <Pressable
                key={booking.id}
                className="mb-4 rounded-xl bg-white p-4 shadow-sm"
                onPress={() =>
                  console.log('Navigate to booking details', booking.id)
                }>
                <View className="flex-row">
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      className="h-24 w-24 rounded-lg"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-24 w-24 items-center justify-center rounded-lg bg-gray-200">
                      <Text className="font-Urbanist text-gray-500">
                        No image
                      </Text>
                    </View>
                  )}

                  <View className="ml-4 flex-1">
                    <Text className="mb-1 font-UrbanistSemiBold text-lg">
                      {booking.stay.title}
                    </Text>
                    <View className="mb-1 flex-row items-center">
                      <MapPin size={14} color="#666" />
                      <Text className="font-Urbanist ml-1 text-gray-600">
                        {city}
                      </Text>
                    </View>
                    <View className="mb-1 flex-row items-center">
                      <Calendar size={14} color="#666" />
                      <Text className="font-Urbanist ml-1">
                        {formatDate(booking.checkInDate)} -{' '}
                        {formatDate(booking.checkOutDate)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Users size={14} color="#666" />
                      <Text className="font-Urbanist ml-1">
                        {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="font-UrbanistSemiBold text-lg">
                      ₹{booking.totalPrice}
                    </Text>
                    <Text className="text-xs text-gray-500">total</Text>
                    <View
                      className={`mt-2 rounded-full px-2 py-1 ${statusStyles.bg}`}>
                      <Text
                        className={`font-UrbanistMedium text-xs ${statusStyles.text}`}>
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="font-UrbanistMedium text-lg text-gray-500">
            You don't have any bookings yet
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Bookings;
