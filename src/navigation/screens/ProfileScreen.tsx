import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Bell,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Gem,
  Handshake,
  LucideIcon,
  MoveLeft,
} from 'lucide-react-native';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../types';

import useUser from '~/store/useUser';
import { DEFAULT_USER_URI } from '~/utils/constants';
type NavProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const { loggedUser } = useUser();
  const options = [
    {
      label: 'My bookings',
      icon: Briefcase,
    },
  ];
  const navigation = useNavigation<NavProp>();
  return (
    <SafeAreaView className="flex-1 gap-8 px-4 pt-20">
      <View className="flex w-full flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <ArrowLeft size={25} color="#242424" />
          </Pressable>
          <Text className="font-UrbanistSemiBold text-4xl">Profile</Text>
        </View>
        <Bell size={30} color="#242424" strokeWidth={1.5} />
      </View>
      <View className="flex w-full flex-row items-center border-b border-muted-6/30 pb-4">
        <View className="aspect-square w-12 overflow-hidden rounded-full">
          <Image
            source={{
              uri: loggedUser?.picture.length
                ? loggedUser.picture
                : DEFAULT_USER_URI,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
        <View className="flex flex-grow flex-row items-center px-2.5">
          <Text className="font-UrbanistMedium text-muted-10">
            {loggedUser?.firstname}
          </Text>
        </View>
        <ChevronRight size={24} color="#242424" />
      </View>
      <View className="gap-2">
        <Text className="mb-4 font-UrbanistSemiBold text-2xl">Settings</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ApplyAgent');
          }}
          className="w-full flex-row items-center gap-2 border-b border-muted-6/30 pb-4">
          <Gem size={24} color="#323232" strokeWidth={1} />
          <Text className="flex-grow font-UrbanistMedium text-lg">
            Become Agent
          </Text>
          <ChevronRight size={24} color="#323232" strokeWidth={1} />
        </TouchableOpacity>
        {options.map((v) => (
          <Option Icon={v.icon} title={v.label} key={v.label} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const Option = ({ title, Icon }: { title: string; Icon: LucideIcon }) => {
  return (
    <TouchableOpacity className="w-full flex-row items-center gap-2 border-b border-muted-6/30 pb-4">
      <Icon size={24} color="#323232" strokeWidth={1} />
      <Text className="flex-grow font-UrbanistMedium text-lg">{title}</Text>
      <ChevronRight size={24} color="#323232" strokeWidth={1} />
    </TouchableOpacity>
  );
};
