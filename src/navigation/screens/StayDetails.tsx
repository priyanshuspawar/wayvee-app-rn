import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  BedDouble,
  Heart,
  Share,
  Star,
  TreePalmIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, Image, Dimensions, Pressable } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AmenityIcon from '~/components/AmenitiesIcon';
import { amenityKeys } from '~/utils/constants';
const { width, height } = Dimensions.get('window');

const data = {
  id: 'cd00a274-45bc-42cf-9dff-626d84f59624',
  hostId: '938a8057-5528-4da4-962b-bc32b86ef836',
  title: 'La vista Villa',
  address: 'Entire cabin at Khurptal India',
  location: {
    x: 77.03006,
    y: 28.610226,
  },
  displayImages: [
    'https://a0.muscache.com/im/pictures/9533b6e3-a37e-4346-98d8-baeb58fc7718.jpg?im_w=1200',
    'https://a0.muscache.com/im/ml/photo_enhancement/pictures/f0ea4cba-c771-41b6-92c5-caa646edb513.jpg?im_w=720',
    'https://a0.muscache.com/im/ml/photo_enhancement/pictures/miso/Hosting-23780166/original/484e7ed5-2e36-4f29-baa7-1c06c47f94c7.jpeg?im_w=720',
    'https://a0.muscache.com/im/ml/photo_enhancement/pictures/f0ea4cba-c771-41b6-92c5-caa646edb513.jpg?im_w=720',
  ],
  roomsDescription: [
    {
      id: 'Oxsaqmd',
      roomName: 'Bedroom 1',
      images: [
        {
          key: 'sdasc',
          url: 'https://a0.muscache.com/im/ml/photo_enhancement/pictures/miso/Hosting-23780166/original/365774f1-239d-4db5-9e81-68bd37587e28.jpeg?im_w=1200',
        },
        {
          key: 'asdcc',
          url: 'https://a0.muscache.com/im/pictures/miso/Hosting-23780166/original/65869c50-1e6f-44b8-aa42-30dcb7975994.jpeg?im_w=1200',
        },
      ],
    },
    {
      id: 'OxsaLmd',
      roomName: 'Bedroom 2',
      bedtype: 'Double Bed',
      bathroom_included: true,
      images: [
        {
          key: 'xMasc',
          url: 'https://a0.muscache.com/im/pictures/miso/Hosting-23780166/original/3cc9b72f-9e92-4269-84c3-d710201d6e7a.jpeg?im_w=720',
        },
        {
          key: 'msxlo',
          url: 'https://a0.muscache.com/im/pictures/3b6d2b71-6b68-467d-9e1f-1660eb2cc7b5.jpg?im_w=1200',
        },
        {
          key: 'xxxas',
          url: 'https://a0.muscache.com/im/pictures/470334fe-73e8-4256-9a5e-1270b94439b6.jpg?im_w=720',
        },
      ],
    },
  ],
  perks: ['Parkfree', 'Beautiful Views', 'Luxurias Space'],
  baseGuest: 6,
  pricePerNight: '4500.00',
  perPersonIncrement: '1000.00',
  maxOccupancy: 12,
  amenities: ['Washroom', 'Pool', 'BBQ Grll', 'Lawn'],
  availability: true,
  keyPoints: {
    houseRules: [
      {
        key: '6844cccee',
        rule: 'No Music after 10PM',
      },
    ],
    thingsToRemeber: [
      {
        key: 'askj7uhjb',
        rule: 'Please come before 4pm because it will be less crowded there',
      },
    ],
    tips: [
      {
        key: '466bbc',
        tip: 'Bring cold weather friendly cloths',
      },
      {
        key: 'o66bbc',
        tip: 'Get tumbler for cold water stay hydrated',
      },
    ],
  },
  rating: '0.00',
  discount: '10.00',
  createdAt: '2025-04-20T13:23:49.151Z',
  updatedAt: '2025-04-20T13:23:49.151Z',
};

const StaysScreen = () => {
  const { top } = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(1);
  const targetDate = dayjs(data.createdAt);
  const isNew = targetDate.isAfter(dayjs().subtract(1, 'month'));
  const heightOfCarousel = height * 0.33;
  const bottomCTAHeight = height * 0.08;
  const navigation = useNavigation();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const headerAnimatedStyle = useAnimatedStyle(() => {
    // const shadow = interpolate(scrollY.value, [0, 40], [0, 10]);
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 80],
      ['#00000000', '#fbfafe'] // from transparent to purple
    );
    return { backgroundColor };
  });
  return (
    <View className="relative flex-1">
      {/* navigation top */}
      <Animated.View
        sharedTransitionTag="sharedTag"
        // className={clsx('absolute z-10 w-full flex-row justify-between px-2')}
        style={[
          {
            paddingTop: top + 30,
            top: 0,
            paddingBottom: 10,
            alignItems: 'flex-end',
            position: 'absolute',
            width: '100%',
            zIndex: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
            shadowColor: '#45454540',
          },
          headerAnimatedStyle,
        ]}>
        <Pressable
          onPress={() => {
            // router.back();
            navigation.goBack();
          }}
          className="h-fit rounded-full bg-muted-2 p-2">
          <ArrowLeft color="#262626" size={18} />
        </Pressable>

        <View className="flex-row gap-2">
          <View className="h-fit rounded-full bg-muted-2 p-2">
            <Share color="#262626" size={18} />
          </View>

          <View className="h-fit rounded-full bg-muted-2 p-2">
            <Heart color="#262626" size={18} />
          </View>
        </View>
      </Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="relative flex-1 bg-neutral-n20">
        {/* carousel */}
        <View className="absolute top-0 z-10">
          <Carousel
            width={width}
            height={height * 0.35}
            loop
            autoPlay={false}
            data={data.displayImages}
            onScrollEnd={(i) => setCurrentIndex(i + 1)}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  console.log('pressed car');
                }}
                style={{
                  flex: 1,
                  overflow: 'hidden',
                }}>
                <Image
                  source={{ uri: item }}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              </Pressable>
            )}
          />
          {/* pagination */}
          <View className="absolute bottom-10 right-4 rounded-md bg-muted-9/80 px-2">
            <Text className="font-urbanist text-sm tracking-wider text-muted-2">
              {currentIndex}/{data.displayImages.length}
            </Text>
          </View>
        </View>
        <View
          style={{ zIndex: 10, marginTop: height * 0.325 }}
          className="w-full flex-1 items-center gap-2 overflow-hidden rounded-3xl bg-neutral-n20 p-7">
          <Text className="font-UrbanistSemiBold text-2xl text-muted-10 antialiased">
            {data.title}
          </Text>
          <View className="items-center">
            <Text className="font-urbanist text-muted-8">{data.address}</Text>
            <Text className="font-urbanist text-muted-8">
              {data.baseGuest} Guests • {data.perks.join(', ')}
            </Text>
          </View>
          {isNew && (
            <View className="flex-row items-center gap-1">
              <Star fill="#454545" color="#454545" size={12} />
              <Text className="font-urbanist text-sm text-muted-9">New</Text>
            </View>
          )}
          {/* host info */}
          <View className="my-1 w-full flex-row items-center gap-4 border-y border-muted-8/20 py-2">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFjZXxlbnwwfHwwfHx8Mg%3D%3D',
              }}
              className="h-12 w-12 rounded-full"
            />
            <View className="flex-grow">
              <Text className="font-urbanist text-muted-10">
                Hosted by Amit
              </Text>
              <Text className="font-urbanist text-muted-8">
                1 month hosting
              </Text>
            </View>
          </View>
          {/* perks */}
          <View className="flex-row items-center gap-4 border-b border-muted-8/20">
            <View className="h-12 w-12 items-center justify-center">
              <TreePalmIcon strokeWidth={1.5} color="#454545" />
            </View>
            <View className="flex-grow">
              <Text className="font-urbanist text-muted-10">
                1-min walk to lake
              </Text>
              <Text className="font-urbanist text-muted-8">Dive right in</Text>
            </View>
          </View>
          <View className="my-4 flex w-full flex-col gap-y-4 pb-2">
            {/* description */}
            <View className="w-full border-b border-muted-8/20 py-2">
              <Text className="font-UrbanistSemiBold text-xl text-muted-10">
                About the place
              </Text>

              <Text className="line-clamp-4 font-UrbanistMedium">
                Make some memories at this unique place with friends and family
              </Text>
            </View>
            {/* where u sleep */}
            <View className="w-full gap-2 border-b border-muted-8/20 py-2">
              <Text className="font-UrbanistSemiBold text-xl text-muted-10">
                Where you'll sleep
              </Text>

              <View className="h-40 w-48 justify-between rounded-xl border border-muted-8/20 px-4 py-8">
                <BedDouble color="#454545" size={24} strokeWidth={1.5} />
                <View className="gap-1">
                  <Text className="font-urbanistBold text-xl text-muted-10">
                    Bedroom
                  </Text>
                  <Text className="font-urbanist text-muted-8">
                    1 Queen Sized
                  </Text>
                </View>
              </View>
            </View>
            {/* amenities */}
            <View className="w-full gap-2 border-b border-muted-8/20 py-2">
              <Text className="font-UrbanistSemiBold text-xl text-muted-10">
                What this place offers
              </Text>
              {amenityKeys.slice(0, 5).map((v) => (
                <View key={v} className="flex-row items-center gap-4">
                  <AmenityIcon name={v} color="#454545" size={35} />
                  <Text className="font-UrbanistMedium text-lg">{v}</Text>
                </View>
              ))}
              {amenityKeys.length > 5 && (
                <View className="w-full items-center rounded-lg border p-4 text-muted-8">
                  <Text className="font-urbanistBold text-lg text-muted-10">
                    Show All {amenityKeys.length} amenities
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      <BottomCTA />
    </View>
  );
};

export default StaysScreen;

const BottomCTA = () => {
  return (
    <View className="h-28 w-full flex-row items-center justify-between bg-neutral-n20 px-4 shadow shadow-muted-7/40">
      <View className="">
        <Text className="font-urbanistBold text-xl text-muted-12">
          INR 4500
        </Text>
        <Text>{data.baseGuest} Guests</Text>
      </View>
      <Pressable
        onPress={() => {}}
        className="h-14 w-40 items-center justify-center rounded-[2rem] bg-primary-normal">
        <Text className="font-UrbanistSemiBold text-lg text-muted-2">
          Reserve
        </Text>
      </Pressable>
    </View>
  );
};
