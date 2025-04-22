import { Shadow, RoundedRect, Canvas } from '@shopify/react-native-skia';
import { Pressable, Dimensions, Text } from 'react-native';
// import { Neomorph } from 'react-native-neomorph-shadows';
const PillButton = ({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) => {
  const { height, width } = Dimensions.get('window');
  const newW = width * 0.45;
  const newH = height * 0.065;
  return (
    <Pressable
      onPress={onPress}
      className="relative flex items-center justify-center"
      style={{
        width: newW,
      }}>
      <Canvas style={{ width: newW, height: newH }}>
        <RoundedRect
          x={0}
          y={0}
          width={newW}
          height={newH}
          r={32}
          color="#171717">
          <Shadow dx={0.5} dy={0.8} blur={19} color="#866CBD20" inner />
          <Shadow dx={-0.5} dy={-0.8} blur={19} color="#866CBD20" inner />
        </RoundedRect>
      </Canvas>
      <Text className="absolute font-UrbanistSemiBold text-lg text-muted-2">
        {title}
      </Text>
    </Pressable>
  );
};

export default PillButton;
