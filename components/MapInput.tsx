import MyLocation from '@Assets/my-location.svg';
import clsx from 'clsx';
import * as Location from 'expo-location';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  Dispatch,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TextInputProps,
  Pressable,
  Alert,
} from 'react-native';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import MapView, { Marker, Region, PROVIDER_DEFAULT } from 'react-native-maps';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';

import { useListingStore } from '~/store/useListingStore';
import userStore from '~/store/user';

const MapInput = ({
  isInputFocused,
  setIsInputFocus,
  marker,
  setMarker,
}: {
  isInputFocused: 'active' | null;
  setIsInputFocus: Dispatch<React.SetStateAction<'active' | null>>;
  marker: {
    latitude: number;
    longitude: number;
  } | null;
  setMarker: Dispatch<
    React.SetStateAction<{
      latitude: number;
      longitude: number;
    } | null>
  >;
}) => {
  const { setAddressMarker, setRegion: setStoreRegion } = useListingStore();
  const { user_location } = userStore();
  const [region, setRegion] = useState<Region>({
    latitude: user_location?.y ?? 120,
    longitude: user_location?.x ?? -120,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef<MapView | null>(null);

  // Get current location
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location is denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    inputRef.current?.blur();

    const newRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setMarker({ latitude, longitude });
    setAddressMarker({ latitude, longitude });

    setRegion(newRegion);
    setStoreRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);

    // ✅ Reverse geocode
    const addressArray = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    const address = addressArray?.[0];

    if (address) {
      const fullAddress = `${address.name ?? ''} ${address.street ?? ''}, ${address.city ?? ''}, ${address.region ?? ''}, ${address.postalCode ?? ''}, ${address.country ?? ''}`;

      // ✅ Set value to GooglePlacesAutocomplete input
      inputRef.current?.setAddressText(fullAddress);
    }
    setIsInputFocus(null);
  };
  const inputRef = useRef<GooglePlacesAutocompleteRef | null>(null);

  const [hasText, setHasText] = useState('');
  const getInitialRegion = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const newRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
  };
  useEffect(() => {
    getInitialRegion();
  }, []);
  return (
    <View className="relative flex-1">
      {isInputFocused ? (
        <Animated.View className="mb-8 flex w-full flex-row items-center justify-between px-4">
          <Pressable
            onPress={() => {
              inputRef.current?.blur();
              setIsInputFocus(null);
            }}>
            <ChevronLeft color="#262626" size={30} />
          </Pressable>
          <Text className="font-UrbanistSemiBold text-2xl text-muted-10">
            Enter your address
          </Text>
          <View className="w-8" />
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeIn.duration(300).easing(Easing.inOut(Easing.quad))}
          exiting={FadeOutUp.duration(300).easing(Easing.inOut(Easing.quad))}
          className="mb-8 px-4">
          <Text className="font-UrbanistSemiBold text-4xl text-muted-10">
            Where's your place located ?
          </Text>
          <Text className="font-UrbanistMedium text-xl text-muted-8">
            Your address is only shared with your guest after they make
            reservation
          </Text>
        </Animated.View>
      )}
      <View className="relative flex-1">
        <GooglePlacesAutocomplete
          ref={inputRef}
          placeholder="Enter your address"
          fetchDetails
          onFail={() => {
            Alert.alert('Failed to initilize location');
          }}
          onPress={(data, details = null) => {
            const lat = details?.geometry.location.lat;
            const lng = details?.geometry.location.lng;

            if (lat && lng) {
              const newRegion: Region = {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };

              setMarker({ latitude: lat, longitude: lng });
              setAddressMarker({ latitude: lat, longitude: lng });

              setRegion(newRegion);
              setStoreRegion(newRegion);
              mapRef.current?.animateToRegion(newRegion, 1000);
            }
            setIsInputFocus(null);
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY!,
            language: 'en',
          }}
          debounce={500}
          textInputProps={{
            InputComp: CustomInput,
            onFocus: () => setIsInputFocus('active'),
            onBlur: () => setIsInputFocus(null),
            isInputFocused,
            onChangeText: (t) => setHasText(t),
          }}
          styles={{
            container: {
              position: 'absolute',
              top: 25,
              zIndex: 1,
              paddingHorizontal: 20,
            },
            powered: {
              width: '100%',
              backgroundColor: 'white',
            },
            listView: {
              width: '100%',
            },
            poweredContainer: {
              backgroundColor: 'white',
              width: '100%',
            },
          }}
        />

        {isInputFocused === 'active' && hasText.length === 0 && (
          <View className="top-32 w-full px-6">
            <TouchableOpacity
              className="flex flex-row items-center gap-2"
              onPress={getCurrentLocation}>
              <View className="rounded-md bg-muted-4 p-2">
                <MyLocation width={32} height={32} />
              </View>
              <Text className="font-UrbanistMedium text-lg">
                Use my current location
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isInputFocused !== 'active' && (
          <Animated.View
            entering={FadeInDown.duration(300).easing(
              Easing.inOut(Easing.quad)
            )}
            exiting={FadeOutUp.duration(500).easing(Easing.inOut(Easing.quad))}
            className="flex-1">
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              region={region}
              showsUserLocation
              provider={PROVIDER_DEFAULT}
              showsMyLocationButton={false}
              onPress={async (e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;

                const newRegion = {
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };

                setRegion(newRegion);
                setMarker({ latitude, longitude });
                const addressArray = await Location.reverseGeocodeAsync({
                  latitude,
                  longitude,
                });
                const address = addressArray?.[0];

                if (address) {
                  const fullAddress = `${address.name ?? ''} ${address.street ?? ''}, ${address.city ?? ''}, ${address.region ?? ''}, ${address.postalCode ?? ''}, ${address.country ?? ''}`;

                  // ✅ Set value to GooglePlacesAutocomplete input
                  inputRef.current?.setAddressText(fullAddress);
                }
                mapRef.current?.animateToRegion(newRegion, 1000);
              }}>
              {marker && <Marker coordinate={marker} />}
            </MapView>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const CustomInput = forwardRef<
  TextInput,
  TextInputProps & { isInputFocused?: boolean }
>(({ isInputFocused, ...props }, ref) => {
  return (
    <View
      className={clsx(
        'flex h-16 w-full flex-row items-center overflow-hidden rounded-[2rem] bg-muted-1 px-2',
        { 'border-2 border-muted-10': isInputFocused }
      )}>
      <MapPin size={24} stroke="#262626" />
      <TextInput
        ref={ref}
        {...props}
        placeholderTextColor="#262626"
        className="font-UrbanistSemiBold"
        style={{
          height: '100%',
          width: '95%',
          paddingHorizontal: 5,
        }}
      />
    </View>
  );
});

CustomInput.displayName = 'CustomInput';

export default MapInput;
