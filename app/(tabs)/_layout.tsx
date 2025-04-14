import { Tabs } from 'expo-router';
import { Heart, Search, Flame, Briefcase, Globe } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: '#a787ec', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Search size={28} color={color} />, // use `color` for active/inactive tint
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color }) => <Heart size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="showcase"
        options={{
          title: 'Showcase',
          tabBarIcon: ({ color }) => <Flame size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <Globe size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <Briefcase size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
