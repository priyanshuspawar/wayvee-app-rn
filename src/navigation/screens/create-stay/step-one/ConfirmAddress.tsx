import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated from 'react-native-reanimated';

import { updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import InputField from '~/components/ui/InputField';
import { useListingStore } from '~/store/useListingStore';
import userStore from '~/store/user';
import { countries_regions } from '~/utils/constants';

const ConfirmAddress = () => {
  const { stay, setTabNum } = useListingStore();
  const { control, setValue } = useFormContext();
  const { user_region_code } = userStore();
  const [code, setCode] = useState<string | null>(user_region_code);
  const found = countries_regions.find(
    (v) => v.code.toLowerCase() === code?.toLowerCase()
  );
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  useEffect(() => {
    setValue('country_region', found?.code);
  }, [user_region_code]);
  const mapRef = useRef<MapView | null>(null);
  const { currentTab: tabNum } = stay;
  const { mutateAsync: setUpdate, isPending } = useMutation({
    mutationFn: updateStay,
  });
  const update = async () => {
    try {
      const { createdAt, updatedAt, ...updateData } = stay;
      await setUpdate({
        updateStay: {
          ...updateData,
          currentTab: updateData.currentTab + 1,
        },
      });
      setTabNum(tabNum + 1);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      }
      Alert.alert('Failed to send update try again later');
    }
  };
  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 1 : 1);
  return (
    <View className="flex-1">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        className="bg-neutral-n0 px-4">
        <Text className="font-UrbanistSemiBold text-4xl text-muted-10">
          Confirm Your Address
        </Text>
        <Text className="font-UrbanistMedium text-xl text-muted-8">
          Your address is only shared with your guest after they make
          reservation
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
                    {found?.name ?? countries_regions[0].name} -{' '}
                    {found?.code ?? countries_regions[0].code}
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
            provider={PROVIDER_GOOGLE}
            // todo
            region={{
              longitude: stay.location?.x!,
              latitude: stay.location?.y!,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            style={{
              height: 300,
              width: '100%',
              borderRadius: 15,
            }}>
            {stay.location?.x && (
              <Marker
                coordinate={{
                  latitude: stay.location?.y!,
                  longitude: stay.location?.x!,
                }}
              />
            )}
          </MapView>
        </View>
      </KeyboardAwareScrollView>
      <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>
    </View>
  );
};

export default ConfirmAddress;
