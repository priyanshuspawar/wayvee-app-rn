import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { X, Check } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';

import StayCard from '~/components/StayCard';
import { NavProp } from '~/src/navigation/types';
import { Stay } from '~/utils/responseTypes';

// Icons for highlights
const Peaceful = (props: any) => (
  <View className="items-center justify-center rounded-full bg-blue-100 p-2">
    <Text {...props} className="font-urbanistBold text-xl text-blue-600">
      🍃
    </Text>
  </View>
);

const Unique = (props: any) => (
  <View className="items-center justify-center rounded-full bg-purple-100 p-2">
    <Text {...props} className="font-urbanistBold text-xl text-purple-600">
      💎
    </Text>
  </View>
);

const FamilyFriendly = (props: any) => (
  <View className="items-center justify-center rounded-full bg-green-100 p-2">
    <Text {...props} className="font-urbanistBold text-xl text-green-600">
      👨‍👩‍👧‍👦
    </Text>
  </View>
);

const Stylish = (props: any) => (
  <View className="items-center justify-center rounded-full bg-pink-100 p-2">
    <Text {...props} className="font-urbanistBold text-xl text-pink-600">
      ✨
    </Text>
  </View>
);

const Central = (props: any) => (
  <View className="items-center justify-center rounded-full bg-yellow-100 p-2">
    <Text {...props} className="font-urbanistBold text-xl text-yellow-600">
      🏙️
    </Text>
  </View>
);

const Spacious = (props: any) => (
  <View className="items-center justify-center rounded-full bg-orange-100 p-2">
    <Text {...props} className="font-urbanistBold text-xl text-orange-600">
      🏡
    </Text>
  </View>
);

const HIGHLIGHTS = [
  { id: 'peaceful', title: 'Peaceful', Icon: Peaceful },
  { id: 'unique', title: 'Unique', Icon: Unique },
  { id: 'family-friendly', title: 'Family-friendly', Icon: FamilyFriendly },
  { id: 'stylish', title: 'Stylish', Icon: Stylish },
  { id: 'central', title: 'Central', Icon: Central },
  { id: 'spacious', title: 'Spacious', Icon: Spacious },
];

interface AiSuggestionsModalProps {
  visible: boolean;
  onClose: () => void;
  allStays?: Stay[];
}

const AiSuggestionsModal: React.FC<AiSuggestionsModalProps> = ({
  visible,
  onClose,
  allStays = [],
}) => {
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
  const [suggestedStays, setSuggestedStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavProp>();

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setSelectedPerks([]);
      setSuggestedStays([]);
      setShowResults(false);

      // Start animation
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate out
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, modalAnimation]);

  const handlePerkSelection = (perkId: string) => {
    setSelectedPerks((prevSelected) => {
      // If already selected, remove it
      if (prevSelected.includes(perkId)) {
        return prevSelected.filter((id) => id !== perkId);
      }

      // If not selected and we have less than 2 perks, add it
      if (prevSelected.length < 2) {
        return [...prevSelected, perkId];
      }

      // If we already have 2 perks, replace the first one
      return [prevSelected[1], perkId];
    });
  };

  const handleGetSuggestions = () => {
    if (selectedPerks.length === 0) {
      Alert.alert(
        'Selection Required',
        'Please select at least one highlight.'
      );
      return;
    }

    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // Filter stays based on selected perks
      // In a real app, this would be an API call to backend
      const filteredStays = allStays.filter((stay) => {
        // This is a simplified filter that would normally match perks/tags from the backend
        // For demo purposes, we're matching some random stays
        const perksMatched = stay.perks?.some((perk) =>
          selectedPerks.some((selectedPerk) =>
            perk.toLowerCase().includes(selectedPerk.toLowerCase())
          )
        );

        // If no perks match directly, use pseudo-random selection based on stay ID
        // This ensures we always show some results
        const pseudoRandom = stay.id.charCodeAt(0) % 3 === 0;

        return perksMatched || pseudoRandom;
      });

      // Limit to 5 suggestions for better UX
      setSuggestedStays(filteredStays.slice(0, 5));
      setIsLoading(false);
      setShowResults(true);
    }, 1500);
  };

  const handleSelectStay = (stay: Stay) => {
    navigation.navigate('Stay', { stay });
    onClose();
  };

  const handleClose = () => {
    // Animate out and then call the parent onClose
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      // Reset state
      setSelectedPerks([]);
      setSuggestedStays([]);
      setShowResults(false);
    });
  };

  // Render perks selection screen
  const renderPerksSelection = () => (
    <View className="px-4 py-6">
      <Text className="mb-2 font-urbanistBold text-xl">
        What are you looking for?
      </Text>
      <Text className="mb-6 font-urbanist text-sm text-gray-500">
        Select up to 2 highlights and we'll find perfect stays for you
      </Text>

      <View className="mb-8 flex-row flex-wrap justify-between">
        {HIGHLIGHTS.map((highlight) => {
          const isSelected = selectedPerks.includes(highlight.id);
          const Icon = highlight.Icon;

          return (
            <TouchableOpacity
              key={highlight.id}
              onPress={() => handlePerkSelection(highlight.id)}
              className={`mb-4 w-[30%] rounded-xl p-3 ${
                isSelected
                  ? 'bg-primary/10 border-primary border'
                  : 'bg-neutral-n30'
              }`}>
              <View className="items-center">
                <Icon color={isSelected ? '#454545' : '#8c8c8c'} />
                <Text
                  className={`mt-2 font-urbanist text-sm ${
                    isSelected
                      ? 'text-primary font-urbanistBold'
                      : 'text-gray-700'
                  }`}>
                  {highlight.title}
                </Text>
                {isSelected && (
                  <View className="bg-primary absolute -right-1 -top-1 rounded-full p-1">
                    <Check size={12} color="#fff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={handleGetSuggestions}
        className="bg-primary items-center rounded-xl py-4">
        <Text className="font-urbanistBold text-base text-white">
          Get AI Suggestions
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render results screen
  const renderResults = () => (
    <View className="flex-1 px-4 py-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="font-urbanistBold text-xl">AI Suggestions</Text>
        <TouchableOpacity
          onPress={() => setShowResults(false)}
          className="rounded-full bg-neutral-n30 p-2">
          <Text className="font-urbanist text-xs">Change Selection</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center py-10">
          <ActivityIndicator size="large" color="#454545" />
          <Text className="mt-2 font-urbanist text-sm text-gray-500">
            Finding perfect stays for you...
          </Text>
        </View>
      ) : suggestedStays.length > 0 ? (
        <FlatList
          data={suggestedStays}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectStay(item)}>
              <View className="mb-4 rounded-xl bg-white p-3 shadow-sm">
                <View className="flex-row">
                  {item.displayImages && item.displayImages[0] ? (
                    <View className="h-20 w-20 overflow-hidden rounded-lg">
                      <View className="absolute inset-0 z-10 bg-black opacity-10" />
                      <Text className="absolute bottom-1 right-1 z-20 font-urbanistBold text-xs text-white">
                        {item.displayImages.length}+
                      </Text>
                      <View className="bg-primary/80 absolute left-1 top-1 z-20 rounded-full px-2 py-0.5">
                        <Text className="font-urbanistBold text-xs text-white">
                          {item.rating ? `${item.rating}★` : 'New'}
                        </Text>
                      </View>
                      <View className="h-full w-full">
                        <Image
                          source={{ uri: item.displayImages[0].imageUrl }}
                          className="h-full w-full"
                          resizeMode="cover"
                        />
                      </View>
                    </View>
                  ) : (
                    <View className="h-20 w-20 rounded-lg bg-gray-200" />
                  )}

                  <View className="ml-3 flex-1 justify-between">
                    <View>
                      <Text
                        className="font-urbanistBold text-base"
                        numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text
                        className="font-urbanist text-xs text-gray-500"
                        numberOfLines={1}>
                        {item.perks?.slice(0, 2).join(' • ')}
                      </Text>
                    </View>
                    <Text className="font-urbanistBold">
                      ${item.pricePerNight}/night
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="font-urbanistBold text-base text-gray-500">
                No matching stays found
              </Text>
            </View>
          }
        />
      ) : (
        <View className="items-center justify-center py-10">
          <Text className="font-urbanistBold text-base text-gray-500">
            No matching stays found
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}>
      <Animated.View
        className="flex-1 bg-black/30"
        style={{
          opacity: modalAnimation,
        }}>
        <TouchableOpacity
          className="absolute h-full w-full"
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          className="m-4 mt-32 max-h-[80%] overflow-hidden rounded-xl bg-white shadow-lg"
          style={{
            transform: [
              {
                translateY: modalAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          }}>
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
            <Text className="font-urbanistBold text-lg">
              AI Stay Suggestions
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={20} color="#454545" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {showResults ? renderResults() : renderPerksSelection()}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default AiSuggestionsModal;
