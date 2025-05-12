import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';

import { updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';
import { PROPERTY_TYPES } from '~/utils/constants';

const PropertyAccess = () => {
  const { setTabNum, stay, setPropertyAccess } = useListingStore();
  const { currentTab: tabNum } = stay;
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
      <View className="flex-1 bg-neutral-n0 px-4">
        <Text className="mb-8 font-urbanistBold text-4xl">
          What type of place the guests will have?
        </Text>
        <FlatList
          data={PROPERTY_TYPES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const Icon = item.icon;
            const isSelected = stay.propertyAccess === item.title;
            return (
              <Pressable
                onPress={() => {
                  setPropertyAccess(item.title);
                }}
                className={clsx(
                  'mb-4 flex-1 flex-row justify-between rounded-lg border p-4',
                  isSelected ? 'border-primary' : 'border-muted-6/40'
                )}>
                <View className="w-[85%] gap-1">
                  <Text className="font-UrbanistSemiBold text-[1.35rem] text-muted-10">
                    {item.title}
                  </Text>
                  <Text className="font-UrbanistMedium text-[1.22rem] leading-normal text-muted-8">
                    {item.sub}
                  </Text>
                </View>
                <Icon width={40} height={40} className="flex-shrink-0" />
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

export default PropertyAccess;
