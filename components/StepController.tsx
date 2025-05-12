import { useMutation } from '@tanstack/react-query';
import { JSX } from 'react';
import { useFormContext } from 'react-hook-form';
import { Pressable, View, Text, Alert } from 'react-native';

import Button from './ui/Button';

import { craeteStay } from '~/apis/auth';
import { useListingStore } from '~/store/useListingStore';
import { Stay } from '~/utils/responseTypes';

interface Address {
  city: string;
  country_region: string;
  district: string;
  flat_or_house: string;
  landmark: string;
  pincode: string;
  state: string;
  streetAddress: string;
}

const StepController = ({
  steps,
}: {
  steps: {
    component: () => JSX.Element;
    progress: string[];
    handleNext: (data: Partial<Stay>, tabNum: number) => Promise<void>;
  }[];
}) => {
  const { stay, setTabNum, setId, setAddress } = useListingStore();
  const { currentTab: tabNum } = stay;
  const {
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: craeteStay,
  });
  if (!tabNum) {
    return;
  }
  const goNext = () => setTabNum(tabNum + 1);
  const goBack = () => setTabNum(tabNum > 0 ? tabNum - 1 : 1);
  return (
    <View className="mb-4 w-full flex-row items-center justify-between px-4 py-4">
      {tabNum > 0 && (
        <Pressable onPress={goBack}>
          <Text className="font-bold text-muted-10 underline">Back</Text>
        </Pressable>
      )}
      {tabNum === 0 ? (
        <Button
          label="Get Started"
          isLoading={isPending}
          onPress={async () => {
            try {
              const id = await mutateAsync();
              setTabNum(tabNum + 1);
              setId(id);
            } catch (error) {
              console.log(error);
              Alert.alert('Failed to create stay');
            }
          }}
          className="w-full"
        />
      ) : (
        <Button
          label={tabNum === steps.length - 1 ? 'Publish' : 'Next'}
          onPress={
            tabNum === 5
              ? handleSubmit(async (payload) => {
                  const data = {
                    ...payload,
                    name: payload.flat_or_house,
                  } as any;

                  setAddress({
                    ...data,
                  });
                  steps[tabNum].handleNext(stay, tabNum);
                })
              : async () => {
                  steps[tabNum].handleNext(stay, tabNum);
                }
          }
        />
      )}
    </View>
  );
};

export default StepController;
