import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Heart, Search, Flame, Briefcase, Globe } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BookingsScreen from '../screens/Bookings';
import CommunityScreen from '../screens/Community';
import ExploreScreen from '../screens/Explore'; // previously `index.tsx`
import ShowcaseScreen from '../screens/Showcase';
import WishlistScreen from '../screens/Wishlist';

import userStore from '~/store/user';
import { vh } from '~/utils/dimensions';
import { useUserLocation } from '~/utils/hooks/useUserLocation';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { location } = useUserLocation();
  const { setUserLocation } = userStore();

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      setUserLocation({ x: location.longitude, y: location.latitude });
    }
  }, [location]);

  return (
    <SafeAreaView className="flex-1">
      <StatusBar hidden />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#a787ec',
          tabBarStyle: {
            paddingTop: vh(10),
            paddingVertical: vh(20),
            height: vh(80),
          },
        }}>
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({ color }) => <Search size={28} color={color} />,
          }}
        />
        <Tab.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{
            tabBarIcon: ({ color }) => <Heart size={28} color={color} />,
          }}
        />
        <Tab.Screen
          name="Showcase"
          component={ShowcaseScreen}
          options={{
            tabBarIcon: ({ color }) => <Flame size={28} color={color} />,
          }}
        />
        <Tab.Screen
          name="Community"
          component={CommunityScreen}
          options={{
            tabBarIcon: ({ color }) => <Globe size={28} color={color} />,
          }}
        />
        <Tab.Screen
          name="Bookings"
          component={BookingsScreen}
          options={{
            tabBarIcon: ({ color }) => <Briefcase size={28} color={color} />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default HomeTabs;
