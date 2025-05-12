// import SharedRoomIcon from '@Assets/stepone-3-home.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Text, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import z from 'zod';

import { NavProp } from '../types';
import ConfirmAddress from './create-stay/step-one/ConfirmAddress';
import Onboard from './create-stay/step-one/Onboard';
import PlaceLocation from './create-stay/step-one/PlaceLocation';
import PropertyAccess from './create-stay/step-one/PropertyAccess';
import SpaceAndOccupancy from './create-stay/step-one/SpaceAndOccupancy';
import StepOneInfo from './create-stay/step-one/StepOneInfo';
import TypeOfProperty from './create-stay/step-one/TypeOfProperty';
import AddDiscount from './create-stay/step-three/AddDiscounts';
import SetPrice from './create-stay/step-three/SetPrice';
import StepThreeInfo from './create-stay/step-three/StepThreeInfo';
import AddPerks from './create-stay/step-two/AddPearks';
import AddPictures from './create-stay/step-two/AddPictures';
import AmenitiesSelect from './create-stay/step-two/AmenitiesSelect';
import PhotoTour from './create-stay/step-two/PhotoTour';
import StepTwoInfo from './create-stay/step-two/StepTwoInfo';
import WriteDescription from './create-stay/step-two/WriteDescription';
import WriteTitle from './create-stay/step-two/WriteTitle';

import { updateStay } from '~/apis/auth';
import ImageGrid from '~/components/ImageGrid';
import StepController from '~/components/StepController';
import { useListingStore } from '~/store/useListingStore';
import { Stay } from '~/utils/responseTypes';

const CreateStayScreen = () => {
  const { mutateAsync: setUpdate } = useMutation({
    mutationFn: updateStay,
  });
  const { stay, setTabNum } = useListingStore();
  const { currentTab } = stay;
  const update = async (data: Partial<Stay>, tabNum: number) => {
    try {
      const { createdAt, updatedAt, ...updateData } = stay;
      await setUpdate({
        updateStay: {
          ...updateData,
          currentTab: updateData.currentTab + 1,
        },
      });
      setTabNum(tabNum + 1);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      }
      Alert.alert('Failed to send update try again later');
    }
  };
  const steps = [
    { component: Onboard, progress: ['0%', '0%', '0%'] },
    {
      component: StepOneInfo,
      progress: ['0%', '0%', '0%'],
      handleNext: async (data: Partial<Stay>, tabNum: number) => {
        setTabNum(tabNum + 1);
      },
    },
    {
      component: TypeOfProperty,
      progress: ['33%', '0%', '0%'],
      handleNext: update,
    },
    {
      component: PropertyAccess,
      progress: ['45%', '0%', '0%'],
      handleNext: update,
    },
    {
      component: PlaceLocation,
      progress: ['65%', '0%', '0%'],
      handleNext: update,
    },
    {
      component: ConfirmAddress,
      progress: ['75%', '0%', '0%'],
      handleNext: update,
    },
    {
      component: SpaceAndOccupancy,
      progress: ['88%', '0%', '0%'],
      handleNext: update,
    },
    {
      component: StepTwoInfo,
      progress: ['100%', '0%', '0%'],
      handleNext: update,
    },
    {
      component: AmenitiesSelect,
      progress: ['100%', '10%', '0%'],
      handleNext: update,
    },
    {
      component: AddPictures,
      progress: ['100%', '30%', '0%'],
      handleNext: update,
    },
    {
      component: PhotoTour,
      progress: ['100%', '60%', '0%'],
      handleNext: update,
    },
    {
      component: WriteTitle,
      progress: ['100%', '75%', '0%'],
    },
    {
      component: AddPerks,
      progress: ['100%', '75%', '0%'],
    },
    {
      component: WriteDescription,
      progress: ['100%', '85%', '0%'],
    },
    {
      component: StepThreeInfo,
      progress: ['100%', '100%', '0%'],
    },
    { component: SetPrice, progress: ['100%', '100%', '30%'] },
    { component: AddDiscount, progress: ['100%', '100%', '70%'] },
  ];

  const { top } = useSafeAreaInsets();

  const StepComponent = steps[currentTab]?.component ?? Onboard;
  const progress = steps[currentTab]?.progress ?? ['0%', '0%', '0%'];
  return (
    <ConfirmAddressFormProvider>
      <View
        className="h-screen flex-1 flex-col bg-neutral-n0"
        style={{
          paddingTop: top,
        }}>
        <HeaderComponent currentTab={currentTab} />
        <StepComponent />
        {/* <StepProgressor
          progress1={progress[0]}
          progress2={progress[1]}
          progress3={progress[2]}
        /> */}
        {/* <StepController steps={steps as any} /> */}
      </View>
    </ConfirmAddressFormProvider>
  );
};

export default CreateStayScreen;

const HeaderComponent = ({ currentTab }: { currentTab: number }) => {
  const navigation = useNavigation<NavProp>();
  const { enableFullMode } = useListingStore();
  const isFullEnable = enableFullMode;
  if (isFullEnable) {
    return <></>;
  }
  return (
    <View className="mb-4 flex flex-row justify-start px-4">
      <PillButton
        title={currentTab === 0 ? 'Exit' : 'Save and Exit'}
        onPress={() => {
          navigation.navigate('AgentPanel');
        }}
      />
    </View>
  );
};

const PillButton = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center rounded-[2rem] border border-muted-5 px-4 py-4">
      <Text className="w-fit font-UrbanistSemiBold text-muted-10">{title}</Text>
    </Pressable>
  );
};

const StepProgressor = ({
  progress1,
  progress2,
  progress3,
}: {
  progress1: any;
  progress2: any;
  progress3: any;
}) => {
  return (
    <View className="absolute top-0 flex h-1 w-full flex-row">
      <View className="flex flex-grow border-r-2 border-muted-1 bg-muted-5/70">
        <View
          style={{
            backgroundColor: '#262626',
            width: progress1,
            height: '100%',
          }}
        />
      </View>
      <View className="flex flex-grow border-r-2 border-muted-1 bg-muted-5/70">
        <View
          style={{
            backgroundColor: '#050505',
            width: progress2,
            height: '100%',
          }}
        />
      </View>
      <View className="flex flex-grow bg-muted-5/70">
        <View
          style={{
            backgroundColor: '#050505',
            width: progress3,
            height: '100%',
          }}
        />
      </View>
    </View>
  );
};

const ConfirmAddressFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { stay } = useListingStore();
  const defaultValues = {
    flat_or_house: stay.address?.name ?? '',
    country_region: 'IN', // Fallback hardcoded for India if not in address
    city: stay.address?.city ?? '',
    district: stay.address?.district ?? '',
    landmark: stay.address?.nearby_landmark ?? '',
    pincode: stay.address?.pincode ?? '',
    state: stay.address?.state ?? '',
    streetAddress: stay.address?.streetAddress ?? '',
  };
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(
      z.object({
        flat_or_house: z.string().max(30).optional(),
        country_region: z.string().min(1).max(3),
        streetAddress: z.string().min(5).max(50),
        landmark: z.string().max(30).optional(),
        district: z.string().max(30).optional(),
        city: z.string().min(2).max(30),
        state: z.string().min(2).max(30),
        pincode: z.string().min(4).max(8),
      })
    ),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
