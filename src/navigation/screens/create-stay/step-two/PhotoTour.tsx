import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { getValueFromSecureStore, updateStay } from '~/apis/auth';
import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';

interface UploadResponse {
  data: {
    id: string;
    imgUrl: string;
  }[];
}

const PhotoTour = () => {
  const [uploading, setUploading] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  const { stay, setTabNum, setDisplayImages } = useListingStore();
  const { currentTab: tabNum, displayImages, bedrooms } = stay;

  const { mutateAsync: setUpdate, isPending } = useMutation({
    mutationFn: updateStay,
  });

  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!res.canceled && res.assets?.length) {
      const uris = res.assets.map((a) => a.uri);
      await handleUpload(uris);
    }
  };

  const handleUpload = async (selectedImages: string[]) => {
    try {
      setUploading(true);
      const formData = new FormData();

      await Promise.all(
        selectedImages.map(async (uri, index) => {
          const filename = uri.split('/').pop() || `image-${index}.jpg`;
          const fileType = filename.split('.').pop()?.toLowerCase() || 'jpg';

          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (!fileInfo.exists) return;

          const file = {
            uri,
            name: filename,
            type: `image/${fileType}`,
          };

          formData.append('files', file as any);
        })
      );

      const token = await getValueFromSecureStore('token');

      const response = await axios.post<UploadResponse>(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const structuredImages = response.data.data.map((e) => ({
        id: e.id,
        imageUrl: e.imgUrl,
        type: '',
      }));

      setDisplayImages([...displayImages, ...structuredImages]);
      Alert.alert('Success', 'Images uploaded successfully.');
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert('Error', 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const updateImageType = (index: number, type: string) => {
    const updated = [...displayImages];
    if (updated[index]) {
      updated[index].type = type;
      setDisplayImages(updated);
    }
  };

  const typeOptions = [
    { label: 'Cover', value: 'cover' },
    ...Array.from({ length: bedrooms ?? 1 }, (_, i) => ({
      label: `Bedroom ${i + 1}`,
      value: `bedroom${i + 1}`,
    })),
  ];

  const update = async () => {
    try {
      const { createdAt, updatedAt, ...updateData } = stay;
      console.log(updateData);
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
      Alert.alert('Failed to send update. Try again later.');
    }
  };

  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 2 : 1);

  return (
    <View className="flex-1">
      <View className="flex-1 px-4 pt-4">
        <FlatList
          ListHeaderComponent={() => (
            <View className="mb-4">
              <Text className="font-UrbanistSemiBold text-4xl">
                Choose at least 5 photos
              </Text>
              <Text className="mb-3 font-UrbanistMedium text-lg text-gray-500">
                Tag each image by type. Tap below to upload more.
              </Text>

              <TouchableOpacity
                onPress={pickImages}
                className="mb-4 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 py-4">
                {uploading ? (
                  <ActivityIndicator />
                ) : (
                  <>
                    <Ionicons name="image-outline" size={32} color="#aaa" />
                    <Text className="font-UrbanistMedium text-gray-500">
                      Upload photos
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
          data={displayImages}
          extraData={openDropdownIndex}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const isOpen = openDropdownIndex === index;
            return (
              <View className="relative mb-4 aspect-video w-full rounded-xl border border-muted-6/40 pb-1 shadow shadow-muted-8/45">
                {item.type.length > 0 && (
                  <View className="absolute left-2 top-2 z-50 rounded-lg bg-muted-2 p-2">
                    <Text>{item.type}</Text>
                  </View>
                )}
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                <View className="absolute right-2 top-2 z-20 flex items-end justify-end">
                  <TouchableOpacity
                    onPress={() => {
                      setOpenDropdownIndex(isOpen ? null : index);
                    }}
                    className="rounded-full bg-white p-2 shadow">
                    <Ionicons name="ellipsis-vertical" size={18} color="#000" />
                  </TouchableOpacity>

                  {isOpen && (
                    <View className="absolute top-10 w-32 rounded-lg bg-white">
                      {typeOptions.map((v) => (
                        <Pressable
                          onPress={() => {
                            updateImageType(index, v.value);

                            setOpenDropdownIndex(null);
                          }}
                          key={v.value}
                          className="px-2 py-1">
                          <Text>{v.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>

      <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={update} isLoading={isPending} />
      </View>
    </View>
  );
};

export default PhotoTour;
