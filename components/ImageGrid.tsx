import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import z from 'zod';

import { useListingStore } from '~/store/useListingStore';

type UploadedPicture = {
  id: string;
  url: string;
  type?: string;
};

interface ImageGridProps {
  maxPhotos?: number;
}

const uploadedPictureSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  type: z.string().optional(),
});

const uploadedPicturesSchema = z.array(uploadedPictureSchema);

const ImageGrid: React.FC<ImageGridProps> = ({ maxPhotos = 5 }) => {
  const { uploadedPictures } = useListingStore();
  const result = uploadedPicturesSchema.parse(uploadedPictures);
  const remainingSlots = Math.max(0, maxPhotos - result.length);
  const placeholders = Array(remainingSlots).fill(null);

  // Define the combined data type explicitly
  const data: (UploadedPicture | null)[] = [...result, ...placeholders];

  return (
    <View className="flex-1 px-4 pt-4">
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <Text className="font-UrbanistSemiBold text-4xl">
              Choose at least 5 photos
            </Text>
            <Text className="mb-3 font-UrbanistMedium text-lg text-gray-500">
              Drag to reorder
            </Text>
          </View>
        )}
        data={data}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (item) {
            return (
              <View className="relative m-[1%] aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  source={{ uri: item.url }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                {index === 0 && (
                  <View className="absolute left-2 top-2 rounded bg-white px-2 py-0.5">
                    <Text className="text-xs font-semibold">Cover Photo</Text>
                  </View>
                )}
              </View>
            );
          } else {
            return (
              <TouchableOpacity
                className="m-[1%] aspect-video w-full items-center justify-center rounded-xl bg-gray-100"
                onPress={() => {}}>
                <Ionicons name="image-outline" size={32} color="#aaa" />
              </TouchableOpacity>
            );
          }
        }}
      />
    </View>
  );
};

export default ImageGrid;
