import '../global.css';
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_700Bold,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
} from '@expo-google-fonts/urbanist';
import { Stack, SplashScreen } from 'expo-router';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { createAuthStore } from '../store/auth';

import AuthLoader from '~/providers/auth-loader';
import QueryProvider from '~/providers/query-provider';
import { AuthContext } from '~/store/auth';
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    UrbanistRegular: Urbanist_400Regular,
    UrbanistBold: Urbanist_700Bold,
    UrbanistMedium: Urbanist_500Medium,
    UrbanistSemiBold: Urbanist_600SemiBold,
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  const store = useRef(createAuthStore()).current;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <AuthContext.Provider value={store}>
          <AuthLoader>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </AuthLoader>
        </AuthContext.Provider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
