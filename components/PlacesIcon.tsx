// src/components/PlaceIcon.tsx
import React from 'react';
import { Text } from 'react-native';

import PlaceIconMap, { PlaceIcons } from '../utils/placeIcon'; // Adjust import path as needed

type PlaceIconProps = {
  name: PlaceIcons;
  size?: number;
  color?: string;
};

const PlaceIcon: React.FC<PlaceIconProps> = ({
  name,
  size = 24,
  color = '#000',
}) => {
  const Icon = PlaceIconMap[name];

  if (!Icon) {
    return <Text>Unknown Place Type</Text>;
  }

  return (
    <Icon
      width={size}
      height={size}
      stroke={color}
      color="#fff"
      strokeWidth={0.5}
    />
  );
};

export default PlaceIcon;
