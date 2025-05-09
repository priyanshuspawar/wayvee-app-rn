import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Wishlist = () => {
  return (
    <SafeAreaView className="flex-1 bg-neutral-n40 px-4 pt-28">
      <Text className="font-UrbanistSemiBold text-4xl">Community</Text>
      <Text className="font-UrbanistMedium text-lg">Coming soon</Text>
    </SafeAreaView>
  );
};

export default Wishlist;
