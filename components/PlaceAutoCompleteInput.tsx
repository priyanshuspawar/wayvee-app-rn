import axios from 'axios';
import debounce from 'lodash.debounce';
import { X } from 'lucide-react-native';
import { nanoid } from 'nanoid';
import { useState, useCallback } from 'react';
import { UseFieldArrayAppend } from 'react-hook-form';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import Button from './ui/Button';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text?: string;
  };
}

interface Place {
  description: string;
  location: { lat: number; lng: number };
  address: string;
}

type Append = UseFieldArrayAppend<
  {
    agencyName: string;
    about: string;
    services: string[];
    servicesLocation: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    }[];
  },
  'servicesLocation'
>;

interface Props {
  placeholder?: string;
  append: Append;
}

export default function CustomPlacesAutocomplete({
  placeholder = 'Search location...',
  append,
}: Props) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);

  const onSelect = (place: Place) => {
    setCurrentPlace(place);
  };
  const fetchPredictions = useCallback(
    debounce(async (input: string) => {
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
        setPredictions(response.data.predictions);
      } catch (error) {
        console.error('Prediction error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (text.length > 1) {
      fetchPredictions(text);
    } else {
      setPredictions([]);
    }
  };

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
      const result = res.data.result;
      onSelect({
        description,
        location: result.geometry.location,
        address: result.formatted_address,
      });
      setQuery(description);
      setPredictions([]);
    } catch (err) {
      console.error('Place details error:', err);
    }
  };

  const clearInput = () => {
    setQuery('');
    setPredictions([]);
  };

  return (
    <View className="items-center">
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={query}
            scrollEnabled
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          {query.length > 0 && !loading && (
            <TouchableOpacity onPress={clearInput} style={styles.icon}>
              <X size={18} color="#999" />
            </TouchableOpacity>
          )}
          {loading && <ActivityIndicator size="small" style={styles.icon} />}
        </View>

        {predictions.length > 0 && (
          <FlatList
            style={styles.dropdown}
            keyboardShouldPersistTaps="handled"
            data={predictions}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item.place_id, item.description)}>
                <Text
                  style={styles.mainText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.structured_formatting.main_text}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      {currentPlace && (
        <Button
          label="Add"
          onPress={() => {
            append({
              id: nanoid(5),
              name: query,
              latitude: currentPlace.location.lat,
              longitude: currentPlace.location.lng,
            });
            setCurrentPlace(null);
            setQuery('');
          }}
          className="mt-8 w-1/2"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // marginBottom: 16,
    zIndex: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#161616',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfbfbf',
    paddingRight: 36,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#fff',
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  dropdown: {
    backgroundColor: '#222222',
    zIndex: 100,
    position: 'absolute',
    top: '100%',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfbfbf30',
    shadowColor: '#cacaca30',
    shadowOffset: { height: 2, width: 2 },
    marginTop: 4,
    maxHeight: 200,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf30',
  },
  mainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f5f5f5',
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
