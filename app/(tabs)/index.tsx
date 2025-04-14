import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
// import { LinearGradient } from 'expo-linear-gradient';
import {
  ConciergeBell,
  Handshake,
  Sailboat,
  Sparkles,
  Star,
  Tent,
} from 'lucide-react-native';
import { View, Text, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FilterIcon from '../../assets/filter_icon.svg';

import { vh, vw } from '~/utils/dimensions';

// import { Container } from '~/components/Container';

const Tab = () => {
  return (
    <SafeAreaView className="flex-1 bg-neutral-n40">
      <View className="flex flex-1 gap-4 px-4">
        {/* greeings and avatar */}
        <View className="flex w-full flex-row items-center justify-between">
          <View className="flex-row">
            <Text className="font-urbanistBold text-2xl">Hello 👋 </Text>
            <Text className="font-urbanist text-2xl">Jane Copper</Text>
          </View>
          <View>
            <Image
              className="h-12 w-12 rounded-full"
              source={{
                uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }}
            />
          </View>
        </View>
        {/* seach button */}
        <View className="flex h-14 w-full flex-row items-center shadow shadow-muted-7/40">
          <TextInput
            onChange={() => {}}
            placeholder="Search here"
            className="h-full w-full rounded-[2rem] bg-neutral-n20 px-4 font-urbanist"
            keyboardType="web-search"
          />
          <View className="absolute right-2 flex flex-row items-center overflow-hidden rounded-3xl">
            <Canvas style={{ width: vw(125), height: vh(35) }}>
              <Rect x={0} y={0} width={vw(125)} height={vh(35)}>
                <LinearGradient
                  start={vec(0, 20)}
                  end={vec(60, 80)}
                  colors={['#a787ec', '#7ef186']}
                />
              </Rect>
            </Canvas>
            <View className="absolute flex w-full flex-row items-center justify-evenly">
              <Sparkles color="#fff" width={14} />
              <Text className="font-urbanistBold text-muted-2">
                Ai Suggestions
              </Text>
            </View>
          </View>
        </View>
        {/* tabs */}
        <View className="flex flex-row items-center justify-between">
          {/* stays */}
          <View className="w-[5.5rem] items-center justify-center rounded-3xl bg-neutral-n20 pt-2.5 shadow shadow-muted-7/40">
            <Tent color="#454545" width={24} />
            <Text className="font-urbanist text-xs">Stays</Text>
          </View>
          {/* Trips */}
          <View className="w-[5.5rem] items-center justify-center rounded-3xl bg-neutral-n20 pt-2.5 shadow shadow-muted-7/40">
            <Sailboat color="#454545" width={24} />
            <Text className="font-urbanist text-xs">Trips</Text>
          </View>
          {/* agents */}
          <View className="w-[5.5rem] items-center justify-center rounded-3xl bg-neutral-n20 pt-2.5 shadow shadow-muted-7/40">
            <Handshake color="#454545" width={24} />
            <Text className="font-urbanist text-xs">Agents</Text>
          </View>
          {/* services */}
          <View className="w-[5.5rem] items-center justify-center rounded-3xl bg-neutral-n20 pt-2.5 shadow shadow-muted-7/40">
            <ConciergeBell color="#454545" width={24} />
            <Text className="font-urbanist text-xs">Services</Text>
          </View>
        </View>
        <View className="my-2 flex gap-2">
          <View className="flex flex-row items-center justify-between">
            <Text className="font-UrbanistSemiBold text-2xl">
              Popular Destinations
            </Text>
            <View
              className="aspect-square items-center justify-center rounded-full bg-neutral-n20 shadow shadow-muted-7/40"
              style={{ width: 45 }}>
              <FilterIcon width={25} />
            </View>
          </View>
          <View className="flex rounded-3xl bg-neutral-n20 shadow-lg shadow-muted-7/40">
            <Image
              className="h-64 w-full rounded-t-3xl"
              source={{
                uri: 'https://a0.muscache.com/im/pictures/miso/Hosting-23780166/original/3cc9b72f-9e92-4269-84c3-d710201d6e7a.jpeg?im_w=720',
              }}
            />
            <View className="flex w-full flex-row items-start justify-between p-3">
              <View>
                <Text className="text-mu font-UrbanistSemiBold text-lg capitalize">
                  La vista Villa
                </Text>
                <Text className="font-urbanistMedium text-muted-8">
                  2 Bedrooms & 2 Baths
                </Text>
                <View className="flex flex-row">
                  <Text className="font-urbanistBold underline">INR.4500 </Text>
                  <Text className="font-UrbanistMedium text-muted-8">
                    for 1 night
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center gap-1">
                <Star width={10} color="#000" fill="#000" />
                <Text className="font-urbanist text-muted-10">4.56 (95)</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Tab;
