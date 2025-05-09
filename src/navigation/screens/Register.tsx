import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, Pressable, Alert } from 'react-native';
import z from 'zod';

import { RootStackParamList } from '../types';

import { Container } from '~/components/Container';
import Button from '~/components/ui/Button';
import DatePicker from '~/components/ui/DatePicker';
import InputField from '~/components/ui/InputField';
type NavProp = NativeStackNavigationProp<RootStackParamList>;

const Register = () => {
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.custom((val) => dayjs.isDayjs(val), {
      message: 'Not valid date type',
    }),
    email: z.string().email(),
  });
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });
  const [isLoading, setLoading] = useState(false);
  const navigation = useNavigation<NavProp>();
  const submit = async (formData: any) => {
    try {
      console.log(formData);
      const data = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email, // make dynamic if needed
        dateOfBirth: dayjs(formData.dateOfBirth)
          .format('YYYY/MM/DD')
          .toString(),
      };
      setLoading(true);
      console.log(data);
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/register`,
        // 'http://localhost:5000/api/auth/register',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Success:', response.data);
      Alert.alert('Success', 'Account registered successfully!');
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container className="p-4">
      <Pressable
        onPress={() => {
          //   router.back();
          navigation.goBack();
        }}
        className="flex flex-row justify-between py-2">
        <Text className="font-urbanist text-primary-normal">back</Text>
      </Pressable>
      <View className="gap-6">
        <View />
        <View className="flex">
          <Text className="font-urbanistBold text-[40px] text-primary-normal">
            Finish setting up
          </Text>
          <Text className="font-urbanistBold text-[40px] leading-10 text-secondary-normal">
            Your account
          </Text>
        </View>
        {/* legal name */}
        <View className="gap-2">
          <Text className="font-UrbanistSemiBold text-muted-12">
            Legal Name
          </Text>
          <View>
            <InputField
              control={control}
              label="First Name on ID"
              name="firstName"
              first
              inputProps={{
                autoComplete: 'name',
              }}
            />
            <InputField
              control={control}
              label="Last Name on ID"
              name="lastName"
              last
              inputProps={{
                autoComplete: 'name-middle',
              }}
            />
          </View>
          <Text className="font-urbanist text-sm">
            Make sure this matches the name of your government ID, if you want
            to go by another name, you can add a preferred first name
          </Text>
        </View>
        {/* Date of birth */}
        <View className="gap-2">
          <Text className="font-UrbanistSemiBold">Date of birth</Text>
          <DatePicker control={control} />
          <Text className="font-urbanist text-sm">
            To signup we need to make sure that you are at least 18. Your
            birthday won’t be shared with other people on Way-Vee
          </Text>
        </View>
        {/* phone number , WIP:email */}
        <View className="gap-2">
          <Text className="font-UrbanistSemiBold">Phone Number</Text>
          <InputField
            control={control}
            name="email"
            label="Email"
            inputProps={{
              keyboardType: 'email-address',
              autoComplete: 'email',
              enterKeyHint: 'done',
            }}
          />
          <Text className="font-urbanist text-sm">
            We’ll send you trip confirmation and receipts.
          </Text>
        </View>
        {/* tncs */}
        <View className="">
          <Text className="font-UrbanistMedium">
            By pressing agree and continue, I agree to Way-Vee’s{' '}
            <Text className="font-UrbanistSemiBold text-blue-700">
              Terms and Services
            </Text>
            ,{' '}
            <Text className="font-UrbanistSemiBold text-blue-700">
              Payment Terms of Service
            </Text>{' '}
            and{' '}
            <Text className="font-UrbanistSemiBold text-blue-700">
              Non-discrimination Policy
            </Text>{' '}
            and acknowledge the{' '}
            <Text className="font-UrbanistSemiBold text-blue-700">
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
        <Button
          label="Agree and continue"
          onPress={handleSubmit(submit)}
          isLoading={isLoading}
        />
      </View>
    </Container>
  );
};

export default Register;
