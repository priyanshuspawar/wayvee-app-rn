import { useNavigation } from '@react-navigation/native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { X } from 'lucide-react-native';
import { Dimensions, Image, View, Text } from 'react-native';
// import {} from "react-native-mask"
import { Pressable, ScrollView } from 'react-native-gesture-handler';

import { NavProp } from '../types';

import GradientText from '~/components/GradientText';
import { vh } from '~/utils/dimensions';

const AgentApplyScreen = () => {
  const { height } = Dimensions.get('window');
  const navigation = useNavigation<NavProp>();
  const videoSource = require('@Assets/apply_host1.mp4');
  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  return (
    <View className="relative flex h-screen w-screen">
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
        className="absolute left-4 top-10 z-20 rounded-full bg-white p-1">
        <X size={16} color="#303030" strokeWidth={1.5} />
      </Pressable>
      <ScrollView className="relative h-screen w-full flex-1">
        <View
          className="w-full"
          style={{
            position: 'absolute',
            top: 0,
            height: height * 0.53,
          }}>
          <Image
            source={require('@Assets/apply_agent_cover.jpg')}
            className="h-full w-full"
          />
        </View>
        <View
          className="rounded-t-3xl bg-[#0a0a0a] px-8 py-8"
          style={{
            top: height * 0.5,
            width: '100%',
            flex: 1,
            minHeight: height * 0.5,
            height: '100%',
          }}>
          <Text className="text-center font-UrbanistSemiBold text-xl text-white">
            Become a agent and host experience and more
          </Text>
          <GradientText
            text="Earn Money by providing people best around"
            className="text-center font-UrbanistSemiBold text-3xl"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AgentApplyScreen;
