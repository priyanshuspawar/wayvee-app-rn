import { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';

import PhotoUploadDrawer from './PhotoUploader';

const PhotoAddition = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <View className="flex-1 px-4">
      <View className="mb-4 gap-1">
        <Text className="font-urbanistBold text-4xl">
          Add some photos of your flat/apartment
        </Text>
        <Text className="font-UrbanistSemiBold text-xl text-muted-8/80">
          You'll need 5 photos to get started. You can add more or make changes
          later.
        </Text>
      </View>
      <View className="aspect-square w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-4 bg-[#f7f7f7]">
        <Image
          source={{
            uri: 'https://a0.muscache.com/im/pictures/mediaverse/mys-amenities-n8/original/c83b2a87-3be4-43c9-ad47-12dd2aee24c4.jpeg',
          }}
          style={{
            width: '70%',
            height: '70%',
          }}
          resizeMode="cover"
        />
        <Pressable
          onPress={() => setShowDrawer(true)}
          className="rounded-md border border-muted-10 bg-white px-8 py-2">
          <Text className="font-UrbanistMedium text-lg">Add Photos</Text>
        </Pressable>
      </View>
      <PhotoUploadDrawer
        isVisible={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
    </View>
  );
};

export default PhotoAddition;
