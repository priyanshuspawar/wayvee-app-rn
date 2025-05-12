import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { View, Text, Image, Alert } from 'react-native';

import { craeteStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';

const Onboard = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: craeteStay,
  });
  const {
    setTabNum,
    stay: { currentTab: tabNum },
  } = useListingStore();
  const create = async () => {
    try {
      await mutateAsync();
      setTabNum(tabNum + 1);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      }
      Alert.alert('Failed to send update try again later');
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-grow justify-between px-6 py-8">
        <Text className="font-UrbanistBold text-neutral-12 mb-6 text-3xl leading-tight">
          It’s easy to get started on WayVee
        </Text>

        {[
          {
            title: '1 Tell us about your place',
            desc: 'Share more basic info, such as where it is and how many guests can stay',
            image: require('@Assets/bed.png'),
          },
          {
            title: '2 Make it stand out',
            desc: 'Add 5 or more photos plus a little description — we’ll help you out.',
            image: require('@Assets/wardrobe.png'),
          },
          {
            title: '3 Finish and publish',
            desc: 'Choose a starting price, verify a few details, then publish it',
            image: require('@Assets/standing.png'),
          },
        ].map((step, idx) => (
          <View
            key={idx}
            className="mb-6 flex-row items-start justify-between rounded-xl bg-muted-2/10 p-4">
            <View className="flex-1 pr-4">
              <Text className="text-neutral-12 mb-1 font-UrbanistSemiBold text-xl">
                {step.title}
              </Text>
              <Text className="font-UrbanistMedium text-base leading-snug text-muted-8">
                {step.desc}
              </Text>
            </View>
            <Image
              source={step.image}
              className="h-20 w-20 rounded-md shadow-md"
              resizeMode="contain"
            />
          </View>
        ))}
      </View>
      <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
        <Button label="Get Started" onPress={create} isLoading={isPending} />
      </View>
    </View>
  );
};

export default Onboard;
