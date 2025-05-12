import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { View, Text, Pressable } from 'react-native';

import Button from '~/components/ui/Button';
import { useListingStore } from '~/store/useListingStore';
import { vh, vw } from '~/utils/dimensions';

const StepOneInfo = () => {
  const videoSource = require('@Assets/stepone.mp4');
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  const {
    setTabNum,
    stay: { currentTab: tabNum },
  } = useListingStore();
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
              width: vw(320),
              height: vh(300),
            }}
            player={player}
          />
        </View>
        <View className="gap-4 px-4">
          <Text className="font-UrbanistSemiBold text-2xl text-muted-10">
            Step 1
          </Text>
          <Text className="w-[80%] font-urbanistBold text-[2.5rem] leading-[1] text-muted-10">
            Tell us about your place
          </Text>
          <Text className="font-UrbanistMedium text-[1.3rem] leading-normal text-muted-9">
            In this step, we'll ask you which type of property you have and if
            guests will book the entire place or just a room. Then let us know
            the location and how many guests can stay.
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

export default StepOneInfo;
