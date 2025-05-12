import MyLocation from '@Assets/my-location.svg';
import axios from 'axios';
import clsx from 'clsx';
import * as Location from 'expo-location';
import debounce from 'lodash.debounce';
import { ChevronLeft, MapPin, X } from 'lucide-react-native';
import React, { Dispatch, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';

import { useListingStore } from '~/store/useListingStore';
import userStore from '~/store/user';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

const MapInput = ({
  isInputFocused,
  setIsInputFocus,
  marker,
  setMarker,
}: {
  isInputFocused: 'active' | null;
  setIsInputFocus: Dispatch<React.SetStateAction<'active' | null>>;
  marker: { latitude: number; longitude: number } | null;
  setMarker: Dispatch<
    React.SetStateAction<{ latitude: number; longitude: number } | null>
  >;
}) => {
  const {
    setAddressMarker,
    setRegion: setStoreRegion,
    setEnableFullMode,
    stay,
  } = useListingStore();
  const { user_location } = userStore();
  const [region, setRegion] = useState<Region>({
    latitude: marker ? marker.latitude : (user_location?.y ?? 120),
    longitude: marker ? marker.longitude : (user_location?.x ?? -120),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef<MapView | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);

  const fetchPredictions = debounce(async (input: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input,
            key: GOOGLE_API_KEY,
            language: 'en',
            components: 'country:in',
          },
        }
      );
      setPredictions(response.data.predictions || []);
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      fetchPredictions(text);
    } else {
      setPredictions([]);
    }
  };
  const setPrevious = async () => {
    if (!stay.location) {
      return;
    }
    const addressArray = await Location.reverseGeocodeAsync({
      latitude: stay.location.y,
      longitude: stay.location.x,
    });
    const address = addressArray?.[0];

    if (address) {
      const fullAddress = `${address.name ?? ''} ${address.street ?? ''}, ${address.city ?? ''}, ${address.region ?? ''}, ${address.postalCode ?? ''}, ${address.country ?? ''}`;
      setQuery(fullAddress);
    }
  };
  useEffect(() => {
    setPrevious();
  }, []);

  const handleSelect = async (placeId: string, description: string) => {
    try {
      const res = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
            fields: 'geometry,formatted_address',
          },
        }
      );
      const { lat, lng } = res.data.result.geometry.location;
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
      setQuery(description);
      setPredictions([]);
      mapRef.current?.animateToRegion(newRegion, 1000);
      setIsInputFocus(null);
      setEnableFullMode(false);
    } catch (err) {
      Alert.alert('Failed to get place details');
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

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

    const addressArray = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    const address = addressArray?.[0];

    if (address) {
      const fullAddress = `${address.name ?? ''} ${address.street ?? ''}, ${address.city ?? ''}, ${address.region ?? ''}, ${address.postalCode ?? ''}, ${address.country ?? ''}`;
      setQuery(fullAddress);
    }

    setIsInputFocus(null);
    setEnableFullMode(false);
  };
  console.log(marker);
  return (
    <View className="relative flex-1">
      {isInputFocused ? (
        <Animated.View className="mb-8 flex w-full flex-row items-center justify-between px-4">
          <Pressable
            onPress={() => {
              setIsInputFocus(null);
              setEnableFullMode(false);
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
          entering={FadeIn}
          exiting={FadeOutUp}
          className="mb-8 px-4">
          <Text className="font-UrbanistSemiBold text-4xl text-muted-10">
            Where's your place located?
          </Text>
          <Text className="font-UrbanistMedium text-xl text-muted-8">
            Your address is only shared with guests after they book.
          </Text>
        </Animated.View>
      )}

      <View className="relative z-10 mt-4 items-center">
        <View className="absolute top-4 flex w-screen items-center px-4">
          <CustomInput
            ref={inputRef}
            value={query}
            onClear={() => {
              setQuery('');
              setPredictions([]);
            }}
            loading={loading}
            onChangeText={handleChangeText}
            isInputFocused={isInputFocused === 'active'}
            onFocus={() => {
              setIsInputFocus('active');
              setEnableFullMode(true);
            }}
          />
        </View>

        {predictions.length > 0 && (
          <FlatList
            data={predictions}
            style={{
              position: 'absolute',
              top: 70,
              width: '90%',
              backgroundColor: '#fbfbfb',
              borderRadius: 10,
              zIndex: 100,
            }}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item.place_id, item.description)}
                style={{
                  padding: 14,
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                }}>
                <Text className="font-UrbanistMedium text-base">
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {isInputFocused === 'active' && query.length === 0 && (
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
          entering={FadeInDown}
          exiting={FadeOutUp}
          className="flex-1">
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            region={region}
            showsUserLocation
            provider={PROVIDER_GOOGLE}
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
              setAddressMarker({ latitude, longitude });

              const addressArray = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
              });
              const address = addressArray?.[0];

              if (address) {
                const fullAddress = `${address.name ?? ''} ${address.street ?? ''}, ${address.city ?? ''}, ${address.region ?? ''}, ${address.postalCode ?? ''}, ${address.country ?? ''}`;
                setQuery(fullAddress);
              }

              mapRef.current?.animateToRegion(newRegion, 1000);
            }}>
            {marker && <Marker coordinate={marker} />}
          </MapView>
        </Animated.View>
      )}
    </View>
  );
};

const CustomInput = React.forwardRef<
  TextInput,
  {
    value: string;
    onChangeText: (text: string) => void;
    isInputFocused: boolean;
    loading?: boolean;
    onFocus: () => void;
    onClear?: () => void; // <-- NEW
  }
>(({ value, loading, onChangeText, isInputFocused, onFocus, onClear }, ref) => {
  return (
    <View
      className={clsx(
        'flex h-16 w-full flex-row items-center overflow-hidden rounded-[2rem] bg-muted-1 px-2',
        { 'border-2 border-muted-10': isInputFocused }
      )}>
      <MapPin size={24} stroke="#262626" />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder="Enter your address"
        placeholderTextColor="#262626"
        className="font-UrbanistSemiBold"
        style={{ height: '100%', width: '85%', paddingHorizontal: 6 }}
      />
      {value.length > 2 && loading ? (
        <ActivityIndicator
          style={{ position: 'absolute', right: 20, top: 14 }}
        />
      ) : (
        <Pressable
          onPress={onClear} // <-- Attach handler
          className="flex-shrink-0 rounded-full bg-muted-4 p-1">
          <X size={16} />
        </Pressable>
      )}
    </View>
  );
});

CustomInput.displayName = 'CustomInput';

export default MapInput;
