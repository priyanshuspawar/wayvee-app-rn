import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import { View, TextInput, TextInputProps, Animated } from 'react-native';

type InputFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  control: Control<any>;
  rules?: object;
  inputProps?: TextInputProps;
  first?: boolean;
  last?: boolean;
};

const InputField = ({
  name,
  label,
  placeholder,
  control,
  first,
  last,
  rules = {},
  inputProps,
}: InputFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <InputFieldInner
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          first={first}
          last={last}
          error={error}
          value={value}
          inputProps={inputProps}
        />
      )}
    />
  );
};

type InputFieldInnerProps = {
  label: string;
  placeholder?: string;
  onChange: (text: string) => void;
  onBlur: () => void;
  value: string;
  first?: boolean;
  last?: boolean;
  error?: FieldError;
  inputProps?: TextInputProps;
};

const InputFieldInner = ({
  label,
  first,
  last,
  onChange,
  onBlur,
  error,
  value,
  inputProps,
}: InputFieldInnerProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(0)).current;

  // Animate label based on focus or value change
  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    // Animate top position from 18 to -6 and font size from 16 to 12
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 6],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
  };

  return (
    <View
      className={clsx(
        'relative flex h-[6vh] w-full justify-center px-2',
        {
          'rounded-tl-xl rounded-tr-xl': first,
          'rounded-bl-xl rounded-br-xl': last,
          'rounded-xl': !first && !last,
        },
        { 'border-[1.2px]': isFocused },
        { 'border-[0.5px]': !isFocused },
        {
          'border-muted-10': !error?.message,
          'border-red-500': error?.message,
        }
      )}>
      <View className="relative flex">
        <Animated.Text
          className={clsx(
            'absolute left-0 font-urbanist',
            {
              'text-red-500': error?.message,
              'text-muted-8': !error?.message,
            },
            isFocused && 'mb-1'
          )}
          style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          className="h-full bg-transparent font-urbanist text-base text-muted-12"
          onFocus={() => setIsFocused(true)}
          style={{ padding: 0, margin: 0 }}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          onChangeText={onChange}
          value={value}
          {...inputProps}
        />
      </View>
    </View>
  );
};

export default InputField;
