import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { View, Text, Pressable, SafeAreaView, Alert } from 'react-native';

import { updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';

const SpaceAndOccupancy = () => {
  const { setBathrooms, setBedrooms, setMaxOccupancy, stay, setTabNum } =
    useListingStore();
  const { currentTab: tabNum } = stay;
  const properties = [
    {
      label: 'Guests',
      value: stay.maxOccupancy ?? 0,
      func: setMaxOccupancy,
    },
    {
      label: 'Bathrooms',
      value: stay.bathrooms ?? 0,
      func: setBathrooms,
    },
    {
      label: 'Bedrooms',
      value: stay.bedrooms ?? 0,
      func: setBedrooms,
    },
    {
      label: 'Beds',
      value: stay.bedrooms ?? 0, // You may want to store this separately later
      func: setBedrooms,
    },
  ];
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
      <SafeAreaView className="mx-4 flex flex-1 flex-col pt-6">
        <Text className="mb-2 font-UrbanistSemiBold text-4xl text-muted-10">
          Share some basics about your place
        </Text>
        <Text className="mb-6 font-UrbanistMedium text-xl text-gray-600">
          You'll add more details later, such as bed types.
        </Text>

        {properties.map((_, index) => (
          <Counter key={index} properties={properties} index={index} />
        ))}
      </SafeAreaView>
      <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>
    </View>
  );
};

const Counter = ({
  properties,
  index,
}: {
  properties: {
    label: string;
    value: number;
    func: (count: number) => void;
  }[];
  index: number;
}) => {
  const current = properties[index];
  const count = current.value ?? 0;

  const increase = () => {
    const newVal = Math.min(count + 1, 12);
    current.func(newVal);
  };

  const decrease = () => {
    const newVal = Math.max(count - 1, 0);
    current.func(newVal);
  };

  return (
    <View className="my-4 flex-row items-center justify-between border-b border-gray-200 pb-4">
      <Text className="font-urbanistBold text-xl capitalize text-muted-10">
        {current.label}
      </Text>
      <View className="flex-row items-center space-x-4">
        <Pressable
          onPress={decrease}
          className="h-8 w-8 items-center justify-center rounded-full border border-gray-400">
          <Text className="text-xl">−</Text>
        </Pressable>
        <Text className="w-6 text-center font-UrbanistMedium text-lg">
          {count}
        </Text>
        <Pressable
          onPress={increase}
          className="h-8 w-8 items-center justify-center rounded-full border border-gray-400">
          <Text className="text-xl">+</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SpaceAndOccupancy;
