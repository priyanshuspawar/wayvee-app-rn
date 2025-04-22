import { useRouter } from 'expo-router';
import { useState, useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStore } from 'zustand';

import { Container } from '~/components/Container';
import Button from '~/components/ui/Button';
import OtpField from '~/components/ui/otp-field';
import { AuthContext } from '~/store/auth';

const VerifySceeen = () => {
  const [codes, setCodes] = useState<string[] | undefined>(Array(6).fill(''));
  const { registeringUserMail } = useStore(useContext(AuthContext)!, (s) => s);
  const router = useRouter();
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
              {codes &&
                codes.map((code, i) => {
                  return (
                    <OtpField
                      code={code}
                      codes={codes}
                      key={i}
                      setCodes={setCodes}
                      i={i}
                    />
                  );
                })}
            </View>
            <View className="flex flex-row">
              <Text className="font-urbanist">Haven't received an SMS ? </Text>
              <Text className="font-UrbanistSemiBold underline">
                Send again
              </Text>
            </View>
          </View>
          <Button
            label="Continue"
            onPress={() => {
              console.log('hello');
            }}
          />
        </View>
      </View>
    </Container>
  );
};

export default VerifySceeen;
