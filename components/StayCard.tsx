import { Link } from 'expo-router';
import { getDistance } from 'geolib';
import { Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';

import userStore from '~/store/user';

interface StayCardProps {
  image: string;
  title: string;
  perks: string[];
  price: string;
  rating: string;
  baseGuest: number;
  onPress?: () => void; // optional navigation support
}
export default function StayCard({
  image,
  title,
  perks,
  price,
  rating,
  baseGuest,
  onPress,
}: StayCardProps) {
  const { user_location } = userStore();
  const [kmdistance, setDistance] = useState<string | null>(null);
  useEffect(() => {
    if (user_location) {
      const distance = getDistance(
        { latitude: user_location.y, longitude: user_location.x },
        { latitude: 28.600618, longitude: 77.018864 } // y = lat, x = lon
      );
      setDistance((distance / 1000).toFixed(1));
    }
  }, []);
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-4 mb-8 flex rounded-3xl bg-neutral-n20 shadow-lg shadow-muted-7/40">
      <Image className="h-64 w-full rounded-t-3xl" source={{ uri: image }} />
      <View className="flex w-full flex-row items-start justify-between p-3">
        <View>
          <Text className="text-mu font-UrbanistSemiBold text-lg capitalize">
            {title}
          </Text>
          <Text className="font-urbanistMedium text-muted-8">
            {baseGuest} Guests • {perks.join(', ')}
          </Text>
          <View className="flex flex-row">
            <Text className="font-urbanistBold underline">INR {price} </Text>
            <Text className="font-UrbanistMedium text-muted-8">/ night</Text>
          </View>
        </View>
        <View className="items-end">
          <View className="flex flex-row items-center gap-1">
            <Star width={10} color="#000" fill="#000" />
            <Text className="font-urbanist text-muted-10">
              {parseFloat(rating).toFixed(2)}
            </Text>
          </View>
          <Text className="font-urbanist text-muted-8">
            {kmdistance}km away
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
