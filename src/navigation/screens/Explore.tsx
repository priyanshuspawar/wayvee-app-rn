import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
// import { LinearGradient } from 'expo-linear-gradient';
import {
  ConciergeBell,
  Handshake,
  Sailboat,
  Sparkles,
  Tent,
} from 'lucide-react-native';
import { View, Text, Image, TextInput, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { RootStackParamList } from '../types';

import StayCard from '~/components/StayCard';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { dataStays } from '~/utils/constants';
import { vh, vw } from '~/utils/dimensions';

// import { Container } from '~/components/Container';
type NavProp = NativeStackNavigationProp<RootStackParamList>;
const Explore = () => {
  const navigation = useNavigation<NavProp>();
  return (
    <SafeAreaView className="flex-1 bg-neutral-n40">
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Header />}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={false}
        className="bg-transparent"
        data={dataStays}
        renderItem={({ item }) => (
          <StayCard
            key={item.id}
            baseGuest={item.baseGuest}
            image={item.displayImages[0]}
            perks={item.perks}
            price={item.pricePerNight}
            rating={item.rating}
            title={item.title}
            onPress={() => {
              console.log('pressed');
              navigation.navigate('Stay', { stayId: 'dsd' });
              // router.push('/stays/[id]');
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;

const Header = () => {
  return (
    <View className="mb-4 flex flex-1 gap-4 bg-neutral-n40 px-4">
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
        <View className="w-[5.5rem] items-center justify-center border-b border-muted-8 py-2.5 shadow shadow-muted-7/40">
          <Tent color="#454545" width={24} strokeWidth={1.5} />
          <Text className="font-urbanist text-xs">Stays</Text>
        </View>
        {/* Trips */}
        <View className="w-[5.5rem] items-center justify-center pt-2.5 shadow shadow-muted-7/40">
          <Sailboat color="#8c8c8c" width={24} strokeWidth={1.5} />
          <Text className="font-urbanist text-xs text-muted-8">Trips</Text>
        </View>
        {/* agents */}
        <View className="w-[5.5rem] items-center justify-center pt-2.5 shadow shadow-muted-7/40">
          <Handshake color="#8c8c8c" width={24} strokeWidth={1.5} />
          <Text className="font-urbanist text-xs text-muted-8">Agents</Text>
        </View>
        {/* services */}
        <View className="w-[5.5rem] items-center justify-center pt-2.5 shadow shadow-muted-7/40">
          <ConciergeBell color="#8c8c8c" width={24} strokeWidth={1.5} />
          <Text className="font-urbanist text-xs text-muted-8">Services</Text>
        </View>
      </View>
    </View>
  );
};
