import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { useStore } from 'zustand';

// Screens
import AgentApplyScreen from './screens/AgentApplyScreen';
import AgentPanel from './screens/AgentPanel';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from '../navigation/screens/Login';
import OnboardScreen from '../navigation/screens/Onboarding';
import RegisterScreen from '../navigation/screens/Register';
import StayScreen from '../navigation/screens/StayDetails';
import HomeTabs from '../navigation/screens/Tabs'; // Your Tab Navigator
import type { RootStackParamList } from '../navigation/types';
import CreateStayScreen from './screens/CreateStay';
import VerifySceeen from './screens/Verify';
import VerifyAccount from './screens/VerifyAccount';

import UserMessagingScreen from '~/components/UserMessage';
import { AuthContext } from '~/store/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
  const store = useContext(AuthContext);
  const user = useStore(store!, (s) => s.user);

  return (
    <NavigationContainer>
      {user?.id ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen name="Stay" component={StayScreen} />
          <Stack.Screen name="CreateStay" component={CreateStayScreen} />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="VerifyAccount"
            component={VerifyAccount}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <Stack.Screen
            name="ApplyAgent"
            component={AgentApplyScreen}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <Stack.Screen
            name="AgentPanel"
            component={AgentPanel}
            options={{
              animation: 'slide_from_left',
            }}
          />
          <Stack.Screen
            name="UserMessageScreen"
            component={UserMessagingScreen}
            options={{
              animation: 'slide_from_left',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboard" component={OnboardScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Verify" component={VerifySceeen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
