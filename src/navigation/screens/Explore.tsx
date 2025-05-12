import Pool from '@Assets/amenities/Pool.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import {
  Tent,
  TentTree,
  Handshake,
  Star,
  Sparkles,
  X,
  Search,
  LucideShowerHead,
} from 'lucide-react-native';
import React, {
  Dispatch,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  Keyboard,
} from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import { useStore } from 'zustand';

import { RootStackParamList } from '../types';

import { getStays } from '~/apis/auth';
import { searchStays } from '~/apis/stays';
import AiSuggestionsModal from '~/components/AISuggestion';
import StayCard from '~/components/StayCard';
import { AuthContext } from '~/store/auth';
import { vh, vw } from '~/utils/dimensions';
import { Stay } from '~/utils/responseTypes';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const Explore = () => {
  const navigation = useNavigation<NavProp>();
  const [active, setActive] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAiSuggestionsModal, setShowAiSuggestionsModal] = useState(false);
  const searchModalAnimation = useRef(new Animated.Value(0)).current;

  // Use react-query for both normal stays and search results
  const { data: allStays, isLoading: allStaysLoading } = useQuery({
    queryKey: ['stays'],
    queryFn: getStays,
  });

  const [searchResults, setSearchResults] = useState<Stay[] | null>(null);

  // Filter stays based on active tab index
  const filteredStays = useMemo(() => {
    if (!allStays) return [];

    // If we're searching, don't apply tab filters
    if (searchQuery.trim() && searchResults !== null) {
      return searchResults;
    }

    switch (active) {
      case 0: // Featured
        return allStays; // Show all stays for Featured tab
      case 1: // Farms
        return allStays.filter((stay) => stay.typeOfStay === 'Farm');
      case 2: // Pool
        return allStays.filter(
          (stay) => stay.amenities && stay.amenities.includes('Pool')
        );
      case 3: // New
        // Assuming we have a createdAt field or similar to determine new stays
        // Sort by date and take the newest ones (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return allStays
          .filter(
            (stay) =>
              stay.createdAt && new Date(stay.createdAt) >= thirtyDaysAgo
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      default:
        return allStays;
    }
  }, [allStays, active, searchQuery, searchResults]);

  // Debounced search function - improved implementation
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim()) {
          setSearchResults(null);
          setSearchLoading(false);
          return;
        }

        try {
          const result = await searchStays(query);
          if (result && Array.isArray(result.data)) {
            setSearchResults(result.data);
          } else {
            console.warn('Search returned unexpected data format:', result);
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
          Alert.alert(
            'Search Error',
            'There was a problem with your search. Please try again.'
          );
        } finally {
          setSearchLoading(false);
        }
      }, 300), // Reduced debounce time for more responsive in-modal searching
    []
  );

  // Show search modal animation
  const showSearchModalWithAnimation = useCallback(() => {
    setShowSearchModal(true);
    Animated.timing(searchModalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [searchModalAnimation]);

  // Hide search modal animation
  const hideSearchModalWithAnimation = useCallback(() => {
    Animated.timing(searchModalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSearchModal(false);
    });
  }, [searchModalAnimation]);

  // Handle search input changes
  const handleSearch = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (text.trim()) {
        setSearchLoading(true);
        showSearchModalWithAnimation();
      } else {
        setSearchResults(null);
        setSearchLoading(false);
        hideSearchModalWithAnimation();
      }
      debouncedSearch(text);
    },
    [
      debouncedSearch,
      showSearchModalWithAnimation,
      hideSearchModalWithAnimation,
    ]
  );

  // Cleanup the debounce function when component unmounts
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle selecting an item from search results
  const handleSelectSearchItem = useCallback(
    (item: Stay) => {
      console.log(item);
      navigation.navigate('Stay', { stay: item });
      hideSearchModalWithAnimation();
      Keyboard.dismiss();
    },
    [navigation, hideSearchModalWithAnimation]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults(null);
    hideSearchModalWithAnimation();
    Keyboard.dismiss();
  }, [hideSearchModalWithAnimation]);

  // Function to handle AI suggestions
  const handleAiSuggestions = () => {
    setShowAiSuggestionsModal(true);
    Alert.alert(
      'AI Suggestions',
      'This feature will suggest stays based on your preferences and history.'
    );
  };

  // Use our filtered data
  const displayData = filteredStays;
  const isLoading = searchLoading || allStaysLoading;

  // Content for the empty state
  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-10">
      <Text className="font-urbanistBold text-xl text-muted-8">
        {searchQuery.trim()
          ? 'No stays found for your search'
          : active === 1
            ? 'No farm stays available'
            : active === 2
              ? 'No stays with pools available'
              : active === 3
                ? 'No new stays available'
                : 'No stays available'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-n10 pt-10">
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Header
            num={active}
            setNum={setActive}
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onAiSuggestionPress={handleAiSuggestions}
          />
        }
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={false}
        className="bg-transparent"
        data={displayData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StayCard
            key={item.id}
            baseGuest={item.baseGuest}
            image={item.displayImages[0]?.imageUrl}
            perks={item.perks}
            price={item.pricePerNight!}
            rating={item.rating}
            title={item.title!}
            onPress={() => {
              navigation.navigate('Stay', { stay: item });
            }}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            renderEmptyState()
          )
        }
      />

      {/* Search Results Modal */}
      <Modal
        visible={showSearchModal}
        transparent
        animationType="none"
        onRequestClose={clearSearch}>
        <Animated.View
          className="flex-1 bg-black/30"
          style={{
            opacity: searchModalAnimation,
          }}>
          <TouchableOpacity
            className="absolute h-full w-full"
            activeOpacity={1}
            onPress={clearSearch}
          />

          <Animated.View
            className="absolute top-32 mx-4 w-[92%] rounded-xl bg-white shadow-lg shadow-gray-400"
            style={{
              transform: [
                {
                  translateY: searchModalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}>
            {/* Search input inside modal */}
            <View className="flex-row items-center justify-between border-b border-gray-100 p-3">
              <View className="flex-1 flex-row items-center rounded-lg bg-neutral-n30 px-3 py-2">
                <Search size={16} color="#666" />
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearch}
                  placeholder="Continue searching..."
                  className="ml-2 flex-1 font-urbanist"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={clearSearch}>
                    <X size={16} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={clearSearch}
                className="ml-2 rounded-full p-1">
                <X size={18} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Results list */}
            {searchLoading ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" />
              </View>
            ) : searchResults && searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                className="max-h-96"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="border-b border-gray-100 p-4"
                    onPress={() => handleSelectSearchItem(item)}>
                    <View className="flex-row items-center">
                      {item.displayImages && item.displayImages[0] ? (
                        <Image
                          source={{ uri: item.displayImages[0].imageUrl }}
                          className="h-12 w-12 rounded-md"
                        />
                      ) : (
                        <View className="h-12 w-12 rounded-md bg-gray-200" />
                      )}
                      <View className="ml-3 flex-1">
                        <Text className="font-urbanistBold text-base">
                          {item.title}
                        </Text>
                        <Text className="font-urbanist text-xs text-gray-500">
                          {item.pricePerNight
                            ? `${item.pricePerNight}/night`
                            : ''}
                          {item.rating ? ` • ${item.rating}★` : ''}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : searchResults && searchResults.length === 0 ? (
              <View className="items-center justify-center py-10">
                <Text className="font-urbanistBold text-base text-gray-500">
                  No results found
                </Text>
              </View>
            ) : null}
          </Animated.View>
        </Animated.View>
      </Modal>
      {/* AI Suggestions Modal */}
      <AiSuggestionsModal
        visible={showAiSuggestionsModal}
        onClose={() => setShowAiSuggestionsModal(false)}
        allStays={allStays}
      />
    </SafeAreaView>
  );
};

export default Explore;

const Header = ({
  num,
  setNum,
  searchQuery,
  onSearchChange,
  onAiSuggestionPress,
}: {
  num: number;
  setNum: Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onAiSuggestionPress: () => void;
}) => {
  const store = React.useContext(AuthContext);
  const loggedUser = useStore(store!, (s) => s.user);
  const navigation = useNavigation<NavProp>();

  // Tab configuration
  const tabs = [
    { id: 0, icon: Tent, label: 'Featured' },
    { id: 1, icon: TentTree, label: 'Farms' },
    { id: 2, icon: LucideShowerHead, label: 'Pool' },
    { id: 3, icon: Star, label: 'New' },
  ];

  return (
    <View className="mb-4 flex flex-1 gap-4 bg-neutral-n10 px-4">
      {/* Greetings and avatar */}
      <View className="flex w-full flex-row items-center justify-between">
        <View className="flex-row">
          <Text className="font-urbanistBold text-2xl">Hello 👋 </Text>
          <Text className="font-urbanist text-2xl">
            {loggedUser?.firstname} {loggedUser?.lastname}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate('Profile');
          }}>
          <Image
            className="h-12 w-12 rounded-full"
            source={{
              uri: loggedUser?.picture
                ? loggedUser.picture
                : 'https://static.vecteezy.com/system/resources/previews/001/840/618/large_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg',
            }}
          />
        </Pressable>
      </View>

      {/* Search box */}
      <View className="flex h-14 w-full flex-row items-center shadow shadow-muted-4/40">
        <View className="relative flex-1">
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search by title or perks"
            className="h-full w-full rounded-[2rem] bg-neutral-n30 px-4 font-urbanist"
            keyboardType="web-search"
            onFocus={() => {
              if (searchQuery.trim()) {
                showSearchModalWithAnimation();
              }
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              className="absolute right-4 top-4"
              onPress={() => onSearchChange('')}>
              <X size={20} color="#8c8c8c" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={onAiSuggestionPress}
          className="absolute right-2 flex flex-row items-center overflow-hidden rounded-3xl">
          <Canvas style={{ width: vw(125), height: vh(35) }}>
            <Rect x={0} y={0} width={vw(125)} height={vh(35)}>
              <LinearGradient
                start={vec(0, 20)}
                end={vec(60, 80)}
                colors={['#a787ec', '#7ef186']}
              />
            </Rect>
          </Canvas>
          <View className="absolute flex w-full flex-row items-center justify-evenly">
            <Sparkles color="#fff" width={14} />
            <Text className="font-urbanistBold text-muted-2">
              Ai Suggestions
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex flex-row items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = num === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              className={`w-[5.5rem] items-center justify-center pt-2.5 shadow shadow-muted-4/40 ${
                isActive ? 'border-primary border-b' : ''
              }`}
              onPress={() => setNum(tab.id)}>
              <Icon
                color={isActive ? '#454545' : '#8c8c8c'}
                width={24}
                strokeWidth={1.5}
              />
              <Text
                className={`font-urbanist text-xs ${
                  isActive ? 'text-primary' : 'text-muted-8'
                }`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
