import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';
export function GradientText({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  return (
    <MaskedView
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
      maskElement={<Text className={className}>{text}</Text>}>
      <LinearGradient
        style={{
          width: '100%',
          height: '100%',
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['red', 'blue']}
      />
    </MaskedView>
  );
}

export default GradientText;
