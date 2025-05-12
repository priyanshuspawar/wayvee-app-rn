import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { View, Text, Pressable, FlatList, Alert } from 'react-native';

import { updateStay } from '~/apis/auth';
import PlaceIcon from '~/components/PlacesIcon';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';
import { PLACE_TYPES } from '~/utils/constants';

const TypeOfProperty = () => {
  // const { stay, setTypeOfStay } = useListingStore();
  const { setTabNum, setTypeOfStay, stay } = useListingStore();
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
      <View className="relative gap-4 bg-neutral-n0 px-4" style={{ flex: 1 }}>
        <FlatList
          className="h-full w-full"
          ListHeaderComponent={() => (
            <Text className="mb-4 font-urbanistBold text-4xl">
              Which of the best describes your place?
            </Text>
          )}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          data={PLACE_TYPES}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = stay.typeOfStay === item.title;

            return (
              <Pressable
                onPress={() => setTypeOfStay(item.title)}
                className="w-1/2 p-1">
                <View
                  className={clsx(
                    'h-32 gap-2 rounded-md border p-3',
                    isSelected ? 'border-primary' : 'border-muted-6/40'
                  )}>
                  <PlaceIcon size={40} name={item.id} />
                  <Text className="font-UrbanistSemiBold text-lg text-muted-10">
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

export default TypeOfProperty;
