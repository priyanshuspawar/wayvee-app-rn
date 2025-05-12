import Central from '@Assets/central.svg';
import FamilyFriendly from '@Assets/familyfriendly.svg';
import Peaceful from '@Assets/peacefull.svg';
import Spacious from '@Assets/spacious.svg';
import Stylish from '@Assets/stylish.svg';
import Unique from '@Assets/unique.svg';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { View, Text, Pressable, Alert, FlatList } from 'react-native';

import { updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';

// Replace with actual SVGs

const HIGHLIGHTS = [
  { id: 'peaceful', title: 'Peaceful', Icon: Peaceful },
  { id: 'unique', title: 'Unique', Icon: Unique },
  { id: 'family-friendly', title: 'Family-friendly', Icon: FamilyFriendly },
  { id: 'stylish', title: 'Stylish', Icon: Stylish },
  { id: 'central', title: 'Central', Icon: Central },
  { id: 'spacious', title: 'Spacious', Icon: Spacious },
];

const AddPerks = () => {
  const { stay, setPerks, setTabNum } = useListingStore();
  const { currentTab: tabNum, perks } = stay;

  const { mutateAsync: setUpdate, isPending } = useMutation({
    mutationFn: updateStay,
  });

  const togglePerk = (id: string) => {
    if (perks.includes(id)) {
      setPerks(perks.filter((p) => p !== id));
    } else if (perks.length < 2) {
      setPerks([...perks, id]);
    }
  };

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
      <View className="mb-6">
        <Text className="mb-1 font-UrbanistSemiBold text-3xl text-black">
          Next, let's describe your flat/apartment
        </Text>
        <Text className="font-UrbanistMedium text-base text-gray-600">
          Choose up to 2 highlights. We'll use these to get your description
          started.
        </Text>
      </View>

      <FlatList
        data={HIGHLIGHTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 10, marginBottom: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = perks.includes(item.id);
          return (
            <Pressable
              onPress={() => togglePerk(item.id)}
              className={`flex-1 flex-row items-center justify-start gap-2 rounded-full border px-4 py-3 ${
                isSelected ? 'border-black bg-muted-3' : 'border-muted-5'
              }`}>
              <item.Icon width={24} height={24} />
              <Text className="font-UrbanistSemiBold text-base text-black">
                {item.title}
              </Text>
            </Pressable>
          );
        }}
      />

      <View className="mb-4 mt-8 flex-row items-center justify-between">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>
    </View>
  );
};

export default AddPerks;
