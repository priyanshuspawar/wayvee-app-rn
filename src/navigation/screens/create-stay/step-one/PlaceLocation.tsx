import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { Pressable, View, Text, Alert } from 'react-native';

import { updateStay } from '~/apis/auth';
import MapInput from '~/components/MapInput';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';

const PlaceLocation = () => {
  const [isInputFocused, setIsInputFocus] = useState<'active' | null>(null);
  const { setTabNum, stay } = useListingStore();
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
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    stay.location
      ? {
          latitude: stay.location?.y,
          longitude: stay.location?.x,
        }
      : null
  );
  return (
    <View className="flex-1">
      <MapInput
        isInputFocused={isInputFocused}
        setIsInputFocus={setIsInputFocus}
        marker={marker}
        setMarker={setMarker}
      />
      <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>
    </View>
  );
};

export default PlaceLocation;
