import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useListingStore } from '~/store/useListingStore';

const Counter = ({
  label,
  value,
}: {
  label: 'guests' | 'bedrooms' | 'beds' | 'bathrooms';
  value: number;
}) => {
  //   const [count, setCount] = useState(1);
  const { setField } = useListingStore();
  const increase = () => {
    if (value > 12) {
      return;
    }
    setField(label, value + 1);
  };
  const decrease = () => {
    if (value === 1) {
      return;
    }
    setField(label, value - 1);
  };
  return (
    <View className="my-4 flex-row items-center justify-between border-b border-gray-200 pb-4">
      <Text className="font-urbanistBold text-xl capitalize text-muted-10">
        {label}
      </Text>
      <View className="flex-row items-center space-x-4">
        <Pressable
          onPress={decrease}
          className="h-8 w-8 items-center justify-center rounded-full border border-gray-400">
          <Text className="text-xl">−</Text>
        </Pressable>
        <Text className="w-6 text-center font-UrbanistMedium text-lg">
          {value}
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

export default function PropertyBasicsTab() {
  const { bathrooms, bedrooms, beds, guests } = useListingStore();
  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      <Text className="mb-2 font-UrbanistSemiBold text-4xl text-muted-10">
        Share some basics about your place
      </Text>
      <Text className="mb-6 font-UrbanistMedium text-xl text-gray-600">
        You'll add more details later, such as bed types.
      </Text>

      <Counter label="guests" value={guests} />
      <Counter label="bedrooms" value={bedrooms} />
      <Counter label="beds" value={beds} />
      <Counter label="bathrooms" value={bathrooms} />
    </SafeAreaView>
  );
}
