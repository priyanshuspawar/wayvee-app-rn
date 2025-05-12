import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';

const MAX_TITLE_LENGTH = 32;

const WriteTitle = () => {
  const { stay, setTitle, setTabNum } = useListingStore();
  const { currentTab: tabNum, title } = stay;

  const [localTitle, setLocalTitle] = useState(title || '');

  const { mutateAsync: setUpdate, isPending } = useMutation({
    mutationFn: updateStay,
  });

  const update = async () => {
    try {
      setTitle(localTitle.trim());
      const { createdAt, updatedAt, ...updateData } = stay;

      await setUpdate({
        updateStay: {
          ...updateData,
          title: localTitle.trim(),
          currentTab: updateData.currentTab + 1,
        },
      });

      setTabNum(tabNum + 1);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
      }
      Alert.alert('Error', 'Failed to update title. Try again later.');
    }
  };

  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 1 : 1);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-4 pt-6"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex-1">
        <View className="mb-6">
          <Text className="mb-2 font-UrbanistSemiBold text-4xl text-black">
            Now, let's give your flat/apartment a title
          </Text>
          <Text className="font-UrbanistMedium text-base text-gray-500">
            Short titles work best. Have fun with it – you can always change it
            later.
          </Text>
        </View>

        <View className="mb-2 rounded-xl border border-black p-2">
          <TextInput
            value={localTitle}
            onChangeText={(text) =>
              text.length <= MAX_TITLE_LENGTH && setLocalTitle(text)
            }
            // multiline
            // numberOfLines={3}
            style={{ fontSize: 16, textAlignVertical: 'top' }}
            className="font-UrbanistMedium text-black"
          />
        </View>
        <Text className="text-right text-gray-500">
          {localTitle.length}/{MAX_TITLE_LENGTH}
        </Text>
      </View>

      <View className="mb-4 w-full flex-row items-center justify-between px-0 py-4">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default WriteTitle;
