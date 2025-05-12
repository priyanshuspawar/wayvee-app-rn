import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { View, Text, Pressable } from 'react-native';

import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';
import { vh, vw } from '~/utils/dimensions';

const StepThreeInfo = () => {
  const videoSource = require('@Assets/stepthree.mp4');
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });
  const {
    setTabNum,
    stay: { currentTab: tabNum },
  } = useListingStore();

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  const goNext = () => setTabNum(tabNum + 1);
  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 1 : 1);
  return (
    <View className="flex-1">
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
            Step 3
          </Text>
          <Text className="w-full font-urbanistBold text-5xl text-muted-10">
            Finish up and publish
          </Text>
          <Text className="font-UrbanistMedium text-[1.3rem] leading-normal text-muted-9">
            Finally, you’ll choose booking settings, set up pricing and publish
            your listing.
          </Text>
        </View>
      </View>
      <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
        <Button label="Next" onPress={goNext} />
      </View>
    </View>
  );
};

export default StepThreeInfo;
