import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import z from 'zod';

import PlacesAutocomplete from './PlaceAutoCompleteInput';
import { MultiSelectInput } from './ServiceSelect';

import { apply_for_agent } from '~/apis/auth';
import { RootStackParamList } from '~/src/navigation/types';
import { useUserLocation } from '~/utils/hooks/useUserLocation';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const schema = z.object({
  agencyName: z.string().min(2, 'Agency name is required'),
  about: z.string().min(10, 'Tell us something about yourself'),
  services: z.array(z.string()),
  servicesLocation: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      latitude: z.number().refine((val) => !isNaN(Number(val)), {
        message: 'Latitude must be a number',
      }),
      longitude: z.number().refine((val) => !isNaN(Number(val)), {
        message: 'Longitude must be a number',
      }),
    })
  ),
});

const ApplyAgent = () => {
  const navigation = useNavigation<NavProp>();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      agencyName: '',
      about: '',
      services: [],
      servicesLocation: [],
    },
  });
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: apply_for_agent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const { location: userLocation } = useUserLocation();
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 120,
    longitude: -120,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const os = Platform.OS;
  const [modalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'servicesLocation',
  });

  useEffect(() => {
    if (userLocation) {
      setLoading(false);
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [userLocation?.latitude]);

  useEffect(() => {
    if (fields.length > 0) {
      mapRef.current?.animateToRegion({
        latitude: fields[fields.length - 1].latitude,
        longitude: fields[fields.length - 1].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [fields]);
  const onSubmit = async (values: any) => {
    try {
      const payload = {
        agencyName: values.agencyName,
        about: values.about,
        servicesOffered: values.services,
        locations: values.servicesLocation.map((loc: any) => ({
          label: loc.name,
          longitude: loc.longitude,
          latitude: loc.latitude,
        })),
      };
      await mutateAsync(payload);
      Alert.alert('Created agent profile successfully');
      navigation.navigate('AgentPanel'); // or redirect
    } catch (error) {
      if (error instanceof AxiosError) {
        setError('root', {
          message: error.response?.data?.message || 'Failed to submit form',
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={os === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#161616]">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Modal visible={modalVisible} animationType="slide">
            <SafeAreaView className="flex-1 gap-8 bg-muted-12 px-4 pt-6">
              <Pressable onPress={() => setIsModalVisible(false)}>
                <X size={24} color="#fff" />
              </Pressable>
              <View className="relative flex-1">
                <PlacesAutocomplete append={append} />
                <View className="mt-16 flex-[0.5] overflow-hidden rounded-xl">
                  <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    region={region}
                    showsUserLocation
                    provider={PROVIDER_DEFAULT}
                    showsMyLocationButton>
                    {fields.length > 0 && (
                      <Marker
                        coordinate={{
                          latitude: fields[fields.length - 1].latitude,
                          longitude: fields[fields.length - 1].longitude,
                        }}
                      />
                    )}
                  </MapView>
                  <View className="my-4 flex gap-4">
                    <Text className="font-UrbanistSemiBold text-2xl text-white">
                      Service Location
                    </Text>
                    <View className="flex flex-row flex-wrap gap-2">
                      {fields.map((v, index) => (
                        <Pressable
                          key={v.id}
                          onPress={() => {
                            mapRef.current?.animateToRegion({
                              latitude: v.latitude,
                              longitude: v.longitude,
                              latitudeDelta: 0.01,
                              longitudeDelta: 0.01,
                            });
                          }}
                          className="flex flex-row items-center gap-4 rounded-lg bg-muted-9 p-2">
                          <Text className="font-UrbanistMedium text-white">
                            {v.name.split(',')[0]}
                          </Text>
                          <Pressable
                            onPress={() => remove(index)}
                            className="rounded-full bg-muted-6 p-0.5">
                            <X size={14} color="#262626" />
                          </Pressable>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Modal>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16 }}>
            <Text className="mb-4 text-center font-urbanistBold text-2xl text-white">
              Enter your details for agent profile
            </Text>

            <Controller
              name="agencyName"
              control={control}
              render={({ field }) => (
                <TextInput
                  onChangeText={field.onChange}
                  value={field.value}
                  ref={field.ref}
                  placeholder="Enter Agency Name"
                  placeholderTextColor="#bfbfbf"
                  className="border-b border-muted-5/30 pb-2 text-white"
                />
              )}
            />
            {errors.agencyName && (
              <Text className="mt-1 text-sm text-red-400">
                {errors.agencyName.message}
              </Text>
            )}

            <Controller
              name="about"
              control={control}
              render={({ field }) => (
                <TextInput
                  onChangeText={field.onChange}
                  value={field.value}
                  ref={field.ref}
                  placeholder="About agent or agency"
                  multiline
                  placeholderTextColor="#bfbfbf"
                  className="mt-4 border-b border-muted-5/30 pb-2 text-white"
                />
              )}
            />
            {errors.about && (
              <Text className="mt-1 text-sm text-red-400">
                {errors.about.message}
              </Text>
            )}

            <View className="mt-4">
              <MultiSelectInput control={control} name="services" />
              {errors.services && (
                <Text className="mt-1 text-sm text-red-400">
                  Services are required
                </Text>
              )}
            </View>

            <Pressable
              onPress={() => setIsModalVisible(true)}
              className="mt-4 flex flex-wrap gap-1 rounded-xl border border-muted-6/30 px-2 py-4 font-UrbanistMedium">
              {fields.length > 0 ? (
                fields.map((v) => (
                  <Pressable
                    key={v.id}
                    className="rounded-lg bg-muted-8 px-2 py-1">
                    <Text className="font-UrbanistMedium text-white">
                      {v.name.split(',')[0]}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text className="text-muted-6">Select Location</Text>
              )}
            </Pressable>

            {errors.root?.message && (
              <Text className="mt-2 text-center text-red-500">
                {errors.root.message}
              </Text>
            )}

            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="mt-6 items-center rounded-xl bg-primary-normal p-3">
              <Text className="font-UrbanistSemiBold text-lg text-white">
                {isPending ? 'Submitting...' : 'Apply Now'}
              </Text>
            </Pressable>
          </ScrollView>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default ApplyAgent;
