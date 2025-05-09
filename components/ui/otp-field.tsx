import { clsx } from 'clsx';
import { Dispatch, RefObject, useState } from 'react';
import { View, Animated, TextInput } from 'react-native';

type OtpFieldProps = {
  i: number;
  code: string;
  codes: string[];
  setCodes: Dispatch<React.SetStateAction<string[]>>;
  refs: RefObject<TextInput>[];
};

const OtpField = ({ code, i, setCodes, codes, refs }: OtpFieldProps) => {
  const [errorMessages, setErrorMessages] = useState<string[]>();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleFocus = (index: number) => setFocusedIndex(index);
  const handleBlur = () => setFocusedIndex(null);

  const onChangeCode = (text: string, index: number) => {
    if (text.length > 1) {
      setErrorMessages(undefined);
      const newCodes = text.split('').slice(0, 6);
      setCodes(newCodes);
      refs[5]?.current?.focus();
      return;
    }

    setErrorMessages(undefined);
    const newCodes = [...codes];
    newCodes[index] = text;
    setCodes(newCodes);
    if (text !== '' && index < 5) {
      refs[index + 1]?.current?.focus();
    }
  };

  return (
    <Animated.View className="relative flex h-full w-8 items-center justify-center">
      <View
        className={clsx('absolute w-full bg-muted-7', {
          'h-[0.5px]': !code,
        })}
      />
      <TextInput
        enterKeyHint="next"
        inputMode="numeric"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        onChangeText={(text) => onChangeCode(text, i)}
        value={code}
        onFocus={() => handleFocus(i)}
        onBlur={handleBlur}
        className="font-UrbanistMedium"
        maxLength={1}
        ref={refs[i]}
        onKeyPress={({ nativeEvent: { key } }) => {
          if (key === 'Backspace' && i > 0 && !code) {
            refs[i - 1]?.current?.focus();
          }
        }}
      />
    </Animated.View>
  );
};

export default OtpField;
