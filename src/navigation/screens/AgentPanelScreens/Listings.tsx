import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { Plus, Search, Squirrel } from 'lucide-react-native';
import { useEffect } from 'react';
import { View, Text, Pressable, Image, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavProp } from '../../types';

import { getStaysOfAgent } from '~/apis/auth';
import useAgentStore from '~/store/useAgentStore';
import { useListingStore } from '~/store/useListingStore';
import { getRelativeDate } from '~/utils/helpers';

const Listings = () => {
  const navigation = useNavigation<NavProp>();
  const { data, isLoading } = useQuery({
    queryKey: ['agent-stays'],
    queryFn: getStaysOfAgent,
  });
  const { setStays, myStays } = useAgentStore();
  const { setAll } = useListingStore();
  useEffect(() => {
    if (data && data?.length > 0) {
      setStays(data);
    }
  }, [data]);

  const isStayunPublished = myStays.find((v) => v.isPublished === false);
  return (
    <SafeAreaView className="flex-1 bg-muted-2 px-4 pt-4">
      <View className="flex flex-row justify-end gap-2">
        <Pressable className="rounded-full bg-muted-5 p-1">
          <Search size={20} />
        </Pressable>
        <Pressable
          onPress={() => {
            if (isStayunPublished) {
              Alert.alert(
                'Failed to create new listing first complete incomplete listing or delete them'
              );
              return;
            }
            navigation.navigate('CreateStay');
          }}
          className="rounded-full bg-muted-5 p-1">
          <Plus size={20} />
        </Pressable>
      </View>
      <Text className="mb-4 font-UrbanistSemiBold text-3xl">Your Listings</Text>
      {myStays.length === 0 ? (
        <View className="h-40 items-center justify-center gap-4 rounded-2xl bg-muted-4 p-6">
          <Squirrel size={36} />
          <Text className="text-center text-gray-600">
            You don’t have any Listings right now.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myStays}
          keyExtractor={(item) => item.id}
          renderItem={({ item: v }) => {
            const imgUrl = v.displayImages.find(
              (v) => v.type === 'cover'
            )?.imageUrl;
            return (
              <View key={v.id}>
                <Pressable
                  onPress={() => {
                    setAll(v as any);
                    navigation.navigate('CreateStay');
                  }}
                  className="flex h-64 w-full overflow-hidden rounded-lg bg-muted-5">
                  {imgUrl && (
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      source={{ uri: imgUrl }}
                    />
                  )}
                  <View className="absolute left-2 top-5">
                    <View className="flex rounded-2xl bg-muted-2 px-2 py-1">
                      <Text className="font-UrbanistMedium">
                        {v.isPublished
                          ? v.availability
                            ? 'Active'
                            : 'Unlisted'
                          : 'In progress'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
                <Text className="my-2 font-UrbanistMedium text-muted-10">
                  Created at {getRelativeDate(v.createdAt)}
                </Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Listings;
