import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  View,
  Text,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { NavProp } from '../types';

import ApplyAgent from '~/components/ApplyAgentForm';
import Button from '~/components/ui/Button';
import useUser from '~/store/useUser';

const AgentApplyScreen = () => {
  const { height } = Dimensions.get('window');
  const navigation = useNavigation<NavProp>();
  const [onBoardingVisible, setOnboardingVisible] = useState(true);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const { loggedUser } = useUser();

  if (!loggedUser?.governmentId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-muted-6">
        <View className="w-9/12 gap-4 rounded-xl bg-muted-2 px-4 py-8">
          <Text className="text-center font-UrbanistSemiBold text-lg text-muted-10">
            Please Verify Your Account Before Applying as a Agent
          </Text>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <Text className="text-center font-UrbanistMedium text-blue-500">
              Ok
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="relative flex-1">
      <>
        {isImageLoaded && (
          <View className="absolute left-2 top-10 z-20 flex">
            <Pressable
              className="relative w-fit rounded-full bg-muted-2 p-1.5"
              onPress={() => {
                navigation.goBack();
              }}>
              <X size={20} color="#454545" strokeWidth={1.5} />
            </Pressable>
          </View>
        )}
        <KeyboardAwareScrollView
          nestedScrollEnabled
          scrollEnabled={!onBoardingVisible}
          className="relative h-screen w-full flex-1 bg-[#161616]"
          showsVerticalScrollIndicator={false}>
          <View
            className="w-full"
            style={{
              position: 'absolute',
              top: 0,
              height: height * 0.53,
            }}>
            <Image
              source={require('@Assets/apply_agent_cover.jpg')}
              onLoadEnd={() => {
                setImageLoaded(true);
              }}
              className="h-full w-full"
            />
          </View>
          {/* drawer */}
          <View
            className="h-full w-full flex-col justify-between gap-10 rounded-t-3xl bg-[#161616] px-4 py-6"
            style={{
              marginTop: height * 0.5,
              flex: 1,
            }}>
            {onBoardingVisible ? (
              <>
                <Text className="text-center font-urbanistBold text-3xl text-white">
                  Earn Money by providing people best around
                </Text>
                <Text className="text-center font-UrbanistMedium text-xl text-white">
                  Become a verified agent and start helping people explore your
                  city like never before. As an agent, you'll connect travelers
                  to local experiences, hidden spots, and trusted services.
                </Text>
                <Button
                  label="Get Started"
                  variant="primary"
                  onPress={() => {
                    setOnboardingVisible(false);
                  }}
                />
              </>
            ) : (
              <ApplyAgent />
            )}
          </View>
        </KeyboardAwareScrollView>
      </>
    </View>
  );
};

export default AgentApplyScreen;
