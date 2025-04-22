import '../global.css';
import {
  useFonts,
  Urbanist_300Light,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';
import { Assets as NavigationAssets } from '@react-navigation/elements';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Navigation } from './navigation';

import AuthLoader from '~/providers/auth-loader';
import QueryProvider from '~/providers/query-provider';
import { AuthContext, createAuthStore } from '~/store/auth';

Asset.loadAsync([
  ...NavigationAssets,
  require('./assets/newspaper.png'),
  require('./assets/bell.png'),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Urbanist_Light: Urbanist_300Light,
    UrbanistRegular: Urbanist_400Regular,
    UrbanistBold: Urbanist_700Bold,
    UrbanistMedium: Urbanist_500Medium,
    UrbanistSemiBold: Urbanist_600SemiBold,
  });

  const store = useRef(createAuthStore()).current;

  useEffect(() => {
    async function prepare() {
      try {
        // Load any assets
        await Asset.loadAsync([
          ...NavigationAssets,
          require('./assets/newspaper.png'),
          require('./assets/bell.png'),
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
          setIsReady(true);
          SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!isReady) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <AuthContext.Provider value={store}>
          <AuthLoader>
            <Navigation
            // linking={{
            //   enabled: 'auto',
            //   prefixes: [
            //     // Change the scheme to match your app's scheme defined in app.json
            //     'wayvee-app',
            //   ],
            // }}
            />
          </AuthLoader>
        </AuthContext.Provider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
