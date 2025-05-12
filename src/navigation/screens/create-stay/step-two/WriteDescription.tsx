import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';

import { updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';

const MAX_CHARACTERS = 500;

const WriteDescription = () => {
  const { stay, setDescription, setTabNum } = useListingStore();
  const { description = '', currentTab: tabNum } = stay;

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
      Alert.alert('Failed to send update. Try again later.');
    }
  };

  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 1 : 1);

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <KeyboardAvoidingView className="flex-grow">
        <View className="mb-6">
          <Text className="mb-1 font-UrbanistSemiBold text-3xl text-black">
            Create your description
          </Text>
          <Text className="font-UrbanistMedium text-base text-gray-600">
            Share what makes your place special.
          </Text>
        </View>

        <View className="mb-2">
          <TextInput
            value={description}
            multiline
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            maxLength={MAX_CHARACTERS}
            placeholder="Reconnect with loved ones in this family-friendly place."
            placeholderTextColor="#999"
            onChangeText={(val) => setDescription(val)}
            className="h-40 w-full rounded-xl border border-black/70 px-4 py-3 font-UrbanistMedium text-base text-black"
            textAlignVertical="top"
          />
        </View>

        <Text className="mb-4 font-UrbanistMedium text-sm text-muted-8">
          {(description ?? '').length}/{MAX_CHARACTERS}
        </Text>
      </KeyboardAvoidingView>
      <View className="mb-4 mt-auto flex-row items-center justify-between">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>
    </View>
  );
};

export default WriteDescription;
