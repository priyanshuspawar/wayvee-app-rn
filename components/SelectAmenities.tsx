import clsx from 'clsx';
import { View, Text, FlatList, Pressable } from 'react-native';

import AmenityIcon from './AmenitiesIcon';

import { amenities } from '~/utils/constants';

const StepTwoTabTwo = ({
  selectedType,
  setSelectedType,
}: {
  selectedType: string[];
  setSelectedType: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const toggleAmenity = (id: string) => {
    setSelectedType((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View className="relative gap-4 bg-neutral-n0 px-4" style={{ flex: 1 }}>
      <FlatList
        className="h-full w-full"
        ListHeaderComponent={() => (
          <View className="mb-4 gap-2">
            <Text className="font-urbanistBold text-4xl">
              Tell guests what your place has to offer
            </Text>
            <Text className="font-UrbanistSemiBold text-xl text-muted-8/80">
              You can add more amenities after you publish your listing.
            </Text>
          </View>
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={amenities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedType.includes(item.id);

          return (
            <Pressable
              onPress={() => toggleAmenity(item.id)}
              className="w-1/2 p-1">
              <View
                className={clsx(
                  'h-32 gap-2 rounded-md border p-3',
                  isSelected ? 'border-primary' : 'border-muted-6/40'
                )}>
                <AmenityIcon size={40} name={item.id} />
                <Text className="font-urbanistSemiBold text-lg text-muted-10">
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

export default StepTwoTabTwo;
