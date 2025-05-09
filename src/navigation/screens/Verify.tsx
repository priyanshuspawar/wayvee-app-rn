import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState, useContext, useRef, RefObject } from 'react';
import { View, Text, Pressable, Alert, TextInput } from 'react-native';
import { useStore } from 'zustand';

import { RootStackParamList } from '../types';

import { Container } from '~/components/Container';
import Button from '~/components/ui/Button';
import OtpField from '~/components/ui/otp-field';
import { AuthContext } from '~/store/auth';
import { save } from '~/store/secure';
import { OtpApiResponse } from '~/utils/responseTypes';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const VerifySceeen = ({ route }: { route: { params: { email: string } } }) => {
  const email = route.params?.email;
  const [codes, setCodes] = useState<string[]>(Array(6).fill(''));
  const refs = useRef<RefObject<TextInput>[]>([]);

  // Safe ref creation only once
  if (refs.current.length === 0) {
    for (let i = 0; i < 6; i++) {
      refs.current.push(React.createRef<TextInput>());
    }
  }
  const navigation = useNavigation<NavProp>();
  const { registeringUserMail } = useStore(useContext(AuthContext)!, (s) => s);
  const store = React.useContext(AuthContext);
  const logUser = useStore(store!, (s) => s.logUser);
  const router = useRouter();
  const submit = async () => {
    try {
      if (!codes || !email) {
        return;
      }
      const otp = codes.join('');
      // console.log(otp);
      const res = await axios.post<OtpApiResponse>(
        process.env.EXPO_PUBLIC_BACKEND_URL! + '/auth/verify-otp',
        {
          email,
          otp,
        }
      );
      await save('token', res.data.token);
      logUser(res.data.data);

      Alert.prompt('Login Success', 'Lets get You onboard', (done) => {
        navigation.replace('Home');
      });
    } catch (error) {
      console.log('OTP error', error);
      Alert.alert('Failed to authenticate');
    }
  };
  return (
    <Container className="flex p-4">
      <Pressable
        onPress={() => {
          router.back();
        }}
        className="flex h-[12vh] flex-row justify-between pt-4">
        <Text className="font-urbanist text-primary-normal">back</Text>
      </Pressable>
      <View>
        <View className="flex gap-8">
          {/* headings */}
          <View className="flex">
            <Text className="font-urbanistBold text-[40px] text-primary-normal">
              Confirm your
            </Text>
            <Text className="font-urbanistBold text-[40px] leading-10 text-secondary-normal">
              Identity
            </Text>
          </View>
          {/* otp and texts */}
          <View className="flex gap-2">
            <Text className="font-urbanist">
              Enter the code we've sent you to your mail
            </Text>
            {registeringUserMail && <Text>{registeringUserMail}</Text>}
            {/* otp container */}
            <View className="relative flex h-12 w-[60vw] flex-row justify-evenly overflow-hidden rounded-xl border-[0.8px] border-muted-10">
              {codes.map((code, i) => (
                <OtpField
                  key={i}
                  i={i}
                  code={code}
                  codes={codes}
                  setCodes={setCodes}
                  refs={refs.current}
                />
              ))}
            </View>
            <View className="flex flex-row">
              <Text className="font-urbanist">Haven't received an SMS ? </Text>
              <Text className="font-UrbanistSemiBold underline">
                Send again
              </Text>
            </View>
          </View>
          <Button label="Continue" onPress={submit} />
        </View>
      </View>
    </Container>
  );
};

export default VerifySceeen;
