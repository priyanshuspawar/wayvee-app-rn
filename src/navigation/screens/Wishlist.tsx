import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react-native';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavProp } from '../types';

import { getWishlist } from '~/apis/auth';

const Wishlist = () => {
  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
  });
  const navigation = useNavigation<NavProp>();
  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      className="mb-4 overflow-hidden rounded-lg bg-muted-3"
      onPress={() => navigation.navigate('Stay', { stay: item })}>
      {/* Image with remove button */}
      <View className="relative h-48 w-full">
        <Image
          source={{ uri: item.displayImages[0]?.imageUrl }}
          className="h-full w-full rounded-t-lg"
          resizeMode="cover"
        />
        <Pressable
          className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full bg-white/80"
          onPress={() => console.log('Remove from wishlist')}>
          <Heart fill="#ff0000" color="#ff0000" size={20} />
        </Pressable>
      </View>

      {/* Title and price */}
      <View className="p-3">
        <Text className="font-UrbanistSemiBold text-lg">{item.title}</Text>
        <Text className="text-primary mt-1 font-UrbanistMedium">
          ₹{item.pricePerNight} <Text className="text-gray-500">night</Text>
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-5">
      <Text className="mb-6 font-UrbanistSemiBold text-3xl">Your Wishlist</Text>

      {wishlist?.length ? (
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="font-UrbanistMedium text-lg text-gray-500">
            Your wishlist is empty
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Wishlist;
