import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

export const Container = ({
  children,
  className,
  enableScroll = false,
}: {
  children: React.ReactNode;
  className?: string;
  enableScroll?: boolean;
}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={twMerge(
          'relative flex min-h-screen w-screen flex-1 bg-neutral-n40',
          className
        )}>
        <StatusBar hidden />
        <ScrollView scrollEnabled={enableScroll}>{children}</ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
