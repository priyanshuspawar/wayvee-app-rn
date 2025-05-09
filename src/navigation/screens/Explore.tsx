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
import React, { Dispatch, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import { useStore } from 'zustand';

import { RootStackParamList } from '../types';

import StayCard from '~/components/StayCard';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '~/store/auth';
import { dataStays } from '~/utils/constants';
import { vh, vw } from '~/utils/dimensions';

// import { Container } from '~/components/Container';
type NavProp = NativeStackNavigationProp<RootStackParamList>;
const Explore = () => {
  const navigation = useNavigation<NavProp>();
  const [active, setActive] = useState(0);
  return (
    <SafeAreaView className="flex-1 bg-neutral-n10 pt-10">
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Header num={active} setNum={setActive} />}
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

const Header = ({
  num,
  setNum,
}: {
  num: number;
  setNum: Dispatch<React.SetStateAction<number>>;
}) => {
  const store = React.useContext(AuthContext);
  const loggedUser = useStore(store!, (s) => s.user);
  const navigation = useNavigation<NavProp>();

  // Tab configuration
  const tabs = [
    { id: 0, icon: Tent, label: 'Stays' },
    { id: 1, icon: Sailboat, label: 'Trips' },
    { id: 2, icon: Handshake, label: 'Agents' },
    { id: 3, icon: ConciergeBell, label: 'Services' },
  ];

  return (
    <View className="mb-4 flex flex-1 gap-4 bg-neutral-n10 px-4">
      {/* Greetings and avatar */}
      <View className="flex w-full flex-row items-center justify-between">
        <View className="flex-row">
          <Text className="font-urbanistBold text-2xl">Hello 👋 </Text>
          <Text className="font-urbanist text-2xl">
            {loggedUser?.firstname} {loggedUser?.lastname}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate('Profile');
          }}>
          <Image
            className="h-12 w-12 rounded-full"
            source={{
              uri: loggedUser?.picture
                ? loggedUser.picture
                : 'https://static.vecteezy.com/system/resources/previews/001/840/618/large_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg',
            }}
          />
        </Pressable>
      </View>

      {/* Search button */}
      <View className="flex h-14 w-full flex-row items-center shadow shadow-muted-4/40">
        <TextInput
          onChange={() => {}}
          placeholder="Search here"
          className="h-full w-full rounded-[2rem] bg-neutral-n30 px-4 font-urbanist"
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

      {/* Tabs */}
      <View className="flex flex-row items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = num === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              className={`w-[5.5rem] items-center justify-center pt-2.5 shadow shadow-muted-4/40 ${
                isActive ? 'border-primary border-b' : ''
              }`}
              onPress={() => setNum(tab.id)}>
              <Icon
                color={isActive ? '#454545' : '#8c8c8c'}
                width={24}
                strokeWidth={1.5}
              />
              <Text
                className={`font-urbanist text-xs ${
                  isActive ? 'text-primary' : 'text-muted-8'
                }`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
