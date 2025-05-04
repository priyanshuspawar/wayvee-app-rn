// import SharedRoomIcon from '@Assets/stepone-3-home.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useEvent } from 'expo';
import * as Location from 'expo-location';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { Control, Controller, useForm, UseFormSetValue } from 'react-hook-form';
import { View, Text, Image, DimensionValue, Pressable } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Marker } from 'react-native-maps';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import z from 'zod';

import ImageGrid from '~/components/ImageGrid';
import MapInput from '~/components/MapInput';
import PhotoAddition from '~/components/PhotoAddition';
import PlaceIcon from '~/components/PlacesIcon';
import PropertyBasicsTab from '~/components/PropertyBasic';
import StepTwoTabTwo from '~/components/SelectAmenities';
import StepTwoTabOne from '~/components/StepTwo';
import Button from '~/components/ui/Button';
import InputField from '~/components/ui/InputField';
import { useListingStore } from '~/store/useListingStore';
import userStore from '~/store/user';
import {
  countries_regions,
  PLACE_TYPES,
  PROPERTY_TYPES,
} from '~/utils/constants';
import { vh, vw } from '~/utils/dimensions';

const CreateStayScreen = () => {
  const { tabNum, setTabNum, setAddress } = useListingStore();
  const { top, bottom } = useSafeAreaInsets();
  // const [tabNum, setTabNum] = useState(12);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPropertyType, setPropertyType] = useState<string | null>(null);
  const [locationInputFocus, setLocationInputFocus] = useState<'active' | null>(
    null
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm({
    defaultValues: {
      flat_or_house: '',
      country_region: '',
      city: '',
      district: '',
      landmark: '',
      pincode: '',
      state: '',
      streetAddress: '',
    },
    resolver: zodResolver(
      z.object({
        flat_or_house: z.string().min(2).max(40),
        country_region: z.string().min(1).max(3),
        streetAddress: z.string().min(5).max(50),
        landmark: z.string().max(30),
        district: z.string().min(2).max(30),
        city: z.string().min(2).max(30),
        state: z.string().min(2).max(30),
        pincode: z.string().min(4).max(8),
      })
    ),
  });
  // console.log(errors);
  return (
    <View
      className="h-screen flex-1 flex-col bg-neutral-n0"
      style={{
        paddingTop: top,
      }}>
      {tabNum === 0 && (
        <View className="mb-8 flex flex-row justify-between px-4">
          <PillButton title="Exit" />
        </View>
      )}
      {tabNum > 0 && (
        <View className="mb-8 flex flex-row justify-between px-4">
          <PillButton title="Save & Exit" />
          <PillButton title="Questions ?" />
        </View>
      )}

      {tabNum === 0 && <InitialTab />}
      {tabNum === 1 && <StepOneTabOne />}
      {tabNum === 2 && (
        <StepOneTabTwo
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      )}
      {tabNum === 3 && (
        <StepOneTabThree
          selectedPropertyType={selectedPropertyType}
          setPropertyType={setPropertyType}
        />
      )}
      {tabNum === 4 && (
        <View className="flex-1">
          <MapInput
            isInputFocused={locationInputFocus}
            setIsInputFocus={setLocationInputFocus}
            marker={marker}
            setMarker={setMarker}
          />
        </View>
      )}
      {tabNum === 5 && (
        <StepOneTabFive marker={marker} control={control} setValue={setValue} />
      )}
      {tabNum === 6 && <PropertyBasicsTab />}
      {tabNum === 10 && <StepTwoTabOne />}
      {tabNum === 11 && (
        <StepTwoTabTwo
          selectedType={selectedAmenities}
          setSelectedType={setSelectedAmenities}
        />
      )}
      {tabNum === 12 && <PhotoAddition />}
      {tabNum === 13 && <ImageGrid maxPhotos={5} />}
      {/* bottom control */}
      {!locationInputFocus && (
        <View
          className="relative w-full border-t border-muted-8/15 bg-neutral-n0"
          style={{
            paddingVertical: bottom < 10 ? 20 : bottom,
          }}>
          {tabNum === 1 && (
            <StepProgressor progress1="0%" progress2="0%" progress3="0%" />
          )}
          {tabNum === 2 && (
            <StepProgressor progress1="33%" progress2="0%" progress3="0%" />
          )}
          {tabNum === 3 && (
            <StepProgressor progress1="45%" progress2="0%" progress3="0%" />
          )}
          {tabNum === 4 && (
            <StepProgressor progress1="65%" progress2="0%" progress3="0%" />
          )}
          {tabNum === 5 && (
            <StepProgressor progress1="78%" progress2="0%" progress3="0%" />
          )}
          {tabNum === 6 && (
            <StepProgressor progress1="85%" progress2="0%" progress3="0%" />
          )}
          {tabNum === 10 && (
            <StepProgressor progress1="100%" progress2="0%" progress3="0%" />
          )}
          {tabNum === 11 && (
            <StepProgressor progress1="100%" progress2="25%" progress3="0%" />
          )}
          {tabNum === 12 && (
            <StepProgressor progress1="100%" progress2="45%" progress3="0%" />
          )}
          {tabNum === 13 && (
            <StepProgressor progress1="100%" progress2="55%" progress3="0%" />
          )}

          <View className="w-screen flex-row px-4">
            {tabNum === 0 && (
              <Button
                label="Get Started"
                className="w-full"
                onPress={() => {
                  setTabNum(1);
                }}
              />
            )}
            {tabNum === 1 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  onPress={() => {
                    setTabNum(2);
                  }}
                />
              </View>
            )}
            {tabNum === 2 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  disabled={selectedType == null}
                  onPress={() => {
                    // if(s)
                    setTabNum(3);
                  }}
                />
              </View>
            )}
            {tabNum === 3 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  disabled={selectedPropertyType == null}
                  onPress={() => {
                    // if(s)
                    setTabNum(4);
                  }}
                />
              </View>
            )}
            {tabNum === 4 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  disabled={marker == null}
                  onPress={() => {
                    setTabNum(5);
                  }}
                />
              </View>
            )}
            {tabNum === 5 && (
              <View className="w-full flex-row items-center justify-between">
                <Pressable onPress={() => setTabNum(tabNum - 1)}>
                  <Text className="font-bold text-muted-10 underline">
                    Back
                  </Text>
                </Pressable>
                <Button
                  label="Next"
                  // disabled={isValid == null}
                  onPress={handleSubmit((data) => {
                    setAddress(data);
                    setTabNum(6);
                  })}
                />
              </View>
            )}
            {tabNum === 6 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  // disabled={marker == null}
                  onPress={() => {
                    setTabNum(10);
                  }}
                />
              </View>
            )}
            {tabNum === 10 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  // disabled={marker == null}
                  onPress={() => {
                    setTabNum(11);
                  }}
                />
              </View>
            )}
            {tabNum === 11 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  // disabled={marker == null}
                  onPress={() => {
                    setTabNum(12);
                  }}
                />
              </View>
            )}
            {tabNum === 12 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  // disabled={marker == null}
                  onPress={() => {
                    setTabNum(13);
                  }}
                />
              </View>
            )}
            {tabNum === 13 && (
              <View className="w-full flex-row items-center justify-between">
                <Text className="font-bold text-muted-10 underline">Back</Text>
                <Button
                  label="Next"
                  // disabled={marker == null}
                  onPress={() => {
                    setTabNum(14);
                  }}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default CreateStayScreen;

const InitialTab = () => {
  return (
    <View className="flex-grow justify-around px-4">
      <Text className="font-UrbanistSemiBold text-[2.5rem] leading-none">
        It's easy to get started on WayVee
      </Text>
      {/* pointer */}
      <View className="flex flex-row items-center justify-between">
        <View className=" w-3/4">
          <Text className="font-UrbanistSemiBold text-2xl">
            1 Tell us about your place
          </Text>
          <Text className="font-UrbanistMedium text-xl text-muted-8">
            Share more basic info, such as where it is and how many guests can
            stay
          </Text>
        </View>
        <Image
          source={require('@Assets/bed.png')}
          className="h-16 w-20 flex-shrink-0 shadow shadow-muted-8/60"
          resizeMode="contain"
        />
      </View>
      {/* pointer */}
      <View className="flex flex-row items-center justify-between">
        <View className=" w-3/4">
          <Text className="font-UrbanistSemiBold text-2xl">
            2 Make it stand out
          </Text>
          <Text className="font-UrbanistMedium text-xl text-muted-8">
            Add 5 or more photos plus a little description - we'll help you out.
          </Text>
        </View>
        <Image
          source={require('@Assets/wardrobe.png')}
          className="h-16 w-20 flex-shrink-0 shadow shadow-muted-8/60"
          resizeMode="contain"
        />
      </View>
      {/* pointer */}
      <View className="flex flex-row items-center justify-between">
        <View className="w-3/4">
          <Text className="font-UrbanistSemiBold text-2xl">
            3 Finish and publish
          </Text>
          <Text className="font-UrbanistMedium text-xl text-muted-8">
            Choose a starting price, verify a few details, then publish it
          </Text>
        </View>
        <Image
          source={require('@Assets/standing.png')}
          className="h-16 w-20 flex-shrink-0 shadow shadow-muted-8/60"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
const StepOneTabOne = () => {
  const videoSource = require('@Assets/stepone.mp4');
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  return (
    <View className="flex-grow bg-neutral-n0">
      {/* asset */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <VideoView
          nativeControls={false}
          style={{
            width: vw(320),
            height: vh(300),
          }}
          player={player}
        />
      </View>
      <View className="gap-4 px-4">
        <Text className="font-UrbanistSemiBold text-2xl text-muted-10">
          Step 1
        </Text>
        <Text className="w-[80%] font-urbanistBold text-[2.5rem] leading-[1] text-muted-10">
          Tell us about your place
        </Text>
        <Text className="font-UrbanistMedium text-[1.3rem] leading-normal text-muted-9">
          In this step, we'll ask you which type of property you have and if
          guests will book the entire place or just a room. Then let us know the
          location and how many guests can stay.
        </Text>
      </View>
    </View>
  );
};

const StepOneTabTwo = ({
  selectedType,
  setSelectedType,
}: {
  selectedType: string | null;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <View className="relative gap-4 bg-neutral-n0 px-4" style={{ flex: 1 }}>
      <FlatList
        className="h-full w-full"
        ListHeaderComponent={() => (
          <Text className="mb-4 font-urbanistBold text-4xl">
            Which of the best describes your place?
          </Text>
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={PLACE_TYPES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedType === item.id;

          return (
            <Pressable
              onPress={() => setSelectedType(item.id)}
              className="w-1/2 p-1">
              <View
                className={clsx(
                  'h-32 gap-2 rounded-md border p-3',
                  isSelected ? 'border-primary' : 'border-muted-6/40'
                )}>
                <PlaceIcon size={40} name={item.id} />
                <Text className="font-UrbanistSemiBold text-lg text-muted-10">
                  {item.title}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};
const StepOneTabThree = ({
  selectedPropertyType,
  setPropertyType,
}: {
  selectedPropertyType: string | null;
  setPropertyType: Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <View className="flex-1 bg-neutral-n0 px-4">
      <Text className="mb-8 font-urbanistBold text-4xl">
        What type of place the guests will have?
      </Text>
      <FlatList
        data={PROPERTY_TYPES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const Icon = item.icon;
          const isSelected = selectedPropertyType === item.id;
          return (
            <Pressable
              onPress={() => {
                setPropertyType(item.id);
              }}
              className={clsx(
                'mb-4 flex-1 flex-row justify-between rounded-lg border p-4',
                isSelected ? 'border-primary' : 'border-muted-6/40'
              )}>
              <View className="w-[85%] gap-1">
                <Text className="font-UrbanistSemiBold text-[1.35rem] text-muted-10">
                  {item.title}
                </Text>
                <Text className="font-UrbanistMedium text-[1.22rem] leading-normal text-muted-8">
                  {item.sub}
                </Text>
              </View>
              <Icon width={40} height={40} className="flex-shrink-0" />
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const StepOneTabFive = ({
  marker,
  control,
  setValue,
}: {
  marker: {
    latitude: number;
    longitude: number;
  } | null;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
}) => {
  const { user_region_code, user_location } = userStore();
  const { region, addressMarker } = useListingStore();
  const getCode = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return;
    }
    const { coords } = await Location.getCurrentPositionAsync({});
    const [place] = await Location.reverseGeocodeAsync(coords);
    setCode(place.isoCountryCode ?? null);
    setValue('country_region', place.isoCountryCode ?? null);
  };
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    // remove
    getCode();
  }, []);
  const found = countries_regions.find(
    (v) => v.code.toLowerCase() === code?.toLowerCase()
  );
  const [isSelectorOpen, setSelectorOpen] = useState(false);

  const mapRef = useRef<MapView | null>(null);
  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} className="bg-neutral-n0 px-4">
      <Text className="font-UrbanistSemiBold text-4xl text-muted-10">
        Confirm Your Address
      </Text>
      <Text className="font-UrbanistMedium text-xl text-muted-8">
        Your address is only shared with your guest after they make reservation
      </Text>
      <View className="my-8 flex-1 gap-4">
        <Controller
          control={control}
          name="country_region"
          render={({ field }) => (
            <View className="relative">
              <Pressable
                onPress={() => {
                  setSelectorOpen(!isSelectorOpen);
                }}
                className={clsx(
                  'relative flex h-[6vh] w-full flex-row items-center justify-between rounded-lg border-muted-10 px-2',
                  { 'border-[1.2px]': isSelectorOpen },
                  { 'border-[0.5px]': !isSelectorOpen }
                )}>
                <Text className="font-UrbanistMedium text-xl">
                  {found?.name} - {found?.code}
                </Text>
                {!isSelectorOpen ? (
                  <ChevronDown color="#262626" />
                ) : (
                  <ChevronUp color="#262626" />
                )}
              </Pressable>
              {isSelectorOpen && (
                <Animated.View className="absolute -bottom-[38.5vh] z-20 h-[38vh] w-full rounded-lg bg-muted-2 shadow shadow-muted-5">
                  <FlatList
                    data={countries_regions}
                    keyExtractor={(v) => v.code}
                    renderItem={({ item }) => (
                      <Pressable
                        disabled={field.disabled}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        onPress={() => {
                          field.onChange(item.code);
                          // setValue('country_region', item.code);
                          setCode(item.code);
                          setSelectorOpen(false);
                        }}
                        className="border-b border-muted-4 px-2 py-4">
                        <Text>
                          {item.name} - {item.code}
                        </Text>
                      </Pressable>
                    )}
                  />
                </Animated.View>
              )}
            </View>
          )}
        />
        <View>
          <InputField
            label="Flat, House, etc. (if applicable)"
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: false,
              autoComplete: 'address-line1',
            }}
            placeholder="Flat, House, etc"
            name="flat_or_house"
            control={control}
            first
          />
          <InputField
            label="Street address"
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: false,
              autoComplete: 'street-address',
            }}
            placeholder="Street address"
            name="streetAddress"
            control={control}
            straight
          />
          <InputField
            label="Nearby landmark (if applicable)"
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: false,
            }}
            placeholder="Nearby Landmark"
            name="landmark"
            control={control}
            straight
          />
          <InputField
            label="District/locality (if applicable)"
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: false,
              autoComplete: 'postal-address-locality',
            }}
            placeholder="District/locality (if applicable)"
            name="district"
            control={control}
            straight
          />
          <InputField
            label="City"
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: false,
              autoComplete: 'postal-address-region',
            }}
            placeholder="City"
            name="city"
            control={control}
            straight
          />
          <InputField
            label="State"
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: false,
              autoComplete: 'postal-address-region',
            }}
            placeholder="State"
            name="state"
            control={control}
            straight
          />
          <InputField
            label="Pincode"
            inputProps={{
              autoCapitalize: 'none',
              autoCorrect: false,
              autoComplete: 'postal-code',
            }}
            placeholder="Pincode"
            name="pincode"
            control={control}
            last
          />
        </View>
        <MapView
          ref={mapRef}
          region={region ?? undefined}
          style={{
            height: 300,
            width: '100%',
            borderRadius: 15,
          }}>
          {marker && <Marker coordinate={marker} />}
        </MapView>
      </View>
    </KeyboardAwareScrollView>
  );
};

const StepOneTabSix = () => {};

const PillButton = ({ title }: { title: string }) => {
  return (
    <View className="items-center justify-center rounded-[2rem] border border-muted-5 px-4 py-4">
      <Text className="w-fit font-UrbanistSemiBold text-muted-10">{title}</Text>
    </View>
  );
};

const StepProgressor = ({
  progress1,
  progress2,
  progress3,
}: {
  progress1: DimensionValue;
  progress2: DimensionValue;
  progress3: DimensionValue;
}) => {
  return (
    <View className="absolute top-0 flex h-1 w-full flex-row">
      <View className="flex flex-grow border-r-2 border-muted-1 bg-muted-5/70">
        <View
          style={{
            backgroundColor: '#262626',
            width: progress1,
            height: '100%',
          }}
        />
      </View>
      <View className="flex flex-grow border-r-2 border-muted-1 bg-muted-5/70">
        <View
          style={{
            backgroundColor: '#050505',
            width: progress2,
            height: '100%',
          }}
        />
      </View>
      <View className="flex flex-grow bg-muted-5/70">
        <View
          style={{
            backgroundColor: '#050505',
            width: progress3,
            height: '100%',
          }}
        />
      </View>
    </View>
  );
};
