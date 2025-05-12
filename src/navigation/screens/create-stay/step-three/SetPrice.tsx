import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';

import { updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';
// You can make a utility or use numeral

const GUEST_SERVICE_FEE = 0.02;

const SetPrice = () => {
  const {
    stay,
    setPricePerNight,
    setTabNum,
    setBaseGuest,
    setPerPersonIncrement,
  } = useListingStore();
  const { pricePerNight = '', currentTab: tabNum, baseGuest } = stay;

  const [editVisible, setEditVisible] = useState(false);
  const [tempPrice, setTempPrice] = useState(pricePerNight);

  const basePrice = parseFloat(pricePerNight || '0');
  const guestTotal = basePrice + GUEST_SERVICE_FEE * basePrice;
  const hostEarnings = basePrice;

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
      Alert.alert('Failed to save. Please try again.');
    }
  };

  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 1 : 1);

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <View className="mb-6">
        <Text className="mb-1 font-UrbanistSemiBold text-4xl text-black">
          Now, set your price
        </Text>
        <Text className="font-UrbanistMedium text-base text-gray-600">
          You can change it anytime.
        </Text>
      </View>

      <View className="mb-6 items-center justify-center">
        <View className="relative flex-row items-center">
          <Text className="font-UrbanistBold text-5xl text-black">
            ₹{basePrice.toLocaleString('en-IN')}
          </Text>
          <TouchableOpacity
            onPress={() => setEditVisible(true)}
            className="ml-2 rounded-full border border-gray-300 p-1">
            <Text className="text-lg">✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-4 rounded-xl border border-black px-4 py-4">
        <Row
          label="Base price"
          value={`₹${basePrice.toLocaleString('en-IN')}`}
        />
        <Row
          label="Wayvee service fee"
          value={`₹${(GUEST_SERVICE_FEE * basePrice).toLocaleString('en-IN')}`}
        />
        <View className="my-2 h-[1px] bg-gray-300" />
        <Row
          label="Total price"
          value={`₹${guestTotal.toLocaleString('en-IN')}`}
          isBold
        />
      </View>

      <View className="mb-6 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
        <Row
          label="You earn"
          value={`₹${hostEarnings.toLocaleString('en-IN')}`}
          isBold
        />
      </View>

      <View className="mb-4 mt-auto flex-row items-center justify-between">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>

      {/* Edit Modal */}
      <Modal visible={editVisible} transparent animationType="slide">
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full rounded-lg bg-white p-6">
            <Text className="mb-2 text-lg font-semibold text-black">
              Edit your price
            </Text>
            <TextInput
              keyboardType="numeric"
              value={tempPrice}
              onChangeText={(val) => setTempPrice(val)}
              className="mb-4 rounded border border-gray-400 px-4 py-2 text-base text-black"
              placeholder="Enter price"
            />
            <View className="my-4">
              <View>
                <Text className="mb-2 w-full text-center font-UrbanistSemiBold text-lg text-muted-13">
                  Number of Base Guests
                </Text>
                <View className="flex flex-row items-center justify-center gap-2">
                  <Pressable
                    onPress={() => {
                      if (baseGuest === 1) {
                        return;
                      }
                      setBaseGuest(baseGuest - 1);
                    }}
                    className="rounded-full bg-muted-4 p-1">
                    <Minus size={20} color="#454545" />
                  </Pressable>
                  <Text>{baseGuest}</Text>
                  <Pressable
                    onPress={() => {
                      if (baseGuest === 16) {
                        return;
                      }
                      setBaseGuest(baseGuest + 1);
                    }}
                    className="rounded-full bg-muted-4 p-1">
                    <Plus size={20} color="#454545" />
                  </Pressable>
                </View>
              </View>
            </View>
            <View className="flex-row justify-end gap-4">
              <Pressable onPress={() => setEditVisible(false)}>
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setPerPersonIncrement((basePrice / baseGuest).toString());
                  setPricePerNight(tempPrice);
                  setEditVisible(false);
                }}>
                <Text className="text-primary font-semibold">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Row = ({
  label,
  value,
  isBold = false,
}: {
  label: string;
  value: string;
  isBold?: boolean;
}) => (
  <View className="mb-2 flex-row justify-between">
    <Text
      className={isBold ? 'font-UrbanistSemiBold text-base' : 'text-gray-700'}>
      {label}
    </Text>
    <Text
      className={isBold ? 'font-UrbanistSemiBold text-base' : 'text-gray-800'}>
      {value}
    </Text>
  </View>
);

export default SetPrice;
