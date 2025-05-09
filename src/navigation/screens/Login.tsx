import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import z from 'zod';
import { useStore } from 'zustand';

import { RootStackParamList } from '../types';

import { initializeAuth } from '~/apis/auth';
import GoogleIcon from '~/assets/google-icon.svg';
import { Container } from '~/components/Container';
import InputField from '~/components/ui/InputField';
import { AuthContext } from '~/store/auth';
type NavProp = NativeStackNavigationProp<RootStackParamList>;

const Login = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { registerUser } = useStore(useContext(AuthContext)!, (s) => s);
  const {
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(
      z.object({
        email: z.string().email({ message: 'Please enter a valid email id' }),
      })
    ),
  });
  const { mutateAsync } = useMutation({
    mutationKey: ['auth'],
    mutationFn: initializeAuth,
  });
  const [isLoading, setIsloading] = useState(false);
  const navigation = useNavigation<NavProp>();
  const handleLogin = async (data: { email: string }) => {
    try {
      setIsloading(true);
      await mutateAsync(data);
      // navigation.navigate("")
      navigation.navigate('Verify', { email: data.email });
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data.message &&
        error.status === 404
      ) {
        // setError('root', { message: error.response?.data.message });
        registerUser(data.email);
        setModalVisible(true);
        return;
      }
      console.log(error);
      setError('root', { message: 'Failed to process your request' });
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Container className="flex-col items-center justify-between px-4 py-8">
      <Modal
        isVisible={isModalVisible}
        collapsable
        onBackdropPress={() => {
          setModalVisible(false);
        }}>
        <View className="flex-1 items-center justify-center">
          <View className="flex h-fit w-[90vw] flex-col items-center  rounded-xl bg-neutral-n50 p-2">
            <Text className="w-full text-center font-UrbanistMedium text-lg">
              {getValues('email')} account does not exist
            </Text>
            <Pressable
              onPress={() => {
                // router.navigate('/(auth)/register');
              }}>
              <Text className="text-blue-500 underline">create one</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View className="mb-6 flex w-full items-end">
        {/* <Text className="font-urbanist">skip</Text> */}
      </View>
      {/* contents */}
      <View className="flex w-full flex-1 gap-4">
        {/* screen title */}
        <View>
          <Text className="font-urbanistBold text-5xl text-primary-normal">
            Hello,
          </Text>
          <Text className="font-urbanistBold text-5xl text-secondary-normal">
            There
          </Text>
        </View>
        <Text className="w-full text-center font-urbanist">
          Login or Sign up
        </Text>
        {/* field and button */}
        <View className="flex flex-col gap-2">
          <View>
            <InputField
              label="Email"
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: false,
                autoComplete: 'email',
              }}
              placeholder="Email"
              name="email"
              control={control}
            />
            {(errors.email?.message || errors.root?.message) && (
              <Text className="mt-1 w-full text-center font-UrbanistMedium text-sm text-red-500">
                {errors.email?.message || errors.root?.message}
              </Text>
            )}
          </View>
          <Text className="text-left font-urbanist">
            Well send you verification code on your mail and get you signed up
          </Text>
          <Pressable
            onPress={handleSubmit(handleLogin)}
            className="my-4 flex w-full items-center rounded-xl bg-primary-normal p-3">
            <Text className="font-UrbanistSemiBold text-lg text-muted-1">
              {isLoading ? 'Loading .. ' : 'Log in'}
            </Text>
          </Pressable>
        </View>
        {/* divider */}
        <View className="relative my-2 flex h-fit w-full flex-row items-center justify-between gap-2">
          <View className="h-[0.5px] flex-grow bg-muted-7" />
          <Text className="font-urbanist text-muted-7">or</Text>
          <View className="h-[0.5px] flex-grow bg-muted-7" />
        </View>
        {/* other oauth options */}
        <View>
          <Pressable className="relative flex w-full flex-row items-center justify-center rounded-xl border border-muted-10 p-3">
            <View className="absolute left-2">
              <GoogleIcon />
            </View>
            <Text className="font-UrbanistSemiBold text-lg">
              Continue with google
            </Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
};

export default Login;
