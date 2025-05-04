import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { View, Text } from 'react-native';

import { vh, vw } from '~/utils/dimensions';

const StepTwoTabOne = () => {
  const videoSource = require('@Assets/steptwo.mp4');
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  return (
    <View className="flex-grow bg-neutral-n0">
      {/* asset */}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <VideoView
          nativeControls={false}
          style={{
            width: vw(350),
            height: vh(320),
            backgroundColor: 'transparent',
          }}
          player={player}
        />
      </View>
      <View className="gap-4 px-4">
        <Text className="font-UrbanistSemiBold text-2xl text-muted-10">
          Step 2
        </Text>
        <Text className="w-full font-urbanistBold text-5xl text-muted-10">
          Make your place stand out
        </Text>
        <Text className="font-UrbanistMedium text-[1.3rem] leading-normal text-muted-9">
          In this step, you’ll add some of the amenities your place offers, plus
          5 or more photos. Then you’ll create a title and description.
        </Text>
      </View>
    </View>
  );
};

export default StepTwoTabOne;
