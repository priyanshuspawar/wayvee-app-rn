import React from 'react';
import { Pressable, Text, View } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'outlined';
  className?: string;
  disabled?: boolean;
};

const Button = ({
  label,
  onPress,
  icon: Icon,
  variant = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) => {
  const isOutlined = variant === 'outlined';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        flex-row items-center justify-center rounded-xl px-4 py-3
        ${
          isOutlined
            ? 'border border-primary-normal bg-transparent'
            : 'bg-primary-normal'
        }
        ${className}
      `}>
      {Icon && <View className="mr-2">{Icon}</View>}
      <Text
        className={`
          font-UrbanistSemiBold text-xl
          ${isOutlined ? 'text-primary-normal' : 'text-white'}
        `}>
        {label}
      </Text>
    </Pressable>
  );
};

export default Button;
