import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';

import { updateStay } from '~/apis/auth';
import PhotoUploadDrawer from '~/components/PhotoUploader';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';

const AddPictures = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const { stay, setTabNum, images } = useListingStore();
  const { displayImages, currentTab: tabNum } = stay;
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
  useEffect(() => {
    if (images.length > 0) {
      setTabNum(tabNum + 1);
    }
  }, []);
  return (
    <View className="flex-1">
      <View className="flex-1 px-4">
        <View className="mb-4 gap-1">
          <Text className="font-urbanistBold text-4xl">
            Add some photos of your flat/apartment
          </Text>
          <Text className="font-UrbanistSemiBold text-xl text-muted-8/80">
            You'll need 5 photos to get started. You can add more or make
            changes later.
          </Text>
        </View>
        <View className="aspect-square w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-4 bg-[#f7f7f7]">
          <Image
            source={{
              uri: 'https://a0.muscache.com/im/pictures/mediaverse/mys-amenities-n8/original/c83b2a87-3be4-43c9-ad47-12dd2aee24c4.jpeg',
            }}
            style={{
              width: '70%',
              height: '70%',
            }}
            resizeMode="cover"
          />
          <Pressable
            onPress={() => setShowDrawer(true)}
            className="rounded-md border border-muted-10 bg-white px-8 py-2">
            <Text className="font-UrbanistMedium text-lg">Add Photos</Text>
          </Pressable>
        </View>
        <PhotoUploadDrawer
          isVisible={showDrawer}
          onClose={() => setShowDrawer(false)}
        />
      </View>
      <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button
          label="Next"
          disabled={images.length === 0}
          onPress={update}
          isLoading={isPending}
        />
      </View>
    </View>
  );
};

export default AddPictures;
