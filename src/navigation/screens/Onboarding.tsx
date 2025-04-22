import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BlurMask,
  Canvas,
  Oval,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import clsx from 'clsx';
import {
  View,
  ImageBackground,
  StatusBar,
  Dimensions,
  Text,
  Pressable,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// import { Container } from '~/components/Container';
import type { RootStackParamList } from '../types';

import PillButton from '~/components/ui/PillButton';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
const Onboard = () => {
  const height = Dimensions.get('window').height * 0.3;
  const width = Dimensions.get('window').width * 1.2;

  const pan = Gesture.Pan().onEnd((e) => {
    const x = e.translationX;
    if (x > 50) {
      console.log('swipe right');
    } else if (x < -50) {
      console.log('swipe left');
    }
  });
  const navigation = useNavigation<NavProp>();
  return (
    <GestureDetector gesture={pan}>
      <View
        className="h-full w-full flex-1 justify-end"
        // source={require('assets/background-1.jpg')
        // }
        style={{
          backgroundImage: 'requireassets/background-1.jpg',
        }}
        collapsable>
        <StatusBar translucent />
        <ImageBackground
          className="flex h-full w-full justify-end"
          source={require('assets/background-1.jpg')}>
          <View
            style={{ height: height + 50 }}
            className="absolute w-full items-center justify-center">
            <Canvas style={{ width: width + 10, height: '100%' }}>
              <Oval x={0} y={60} width={600} height={height}>
                <RadialGradient
                  c={vec(200, 220)}
                  r={250}
                  colors={['#7EF186CC', '#D7FBD920']}
                  positions={[0.1, 1]}
                />
                <BlurMask blur={50} style="normal" />
              </Oval>
            </Canvas>
          </View>
          <SafeAreaProvider>
            <SafeAreaView className="flex h-full w-full justify-end gap-4 p-4">
              <Text className="font-urbanistBold text-5xl text-muted-2">
                Your Next Trip Starts Here
              </Text>
              <Text className="font-urbanistLight text-muted-2">
                Explore new destinations, create personalized itineraries, and
                get live travel updates to make every trip effortless and
                stress-free
              </Text>
              <View className="h-1 w-full flex-row justify-between">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Pressable
                    key={i}
                    className={clsx(
                      'flex h-full w-[23%] rounded-lg',
                      i === 0 ? 'bg-muted-4' : 'bg-[#f0f0f040]'
                    )}
                  />
                ))}
              </View>
              <View className="flex w-full flex-row justify-between">
                <PillButton
                  onPress={() => {
                    navigation.navigate('Login');
                  }}
                  title="Log in"
                />
                <PillButton
                  onPress={() => {
                    navigation.navigate('Register');
                  }}
                  title="Sign up"
                />
              </View>
            </SafeAreaView>
          </SafeAreaProvider>
        </ImageBackground>
      </View>
    </GestureDetector>
  );
};

export default Onboard;
