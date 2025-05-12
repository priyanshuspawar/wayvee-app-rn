import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { View, Text, Pressable, FlatList, Alert } from 'react-native';

import { updateStay } from '~/apis/auth';
import AmenityIcon from '~/components/AmenitiesIcon';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';
import { amenities as AMENITIES } from '~/utils/constants';

const AmenitiesSelect = () => {
  const { stay, setAmenities, setTabNum } = useListingStore();
  const { amenities, currentTab: tabNum } = stay;
  const toggleAmenity = (label: string) => {
    setAmenities(
      amenities.includes(label)
        ? amenities.filter((item) => item !== label)
        : [...amenities, label]
    );
  };
  const { mutateAsync: setUpdate, isPending } = useMutation({
    mutationFn: updateStay,
  });
  const update = async () => {
    try {
      const { createdAt, updatedAt, ...updateData } = stay;
      await setUpdate({
        updateStay: {
          ...updateData,
          currentTab: updateData.currentTab + 1,
        },
      });
      setTabNum(tabNum + 1);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      }
      Alert.alert('Failed to send update try again later');
    }
  };
  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 1 : 1);

  return (
    <View className="flex-1">
      <View className="relative gap-4 bg-neutral-n0 px-4" style={{ flex: 1 }}>
        <FlatList
          className="h-full w-full"
          ListHeaderComponent={() => (
            <View className="mb-4 gap-2">
              <Text className="font-urbanistBold text-4xl">
                Tell guests what your place has to offer
              </Text>
              <Text className="font-UrbanistSemiBold text-xl text-muted-8/80">
                You can add more amenities after you publish your listing.
              </Text>
            </View>
          )}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          data={AMENITIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = amenities.includes(item.title);

            return (
              <Pressable
                onPress={() => toggleAmenity(item.title)} // ✅ Use title
                className="w-1/2 p-1">
                <View
                  className={clsx(
                    'h-32 gap-2 rounded-md border p-3',
                    isSelected ? 'border-primary' : 'border-muted-6/40'
                  )}>
                  <AmenityIcon size={40} name={item.id} />
                  <Text className="font-urbanistSemiBold text-lg text-muted-10">
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
      <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>
    </View>
  );
};

export default AmenitiesSelect;
