// src/components/AmenityIcon.tsx
import React from 'react';
import { Text } from 'react-native';

import AmenityIconMap, { AmenityIcons } from '../utils/amenityIcon';

type AmenityIconProps = {
  name: string;
  size?: number;
  color?: string;
};

const AmenityIcon: React.FC<AmenityIconProps> = ({
  name,
  size = 24,
  color = '#000',
}) => {
  const Icon = AmenityIconMap[name];

  if (!Icon) {
    return <Text>Unknown Amenity</Text>;
  }

  return <Icon width={size} height={size} stroke={color} color="#fff" />;
};

export default AmenityIcon;
