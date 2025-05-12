// AgentDashboard.tsx
import { Bell, Menu, CalendarCheck } from 'lucide-react-native';
import { View, Text, Pressable, ScrollView } from 'react-native';

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-10">
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-sky-600">W</Text>
        <View className="flex-row items-center space-x-4">
          <Bell className="text-gray-700" size={24} />
        </View>
      </View>

      {/* Welcome */}
      <Text className="mb-2 font-UrbanistSemiBold text-3xl">
        Welcome, Priyanshu!
      </Text>
      {/* <Pressable className="mb-4 self-start rounded-full border border-gray-300 bg-white px-4 py-2">
        <Text className="font-medium text-black">Complete your listing</Text>
      </Pressable> */}

      {/* Reservation Tabs */}
      <View className="mb-4 flex-row">
        <Pressable className="mr-2 rounded-full bg-black px-4 py-2">
          <Text className="font-semibold text-white">Checking out (0)</Text>
        </Pressable>
        <Pressable className="rounded-full bg-gray-200 px-4 py-2">
          <Text className="font-semibold text-gray-600">
            Currently hosting (0)
          </Text>
        </Pressable>
      </View>

      {/* Empty State Box */}
      <View className="h-40 items-center justify-center rounded-2xl bg-gray-100 p-6">
        <CalendarCheck className="mb-2 text-gray-400" size={36} />
        <Text className="text-center text-gray-600">
          You don’t have any guests checking out today or tomorrow.
        </Text>
      </View>
    </ScrollView>
  );
}
