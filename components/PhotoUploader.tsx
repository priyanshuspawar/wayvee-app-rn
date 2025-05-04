import ImagesIcon from '@Assets/images-icon.svg';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';

import { useListingStore } from '~/store/useListingStore';
import { UploadResponse } from '~/utils/responseTypes';

export default function PhotoUploadDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { addPictures, setTabNum } = useListingStore();
  const [uploading, setUploading] = useState(false);
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ✅ Updated
      allowsMultipleSelection: true, // ✅ Allows multiple images
      quality: 1,
    });

    if (!result.canceled) {
      // Handle multiple images (assets is an array)
      const uris = result.assets.map((asset) => asset.uri);
      setSelectedImages(uris); // This should be an array of URIs
    }
  };
  const handleUpload = async () => {
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
      // return;
      const response = await axios.post<UploadResponse>(
        'http://192.168.1.73:5000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload successful:', response.data.data);
      const structuredImages = response.data.data.map((e) => ({
        id: e.id,
        url: e.imgUrl,
      }));

      addPictures(structuredImages);
      setTabNum(13);
      Alert.alert('Success', 'Images uploaded successfully.');
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert('Error', 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View className="rounded-xl bg-white p-5">
        <View className="mb-4 items-center">
          <Text className="text-xl font-bold">Upload photos</Text>
          <Text className="mt-1 text-sm text-muted-8">
            {selectedImages.length
              ? `${selectedImages.length} selected`
              : 'No items selected'}
          </Text>
        </View>

        <Pressable
          onPress={pickImages}
          className="items-center rounded-lg border-2 border-dashed border-muted-4 p-8">
          {/* Replace this with your own image icon */}
          <ImagesIcon width={40} height={40} />
          {/* <Text className="mt-2 text-lg font-semibold">Drag and drop</Text>
          <Text className="text-muted-7">or browse for photos</Text> */}

          <View className="mt-4 rounded-md bg-black px-4 py-2">
            <Text className="text-white">Browse</Text>
          </View>
        </Pressable>
        {selectedImages.length > 0 && (
          <ScrollView horizontal className="mt-4">
            {selectedImages.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                className="mr-2 h-32 w-32 rounded-lg"
              />
            ))}
          </ScrollView>
        )}

        <View className="mt-6 flex-row justify-between">
          <Pressable onPress={onClose}>
            <Text className="text-lg text-black">Done</Text>
          </Pressable>
          <Pressable
            onPress={handleUpload}
            disabled={!selectedImages.length || uploading}
            className={`rounded-md px-4 py-2 ${
              selectedImages.length ? 'bg-black' : 'bg-gray-300'
            }`}>
            {uploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white">Upload</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
