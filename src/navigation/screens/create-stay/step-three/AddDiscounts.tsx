import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { View, Text, Pressable, Alert } from 'react-native';

import { publishStay, updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { NavProp } from '~/src/navigation/types';
import { useListingStore } from '~/store/useListingStore';

const DISCOUNT_OPTIONS = [
  {
    id: 'mature',
    label: 'Boosting promotion',
    sub: 'Offer 30% off',
    value: '30.00',
  },
  {
    id: 'new_listing',
    label: 'New listing promotion',
    sub: 'Offer 20% off',
    value: '20.00',
  },
  {
    id: 'none',
    label: 'No discount',
    sub: 'Skip this step for now',
    value: '0.00',
  },
];

const AddDiscount = () => {
  const navigation = useNavigation<NavProp>();
  const { stay, setDiscount, setTabNum } = useListingStore();
  const { discount = '0.00', currentTab: tabNum } = stay;
  const queryClient = useQueryClient();
  const { mutateAsync: setUpdate, isPending } = useMutation({
    mutationFn: updateStay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-stays'] });
    },
  });

  const update = async () => {
    try {
      const { createdAt, updatedAt, ...updateData } = stay;
      await setUpdate({
        updateStay: {
          ...updateData,
        },
      });
      await publishStay(stay.id);
      Alert.alert('Published Successfully');
      navigation.navigate('AgentPanel');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      }
      Alert.alert('Failed to send update. Try again later.');
    }
  };

  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 1 : 1);

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <View className="mb-6">
        <Text className="mb-1 font-UrbanistSemiBold text-4xl text-black">
          Add discounts
        </Text>
        <Text className="font-UrbanistMedium text-base text-gray-600">
          Help your place stand out to get booked faster and earn your first
          reviews.
        </Text>
      </View>

      {DISCOUNT_OPTIONS.map((option) => {
        const selected = discount === option.value;

        return (
          <Pressable
            key={option.id}
            onPress={() => setDiscount(option.value)}
            className={`mb-4 rounded-xl border px-4 py-4 ${
              selected ? 'border-black bg-gray-100' : 'border-gray-300'
            }`}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-UrbanistBold text-xl text-black">
                  {option.label}
                </Text>
                <Text className="mt-1 font-UrbanistMedium text-sm text-gray-600">
                  {option.sub}
                </Text>
              </View>
              <View
                className={`h-6 w-6 items-center justify-center rounded-full border ${
                  selected ? 'border-black bg-black' : 'border-gray-400'
                }`}>
                {selected && (
                  <View className="h-2.5 w-2.5 rounded-full bg-white" />
                )}
              </View>
            </View>
          </Pressable>
        );
      })}

      <Text className="mb-4 text-center text-sm text-gray-500">
        Only one discount will be applied per stay.{' '}
        <Text className="underline">Learn more</Text>
      </Text>

      <View className="mb-4 mt-auto flex-row items-center justify-between">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Publish" onPress={update} isLoading={isPending} />
      </View>
    </View>
  );
};

export default AddDiscount;
