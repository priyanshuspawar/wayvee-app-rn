import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { BadgeCheck, ImagesIcon, MoveLeft, X } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, Image, Dimensions, Pressable, Alert } from 'react-native';

import { NavProp } from '../types';

import { govtVerification } from '~/apis/auth';
import Button from '~/components/ui/Button';
import useUser from '~/store/useUser';

const VerifyAccount = () => {
  const queryClient = useQueryClient();
  const { height } = Dimensions.get('window');
  const navigation = useNavigation<NavProp>();
  const { loggedUser } = useUser();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: govtVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
  const [selectImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset>();
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ✅ Updated
      quality: 1,
    });

    if (!result.canceled) {
      // Handle multiple images (assets is an array
      setSelectedImage(result.assets[0]); // This should be an array of URIs
    }
  };
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      const filename =
        selectImage?.uri.split('/').pop() || `${loggedUser?.id}-govtid.jpg`;
      const fileType = filename.split('.').pop()?.toLowerCase() || 'jpg';

      const fileInfo = await FileSystem.getInfoAsync(selectImage?.uri!);
      if (!fileInfo.exists) return;
      const file = {
        uri: selectImage?.uri,
        name: filename,
        type: `image/${fileType}`,
      };
      formData.append('file', file as any);
      await mutateAsync(formData);
      setSelectedImage(undefined);
    } catch (error) {
      console.log('verify account error :', error);
      Alert.alert('Failed to verify account');
    }
  };
  return (
    <View className="relative flex-1">
      <View className="absolute left-2 top-10 z-20 flex">
        <Pressable
          className="relative w-fit rounded-full bg-muted-2 p-1.5"
          onPress={() => {
            navigation.goBack();
          }}>
          <X size={20} color="#454545" strokeWidth={1.5} />
        </Pressable>
      </View>
      <View
        className="w-full"
        style={{
          position: 'absolute',
          top: 0,
          height: height * 0.53,
        }}>
        <Image
          source={require('@Assets/verify_account_cover.jpg')}
          className="h-full w-full"
        />
      </View>
      <View
        className={clsx(
          'h-full w-full items-center gap-6 overflow-hidden rounded-t-[1.5rem] bg-muted-12 px-6 pt-8'
        )}
        style={{
          top: height * 0.5,
        }}>
        {loggedUser?.governmentId ? (
          //   <View className="h-full w-full items-center justify-center">
          <>
            <Text className="text-center font-UrbanistSemiBold text-3xl text-white">
              Your Account is verified
            </Text>
            <BadgeCheck size={40} color="#f5f5f5" />
            <Button
              label="Back"
              className="w-40"
              //   variant="outlined"
              onPress={() => {
                navigation.goBack();
              }}
            />
          </>
        ) : (
          //   </View>
          <>
            <Text className="text-center font-UrbanistSemiBold text-3xl text-white">
              Upload Govt ID
            </Text>
            <Pressable
              onPress={pickImages}
              className="w-full items-center rounded-lg border-2 border-dashed border-muted-4 p-8">
              {selectImage ? (
                <Image
                  source={{ uri: selectImage.uri }}
                  className="mr-2 h-32 w-32 rounded-lg"
                />
              ) : (
                <>
                  <ImagesIcon width={40} height={40} color="#f5f5f5" />
                  <View className="mt-4 rounded-md bg-black px-4 py-2">
                    <Text className="text-white">Browse</Text>
                  </View>
                </>
              )}
            </Pressable>
            <Button
              label="Submit"
              onPress={handleSubmit}
              isLoading={isPending}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default VerifyAccount;
