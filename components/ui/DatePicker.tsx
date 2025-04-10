import clsx from 'clsx';
import dayjs from 'dayjs';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react-native';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { getDatesOfMonth } from '~/utils/helpers';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type props = {
  control: Control<any>;
};

const DatePicker = ({ control }: props) => {
  const [isFocused, setIsFocused] = useState(false);
  //   const check = Dimensions.get('screen');
  const height = Dimensions.get('window').height * 0.3;
  //   const width = Dimensions.get('window').width * 0.35;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const allDates = getDatesOfMonth(year, month); // returns array of dayjs objects
  const firstDayOfMonth = dayjs(new Date(year, month, 1)).day();

  const paddedDates: (dayjs.Dayjs | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...allDates,
  ];
  const [currentView, setCurrentView] = useState<'day' | 'month' | 'year'>(
    'day'
  );

  const [yearPageStart, setYearPageStart] = useState(
    Math.floor(year / 12) * 12
  );

  const handlePrev = () => {
    if (currentView === 'year') {
      setYearPageStart((prev) => prev - 12);
    } else if (currentView === 'day') {
      if (month === 0) {
        setMonth(11);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    }
  };

  const handleNext = () => {
    if (currentView === 'year') {
      setYearPageStart((prev) => prev + 12);
    } else if (currentView === 'day') {
      if (month === 11) {
        setMonth(0);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    }
  };
  // console.log(errors)
  return (
    <Controller
      control={control}
      name="dateOfBirth"
      defaultValue={null}
      render={({ field, fieldState: { error } }) => (
        <View className="relative flex w-full items-center">
          <Pressable
            onPress={() => {
              setIsFocused(!isFocused);
            }}
            className={clsx(
              'flex h-[6vh] w-full flex-row items-center justify-between rounded-xl px-2',
              {
                'border-[1.2px]': isFocused,
                'overflow-hidden border-[0.7px]': !isFocused,
              },
              {
                'border-muted-8': !error?.message,
                'border-red-500': error?.message,
              }
            )}>
            <Text
              className={clsx(
                'font-urbanist text-base',
                error?.message
                  ? 'text-red-500'
                  : {
                      'text-muted-12': field.value,
                      'text-muted-8': !field.value,
                    }
              )}>
              {dayjs.isDayjs(field.value)
                ? field.value.format('YYYY / MM / DD')
                : 'Date of birth'}
            </Text>
            {isFocused ? (
              <ChevronUp size={25} color="#595959" strokeWidth={1.5} />
            ) : (
              <ChevronDown size={25} color="#595959" strokeWidth={1.5} />
            )}
          </Pressable>
          {isFocused && (
            <Animated.View
              style={{
                bottom: -(height + 5),
                height,
              }}
              entering={FadeIn}
              exiting={FadeOut}
              className={clsx(
                // `-bottom-[${height}] h-[${height}]`,
                COLORS.calender_bg,
                'absolute z-50 rounded-xl p-0.5'
              )}>
              <View className="flex h-full w-full shadow-lg shadow-primary-normal">
                {/* header */}
                <View className="my-2 flex w-full flex-row items-center justify-between">
                  <Pressable onPress={handlePrev}>
                    <ChevronLeft color={COLORS.button} strokeWidth={1.5} />
                  </Pressable>
                  <View className="flex flex-row">
                    <Pressable
                      onPress={() => {
                        setCurrentView('month');
                      }}>
                      <Text
                        className={clsx(
                          COLORS.month_heading,
                          'font-UrbanistSemiBold text-lg'
                        )}>
                        {MONTHS[month]}{' '}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setCurrentView('year');
                      }}>
                      <Text
                        className={clsx(
                          COLORS.years_heading,
                          'font-UrbanistSemiBold text-lg'
                        )}>
                        {year}
                      </Text>
                    </Pressable>
                  </View>
                  <Pressable onPress={handleNext}>
                    <ChevronRight color={COLORS.button} strokeWidth={1.5} />
                  </Pressable>
                </View>
                {/* WEEKDAYS */}
                <View className="my-1 flex w-full flex-row flex-wrap">
                  {currentView === 'day' &&
                    DAYS.map((weekday) => (
                      <Text
                        className={clsx(
                          COLORS.weekdays,
                          'flex text-center font-UrbanistMedium',
                          `w-[14.28%]`
                        )}
                        key={weekday}>
                        {weekday}
                      </Text>
                    ))}
                </View>
                {/* days */}
                {currentView === 'day' && (
                  <View className="flex w-full flex-row flex-wrap">
                    {paddedDates.map((val, index) => {
                      const isSelected = field.value?.isSame(val);
                      const invalid = val?.isAfter(today);
                      const isToday =
                        val?.toDate().toDateString() === today.toDateString();

                      return (
                        <View key={index} className="h-9 w-[14.28%] p-[1px]">
                          <Pressable
                            disabled={invalid}
                            onPress={() => {
                              // console.log(val);
                              field.onChange(val);
                              // setSelected(val);
                            }}
                            className={clsx(
                              {
                                'bg-primary-normal': isSelected,
                                'border border-primary-normal': isToday,
                              },
                              'flex h-full items-center justify-center rounded-lg'
                            )}>
                            <Text
                              className={clsx(
                                'text-center font-urbanist',
                                COLORS.days,
                                invalid && COLORS.disabled_days,
                                isSelected && COLORS.selected_day
                              )}>
                              {val ? val.date() : ''}
                            </Text>
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                )}
                {/* year */}
                {currentView === 'year' && (
                  <View className="flex flex-row flex-wrap justify-between gap-[2px]">
                    {Array.from({ length: 12 }).map((_, index) => {
                      const y = yearPageStart + index;
                      const isActiveYear = year === y;
                      return (
                        <Pressable
                          key={y}
                          onPress={() => {
                            setYear(y);
                            setCurrentView('day'); // Go back to date view
                          }}
                          className={clsx(
                            isActiveYear
                              ? 'bg-primary-normal'
                              : `border ${COLORS.unselected_border}`,
                            COLORS.years_range,
                            'w-[32.8%] items-center justify-center rounded-lg p-3'
                          )}>
                          <Text
                            className={clsx(
                              isActiveYear && COLORS.selected_year
                            )}>
                            {y}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
                {/* months */}
                {currentView === 'month' && (
                  <View className="flex flex-row flex-wrap justify-between gap-[2px]">
                    {MONTHS.map((m, i) => {
                      const isActiveMonth = month === i;
                      return (
                        <Pressable
                          key={m}
                          onPress={() => {
                            setMonth(i);
                            setCurrentView('day');
                          }}
                          className={clsx(
                            isActiveMonth
                              ? 'bg-primary-normal'
                              : `border ${COLORS.unselected_border}`,

                            COLORS.months_range,
                            'w-[32.8%] items-center justify-center rounded-lg p-3'
                          )}>
                          <Text
                            className={clsx(
                              isActiveMonth && COLORS.selected_month,
                              'font-UrbanistMedium'
                            )}>
                            {m}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            </Animated.View>
          )}
        </View>
      )}
    />
  );
};

export default DatePicker;

const UI_STYLES = {};

const main_color = 'text-muted-10';

const COLORS = {
  button: '#000',
  calender_bg: 'bg-neutral-n40',
  days: main_color,
  selected_day: 'text-muted-4',
  disabled_days: 'text-muted-7/90',
  weekdays: main_color,
  months_range: main_color,
  month_heading: main_color,
  selected_month: 'text-white',
  years_heading: main_color,
  selected_year: 'text-white',
  years_range: main_color,
  unselected_border: 'border-muted-6/70',
};
