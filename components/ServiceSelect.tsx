// components/MultiSelectInput.tsx
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const serviceOptions = [
  { label: 'Cab', value: 'cab' },
  { label: 'Hotel', value: 'hotel' },
  { label: 'Trekking Guide', value: 'trekking_guide' },
  { label: 'Homestay', value: 'homestay' },
  { label: 'Camping', value: 'camping' },
  { label: 'Bike Rental', value: 'bike_rental' },
  { label: 'Local Cuisine', value: 'local_cuisine' },
];

export const MultiSelectInput = ({
  control,
  name,
}: {
  control: any;
  name: string;
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(serviceOptions);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => {
        // Ensure value is always an array
        const currentValue = Array.isArray(value) ? value : [];

        return (
          <View>
            <DropDownPicker
              multiple
              min={0}
              max={10}
              open={open}
              setOpen={setOpen}
              value={currentValue}
              setValue={(callback) => {
                // Ensure we're handling the value update correctly
                const newValue = callback(currentValue);
                onChange(newValue);
              }}
              items={items}
              setItems={setItems}
              placeholder="Select services"
              dropDownDirection="BOTTOM"
              listMode="SCROLLVIEW"
              mode="BADGE"
              badgeStyle={{
                backgroundColor: '#353535',
              }}
              badgeColors={['#353535']}
              showBadgeDot={false}
              badgeTextStyle={{ fontFamily: 'UrbanistMedium' }}
              style={{
                backgroundColor: '#161616',
                borderColor: '#bfbfbf30',
              }}
              placeholderStyle={{
                color: '#bfbfbf',
              }}
              textStyle={{
                color: '#fff',
              }}
              dropDownContainerStyle={{
                zIndex: 1000,
                backgroundColor: '#161616',
              }}
            />
          </View>
        );
      }}
    />
  );
};
