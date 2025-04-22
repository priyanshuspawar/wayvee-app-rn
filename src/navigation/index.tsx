import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { useStore } from 'zustand';

// Screens
import LoginScreen from '../navigation/screens/Login';
import OnboardScreen from '../navigation/screens/Onboarding';
import RegisterScreen from '../navigation/screens/Register';
import StayScreen from '../navigation/screens/StayDetails';
import HomeTabs from '../navigation/screens/Tabs'; // Your Tab Navigator
import type { RootStackParamList } from '../navigation/types';

import { AuthContext } from '~/store/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
  const store = useContext(AuthContext);
  const user = useStore(store!, (s) => s.user);

  return (
    <NavigationContainer>
      {user?.id ? (
        // Authenticated Navigator
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen name="Stay" component={StayScreen} />
          {/* More private screens here */}
        </Stack.Navigator>
      ) : (
        // Unauthenticated Navigator
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboard" component={OnboardScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
