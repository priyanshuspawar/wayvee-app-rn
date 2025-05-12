import { useNavigation } from '@react-navigation/native';
import { Car } from 'lucide-react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NavProp } from '../../types';
import { Option } from '../ProfileScreen';

const Menu = () => {
  const navigation = useNavigation<NavProp>();
  const options = [
    {
      label: 'Switch to traveller',
      icon: Car,
      onPress: () => {
        navigation.replace('Home');
      },
    },
  ];
  return (
    <SafeAreaView className="flex-1 px-4 pt-5">
      <Text className="mb-8 font-UrbanistSemiBold text-3xl">
        Agent Panel Menu
      </Text>
      {options.map((v) => (
        <Option
          title={v.label}
          Icon={v.icon}
          onPress={v.onPress}
          key={v.label}
        />
      ))}
    </SafeAreaView>
  );
};

export default Menu;
